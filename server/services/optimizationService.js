const { spawn } = require('child_process');
const path = require('path');

exports.generatePharmacyPlan = (
  requestedMedicines, 
  inventoryData, 
  userLocation = {}, 
  shortageRisks = {}, 
  reliabilityScores = {},
  predictedDeliveryTimes = {}
) => {
  return new Promise((resolve, reject) => {
    const exePath = path.join(__dirname, '..', 'engine', 'optimizer.exe');
    const child = spawn(exePath);

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
        console.error('C++ Optimizer Error:', errorOutput);
        reject(new Error('Optimization engine failed'));
        return;
      }
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        console.error('Failed to parse C++ output:', err);
        console.error('Raw Output:', output);
        reject(new Error('Failed to parse optimization results'));
      }
    });

    const inputData = {
      requestedMedicines,
      inventoryData,
      userLocation,
      shortageRisks,
      reliabilityScores,
      predictedDeliveryTimes
    };

    child.stdin.write(JSON.stringify(inputData));
    child.stdin.end();
  });
};