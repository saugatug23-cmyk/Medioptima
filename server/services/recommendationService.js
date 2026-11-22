/**
 * Medicine Recommendation / Substitute Engine
 */
const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');

exports.getRecommendations = async (medicineId, requestedQty) => {
  const reqQty = parseInt(requestedQty) || 1;

  // 1. Fetch requested medicine
  const original = await Medicine.findById(medicineId);
  if (!original) {
    throw new Error('Requested medicine not found');
  }

  // Find average price of original medicine for cost comparison
  const originalInventories = await Inventory.find({ medicine: medicineId });
  let originalAvgPrice = 0;
  if (originalInventories.length > 0) {
    const total = originalInventories.reduce((sum, inv) => sum + inv.price, 0);
    originalAvgPrice = total / originalInventories.length;
  }

  // 2. Find Candidates (Same Generic OR Same Category)
  const candidates = await Medicine.find({
    _id: { $ne: original._id },
    $or: [
      { genericName: original.genericName },
      { category: original.category }
    ]
  });

  if (candidates.length === 0) {
    return {
      requestedMedicine: { id: original._id, name: original.name },
      recommendations: []
    };
  }

  // 3. Fetch Inventory for Candidates
  const candidateIds = candidates.map(c => c._id);
  const candidateInventories = await Inventory.find({ medicine: { $in: candidateIds } });

  // 4. Calculate Scores
  const recommendations = [];

  for (const candidate of candidates) {
    // Determine Availability & Pricing
    const inventories = candidateInventories.filter(inv => inv.medicine.toString() === candidate._id.toString());
    
    let totalAvailable = 0;
    let minPrice = Infinity;

    for (const inv of inventories) {
      totalAvailable += inv.quantity;
      if (inv.price < minPrice) minPrice = inv.price;
    }

    if (minPrice === Infinity) minPrice = 0;

    // --- Scoring Logic ---
    
    // Similarity Score (Max 1.0)
    let similarityScore = 0;
    let isExactGeneric = false;

    if (candidate.genericName && original.genericName && 
        candidate.genericName.toLowerCase() === original.genericName.toLowerCase()) {
      similarityScore += 0.8;
      isExactGeneric = true;
    } else if (candidate.category && original.category && 
               candidate.category.toLowerCase() === original.category.toLowerCase()) {
      similarityScore += 0.3;
    }

    if (candidate.form && original.form && 
        candidate.form.toLowerCase() === original.form.toLowerCase()) {
      similarityScore += 0.1;
    }
    
    similarityScore = Math.min(1.0, similarityScore);

    // Availability Score (Max 1.0)
    let availabilityScore = 0;
    if (totalAvailable >= reqQty) {
      availabilityScore = 1.0;
    } else if (totalAvailable > 0) {
      availabilityScore = 0.5;
    }

    // Cost Score (Max 1.0)
    let costScore = 0.5; // default
    if (minPrice > 0 && originalAvgPrice > 0) {
      if (minPrice <= originalAvgPrice) {
        costScore = 1.0; // Cheaper or equal
      } else if (minPrice < originalAvgPrice * 1.5) {
        costScore = 0.7; // Slightly more expensive
      } else {
        costScore = 0.2; // Much more expensive
      }
    } else if (minPrice > 0 && originalAvgPrice === 0) {
      costScore = 0.5; // No original price baseline
    }

    // Final Weighted Score
    const finalScore = (similarityScore * 0.5) + (availabilityScore * 0.3) + (costScore * 0.2);

    // Determine reason text safely
    let reason = '';
    if (isExactGeneric) {
      reason = 'Same generic composition';
    } else {
      reason = 'Similar therapeutic category';
    }
    if (availabilityScore === 1.0) {
      reason += ' and currently in stock';
    }

    recommendations.push({
      medicineId: candidate._id,
      name: candidate.name,
      genericName: candidate.genericName,
      form: candidate.form,
      similarityScore: parseFloat(similarityScore.toFixed(2)),
      overallScore: parseFloat(finalScore.toFixed(2)),
      availability: totalAvailable > 0 ? (totalAvailable >= reqQty ? 'Available' : 'Partial') : 'Unavailable',
      totalAvailable,
      price: minPrice > 0 ? minPrice : null,
      reason
    });
  }

  // Sort by overallScore descending
  recommendations.sort((a, b) => b.overallScore - a.overallScore);

  return {
    requestedMedicine: { id: original._id, name: original.name },
    recommendations: recommendations.slice(0, 5) // Top 5
  };
};
