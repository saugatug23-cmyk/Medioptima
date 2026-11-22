const { spawn } = require('child_process');
const path = require('path');
const HistoricalDemand = require('../models/HistoricalDemand');
const Inventory = require('../models/Inventory');

function runPythonScript(task, data) {
  return new Promise((resolve, reject) => {
    const pyPath = path.join(__dirname, '..', 'ml', 'predict.py');
    const child = spawn('python', [pyPath]);

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error('Python ML Error:', errorOutput);
        reject(new Error('ML engine failed'));
        return;
      }
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        console.error('Failed to parse Python output:', err);
        reject(new Error('Failed to parse ML results'));
      }
    });

    child.stdin.write(JSON.stringify({ task, data }));
    child.stdin.end();
  });
}

exports.trainModel = async () => {
  console.log('Training Python ML Shortage Prediction Model...');
  let allHistory = await HistoricalDemand.find({}).sort({ date: 1 });
  
  // (Auto-generate demo data if empty... keeping the original logic for generating it)
  if (allHistory.length === 0) {
    console.log('No historical data found. Auto-generating development ML data...');
    const inventories = await Inventory.find().populate('medicine').populate('pharmacy');
    if (inventories.length > 0) {
      const historyRecords = [];
      const today = new Date();
      for (const inv of inventories) {
        const baseDemand = Math.floor(Math.random() * 10) + 2; 
        let currentSimulatedStock = Math.floor(Math.random() * 100) + 50;
        const leadTime = Math.floor(Math.random() * 10) + 2;
        for (let i = 60; i >= 1; i--) {
          const recordDate = new Date();
          recordDate.setDate(today.getDate() - i);
          let dailyDemand = Math.floor(baseDemand * (0.5 + Math.random()));
          if (Math.random() > 0.9) dailyDemand += Math.floor(Math.random() * 20);
          if (currentSimulatedStock <= leadTime * baseDemand * 0.5) {
            currentSimulatedStock += Math.floor(Math.random() * 100) + 50; 
          }
          const unitsSold = Math.min(dailyDemand, currentSimulatedStock);
          currentSimulatedStock -= unitsSold;
          historyRecords.push({
            pharmacy: inv.pharmacy._id,
            medicine: inv.medicine._id,
            date: recordDate,
            availableStock: currentSimulatedStock,
            unitsSold: unitsSold,
            isStockout: currentSimulatedStock === 0,
            supplierLeadTimeDays: leadTime,
            isDemoData: true
          });
        }
      }
      await HistoricalDemand.insertMany(historyRecords);
      allHistory = await HistoricalDemand.find({}).sort({ date: 1 });
    }
  }

  const grouped = {};
  allHistory.forEach(record => {
    const key = record.pharmacy + '_' + record.medicine;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      date: record.date.getTime(),
      availableStock: record.availableStock,
      unitsSold: record.unitsSold,
      isStockout: record.isStockout,
      supplierLeadTimeDays: record.supplierLeadTimeDays
    });
  });

  try {
    const result = await runPythonScript('train_shortage', grouped);
    console.log('ML Model trained successfully on Python Layer:', result);
  } catch(e) {
    console.error('ML Training failed:', e);
  }
};

exports.predictShortage = async (pharmacyId, medicineId) => {
  const inventory = await Inventory.findOne({ pharmacy: pharmacyId, medicine: medicineId });
  if (!inventory) {
    return { error: 'Insufficient data' };
  }

  const history = await HistoricalDemand.find({ pharmacy: pharmacyId, medicine: medicineId })
    .sort({ date: -1 })
    .limit(30);

  if (history.length < 14) {
    return { error: 'Insufficient data' };
  }

  const payload = {
    currentStock: inventory.quantity,
    leadTime: history[0].supplierLeadTimeDays || 3,
    history: history.map(r => ({
      date: r.date.getTime(),
      availableStock: r.availableStock,
      unitsSold: r.unitsSold,
      isStockout: r.isStockout,
      supplierLeadTimeDays: r.supplierLeadTimeDays
    }))
  };

  try {
    return await runPythonScript('predict_shortage', payload);
  } catch (e) {
    console.error('Python predict fallback:', e);
    return {
      riskLevel: 'MEDIUM',
      riskScore: 0.5,
      reasons: ['Fallback prediction used'],
      hasData: true
    };
  }
};