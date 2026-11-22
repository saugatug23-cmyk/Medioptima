#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <cmath>
#include <algorithm>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;

struct Medicine {
    string id;
    string name;
    int requestedQty;
    int remainingQty;
};

struct InventoryItem {
    int availableQuantity;
    double price;
};

struct Pharmacy {
    string id;
    string name;
    string address;
    double latitude;
    double longitude;
    map<string, InventoryItem> inventory;
    double reliabilityScore;
    double estimatedDeliveryTime;
};

struct Allocation {
    string medicineId;
    string medicineName;
    string pharmacyId;
    string pharmacyName;
    int quantity;
    double unitPrice;
    double cost;
};

double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    if (lat1 == 0 && lon1 == 0) return 2.0;
    const double R = 6371; 
    const double PI = 3.14159265358979323846;
    double dLat = (lat2 - lat1) * PI / 180.0;  
    double dLon = (lon2 - lon1) * PI / 180.0; 
    double a = sin(dLat/2) * sin(dLat/2) +
               cos(lat1 * PI / 180.0) * cos(lat2 * PI / 180.0) * 
               sin(dLon/2) * sin(dLon/2); 
    double c = 2 * atan2(sqrt(a), sqrt(1-a)); 
    return R * c;
}

int main() {
    string inputStr;
    string line;
    while (getline(cin, line)) {
        inputStr += line;
    }

    if(inputStr.empty()) return 0;

    json input;
    try {
        input = json::parse(inputStr);
    } catch(exception& e) {
        cerr << "JSON parse error: " << e.what() << endl;
        return 1;
    }

    map<string, Pharmacy> pharmacies;
    for (auto& item : input["inventoryData"]) {
        string pId = item["pharmacy"]["_id"];
        if (pharmacies.find(pId) == pharmacies.end()) {
            Pharmacy p;
            p.id = pId;
            p.name = item["pharmacy"]["name"];
            p.address = item["pharmacy"].contains("address") && !item["pharmacy"]["address"].is_null() ? item["pharmacy"]["address"].get<string>() : "";
            p.latitude = item["pharmacy"].contains("latitude") && !item["pharmacy"]["latitude"].is_null() ? item["pharmacy"]["latitude"].get<double>() : 0.0;
            p.longitude = item["pharmacy"].contains("longitude") && !item["pharmacy"]["longitude"].is_null() ? item["pharmacy"]["longitude"].get<double>() : 0.0;
            p.reliabilityScore = 0.0;
            p.estimatedDeliveryTime = 0.0;
            pharmacies[pId] = p;
        }
        InventoryItem inv;
        inv.availableQuantity = item.contains("availableQuantity") && !item["availableQuantity"].is_null() ? item["availableQuantity"].get<int>() : 0;
        inv.price = item.contains("price") && !item["price"].is_null() ? item["price"].get<double>() : 0.0;
        pharmacies[pId].inventory[item["medicine"]["_id"]] = inv;
    }

    double userLat = 0.0;
    double userLon = 0.0;
    if (input.contains("userLocation") && !input["userLocation"].is_null()) {
        if (input["userLocation"].contains("lat") && !input["userLocation"]["lat"].is_null()) userLat = input["userLocation"]["lat"];
        if (input["userLocation"].contains("lon") && !input["userLocation"]["lon"].is_null()) userLon = input["userLocation"]["lon"];
    }

    if (input.contains("reliabilityScores") && !input["reliabilityScores"].is_null()) {
        for (auto& el : input["reliabilityScores"].items()) {
            if (pharmacies.count(el.key()) && !el.value().is_null()) {
                pharmacies[el.key()].reliabilityScore = el.value();
            }
        }
    }
    
    if (input.contains("predictedDeliveryTimes") && !input["predictedDeliveryTimes"].is_null()) {
        for (auto& el : input["predictedDeliveryTimes"].items()) {
            if (pharmacies.count(el.key()) && !el.value().is_null()) {
                pharmacies[el.key()].estimatedDeliveryTime = el.value();
            }
        }
    }

    vector<Medicine> requirements;
    for (auto& m : input["requestedMedicines"]) {
        Medicine med;
        med.id = m["id"];
        med.name = m["name"];
        med.requestedQty = m.contains("quantity") && !m["quantity"].is_null() ? m["quantity"].get<int>() : 0;
        med.remainingQty = med.requestedQty;
        requirements.push_back(med);
    }

    auto shortageRisks = input["shortageRisks"];

    set<string> selectedPharmacies;
    vector<Allocation> allocations;

    bool keepGoing = true;
    while (keepGoing) {
        bool needsMore = false;
        for (auto& r : requirements) {
            if (r.remainingQty > 0) needsMore = true;
        }
        if (!needsMore) break;

        keepGoing = false;
        string bestPharmacyId = "";
        double bestCoverageScore = -1e9;
        vector<Allocation> bestCoveredHere;

        for (auto& pair : pharmacies) {
            string pId = pair.first;
            if (selectedPharmacies.count(pId)) continue;
            Pharmacy& pharmacy = pair.second;

            vector<Allocation> coveredHere;
            int unitsCovered = 0;
            double addedCost = 0;
            double totalShortagePenalty = 0;

            for (auto& req : requirements) {
                if (req.remainingQty > 0 && pharmacy.inventory.count(req.id)) {
                    auto& inv = pharmacy.inventory[req.id];
                    if (inv.availableQuantity > 0) {
                        int obtainable = min(inv.availableQuantity, req.remainingQty);
                        Allocation a;
                        a.medicineId = req.id;
                        a.medicineName = req.name;
                        a.pharmacyId = pId;
                        a.pharmacyName = pharmacy.name;
                        a.quantity = obtainable;
                        a.unitPrice = inv.price;
                        a.cost = inv.price * obtainable;
                        coveredHere.push_back(a);

                        unitsCovered += obtainable;
                        addedCost += a.cost;
                        
                        string riskKey = pId + "_" + req.id;
                        if (!shortageRisks.is_null() && shortageRisks.contains(riskKey) && !shortageRisks[riskKey].is_null()) {
                            double risk = shortageRisks[riskKey];
                            totalShortagePenalty += risk * 50.0 * obtainable; // WEIGHTS.shortageRiskWeight = 50
                        }
                    }
                }
            }

            if (unitsCovered == 0) continue;

            double dist = calculateDistance(userLat, userLon, pharmacy.latitude, pharmacy.longitude);
            double reliabilityBonus = pharmacy.reliabilityScore * 200.0; // WEIGHTS.reliabilityWeight = 200
            double timePenalty = pharmacy.estimatedDeliveryTime * 2.0; // WEIGHTS.deliveryTimeWeight = 2

            double heuristicScore = (unitsCovered * 100.0) - (dist * 10.0) - (addedCost * 1.0) - timePenalty - totalShortagePenalty + reliabilityBonus;

            if (heuristicScore > bestCoverageScore) {
                bestCoverageScore = heuristicScore;
                bestPharmacyId = pId;
                bestCoveredHere = coveredHere;
            }
        }

        if (bestPharmacyId != "") {
            selectedPharmacies.insert(bestPharmacyId);
            for (auto& a : bestCoveredHere) {
                allocations.push_back(a);
                for (auto& r : requirements) {
                    if (r.id == a.medicineId) {
                        r.remainingQty -= a.quantity;
                    }
                }
            }
            keepGoing = true;
        }
    }

    // Local Search Improvement
    bool improved = true;
    while (improved && selectedPharmacies.size() > 1) {
        improved = false;
        for (auto it = selectedPharmacies.begin(); it != selectedPharmacies.end(); ++it) {
            string pId = *it;
            vector<Allocation> myAllocations;
            for (auto& a : allocations) {
                if (a.pharmacyId == pId) myAllocations.push_back(a);
            }

            bool canDrop = true;
            vector<Allocation> reallocations;

            for (auto& alloc : myAllocations) {
                int neededQty = alloc.quantity;
                for (string otherPId : selectedPharmacies) {
                    if (otherPId == pId) continue;
                    if (neededQty <= 0) break;
                    
                    Pharmacy& otherPharm = pharmacies[otherPId];
                    if (otherPharm.inventory.count(alloc.medicineId)) {
                        int currentlyAllocated = 0;
                        for (auto& a : allocations) {
                            if (a.pharmacyId == otherPId && a.medicineId == alloc.medicineId) {
                                currentlyAllocated += a.quantity;
                            }
                        }
                        int spareQty = otherPharm.inventory[alloc.medicineId].availableQuantity - currentlyAllocated;
                        if (spareQty > 0) {
                            int takeQty = min(spareQty, neededQty);
                            neededQty -= takeQty;
                            
                            Allocation ra;
                            ra.medicineId = alloc.medicineId;
                            ra.medicineName = alloc.medicineName;
                            ra.pharmacyId = otherPId;
                            ra.pharmacyName = otherPharm.name;
                            ra.quantity = takeQty;
                            ra.unitPrice = otherPharm.inventory[alloc.medicineId].price;
                            ra.cost = ra.unitPrice * takeQty;
                            reallocations.push_back(ra);
                        }
                    }
                }
                if (neededQty > 0) {
                    canDrop = false;
                    break;
                }
            }

            if (canDrop) {
                selectedPharmacies.erase(it);
                vector<Allocation> newAllocations;
                for (auto& a : allocations) {
                    if (a.pharmacyId != pId) newAllocations.push_back(a);
                }
                for (auto& ra : reallocations) {
                    newAllocations.push_back(ra);
                }
                allocations = newAllocations;
                improved = true;
                break;
            }
        }
    }

    double totalDistance = 0;
    double totalCost = 0;
    double maxDeliveryTime = 0;

    json finalPharmacies = json::array();
    for (string pId : selectedPharmacies) {
        Pharmacy& p = pharmacies[pId];
        double pDist = calculateDistance(userLat, userLon, p.latitude, p.longitude);
        totalDistance += pDist;
        if (p.estimatedDeliveryTime > maxDeliveryTime) maxDeliveryTime = p.estimatedDeliveryTime;
        
        json pJson;
        pJson["id"] = p.id;
        pJson["name"] = p.name;
        pJson["address"] = p.address;
        pJson["latitude"] = p.latitude;
        pJson["longitude"] = p.longitude;
        pJson["distance"] = pDist;
        pJson["reliabilityScore"] = p.reliabilityScore;
        pJson["estimatedDeliveryTime"] = p.estimatedDeliveryTime;
        finalPharmacies.push_back(pJson);
    }

    json allocJson = json::array();
    for (auto& a : allocations) {
        totalCost += a.cost;
        json aJson;
        aJson["medicineId"] = a.medicineId;
        aJson["medicineName"] = a.medicineName;
        aJson["pharmacyId"] = a.pharmacyId;
        aJson["pharmacyName"] = a.pharmacyName;
        aJson["quantity"] = a.quantity;
        aJson["unitPrice"] = a.unitPrice;
        aJson["cost"] = a.cost;
        allocJson.push_back(aJson);
    }

    json missingJson = json::array();
    for (auto& r : requirements) {
        if (r.remainingQty > 0) {
            json m;
            m["id"] = r.id;
            m["name"] = r.name;
            m["requestedQty"] = r.requestedQty;
            m["missingQty"] = r.remainingQty;
            missingJson.push_back(m);
        }
    }

    json output;
    output["isComplete"] = missingJson.empty();
    output["missingMedicines"] = missingJson;
    output["allocation"] = allocJson;
    output["selectedPharmacies"] = finalPharmacies;
    output["totalDistance"] = totalDistance;
    output["totalCost"] = totalCost;
    output["maxDeliveryTime"] = maxDeliveryTime;
    output["stops"] = selectedPharmacies.size();

    cout << output.dump() << endl;
    return 0;
}