import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import warnings
import os
import pickle

warnings.filterwarnings('ignore')

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'rf_model.pkl')

def extract_features(history, current_stock, lead_time):
    if not history or len(history) < 14:
        return None
    
    history = sorted(history, key=lambda x: x['date'], reverse=True)
    
    recent30 = history[:30]
    recent7 = history[:7]
    
    demand30d = sum(r.get('unitsSold', 0) for r in recent30)
    avgDemand30d = demand30d / len(recent30) if recent30 else 0
    
    demand7d = sum(r.get('unitsSold', 0) for r in recent7)
    avgDemand7d = demand7d / len(recent7) if recent7 else 0
    
    stockouts30d = sum(1 for r in recent30 if r.get('isStockout'))
    
    safeAvgDemand = max(avgDemand7d, 0.1)
    daysOfStockRemaining = current_stock / safeAvgDemand
    
    return [current_stock, avgDemand30d, avgDemand7d, daysOfStockRemaining, lead_time, stockouts30d]

def train_shortage(data):
    X = []
    y = []
    
    for key, records in data.items():
        if len(records) < 30:
            continue
        
        records = sorted(records, key=lambda x: x['date'])
        
        for i in range(len(records) - 44):
            historyWindow = records[i:i+30]
            futureWindow = records[i+30:i+44]
            
            currentStock = historyWindow[-1].get('availableStock', 0)
            leadTime = historyWindow[-1].get('supplierLeadTimeDays', 3)
            
            features = extract_features(historyWindow, currentStock, leadTime)
            if not features:
                continue
                
            hasFutureStockout = 1 if any(r.get('isStockout') for r in futureWindow) else 0
            
            X.append(features)
            y.append(hasFutureStockout)
            
    if not X:
        return {"status": "error", "message": "Insufficient data"}
        
    clf = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42)
    clf.fit(X, y)
    
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(clf, f)
        
    return {"status": "success", "samples": len(X)}

def predict_shortage(data):
    history = data.get("history", [])
    currentStock = data.get("currentStock", 0)
    leadTime = data.get("leadTime", 3)
    
    features = extract_features(history, currentStock, leadTime)
    if not features:
        return {"error": "Insufficient data"}
        
    safeAvgDemand = max(features[2], 0.1)
    daysOfStockRemaining = currentStock / safeAvgDemand
    
    riskScore = 0.0
    bufferRatio = daysOfStockRemaining / (leadTime + 2)
    
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, 'rb') as f:
                clf = pickle.load(f)
            
            pred_class = clf.predict([features])[0]
            
            if pred_class == 1:
                riskScore = max(0.7, 1 - (bufferRatio * 0.3))
            else:
                riskScore = min(0.6, 1 / (bufferRatio + 1))
        except Exception as e:
            riskScore = min(1.0, 1 / (bufferRatio + 0.1))
    else:
        riskScore = min(1.0, 1 / (bufferRatio + 0.1))
        
    riskScore = max(0.0, min(1.0, riskScore))
    
    riskLevel = 'LOW'
    if riskScore > 0.75:
        riskLevel = 'HIGH'
    elif riskScore > 0.4:
        riskLevel = 'MEDIUM'
        
    reasons = []
    if currentStock < features[2] * 3:
        reasons.append('Stock is critically low')
    if features[2] > features[1] * 1.5:
        reasons.append('Recent demand is unusually high')
    if daysOfStockRemaining <= leadTime:
        reasons.append('Supplier lead time is longer than remaining stock')
    if features[5] > 0:
        reasons.append(f'Experienced {features[5]} stockouts in the last 30 days')
        
    if not reasons:
        reasons.append('Stock levels and demand are stable')
        
    return {
        "riskLevel": riskLevel,
        "riskScore": round(riskScore, 2),
        "reasons": reasons,
        "hasData": True
    }

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            return
            
        request = json.loads(input_data)
        task = request.get("task")
        payload = request.get("data")
        
        if task == "train_shortage":
            result = train_shortage(payload)
            print(json.dumps(result))
        elif task == "predict_shortage":
            result = predict_shortage(payload)
            print(json.dumps(result))
        else:
            print(json.dumps({"error": "Unknown task"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()