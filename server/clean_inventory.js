const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const inventorySchema = new mongoose.Schema({
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  availableQuantity: Number,
  price: Number,
  lastUpdated: Date
}, { timestamps: true, strict: false });

const Inventory = mongoose.model('Inventory', inventorySchema);

async function cleanDuplicates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medioptima');
    console.log('Connected to MongoDB');

    const allInventory = await Inventory.find({});
    console.log(`Found ${allInventory.length} total inventory records.`);

    const grouped = {};
    allInventory.forEach(inv => {
      const key = `${inv.pharmacy}_${inv.medicine}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(inv);
    });

    let removedCount = 0;

    for (const [key, records] of Object.entries(grouped)) {
      if (records.length > 1) {
        records.sort((a, b) => new Date(b.lastUpdated || b.createdAt) - new Date(a.lastUpdated || a.createdAt));
        
        const keeper = records[0];
        const duplicates = records.slice(1);
        
        console.log(`Key ${key} has ${records.length} records. Keeping ${keeper._id}, removing ${duplicates.length}`);
        
        for (const dup of duplicates) {
          await Inventory.findByIdAndDelete(dup._id);
          removedCount++;
        }
      }
    }

    console.log(`Removed ${removedCount} duplicate inventory records.`);

    try {
      await Inventory.collection.dropIndex('pharmacy_1_medicine_1');
    } catch (e) {
      console.log('Index did not exist yet or could not be dropped:', e.message);
    }
    
    await Inventory.collection.createIndex({ pharmacy: 1, medicine: 1 }, { unique: true });
    console.log('Unique compound index recreated safely.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

cleanDuplicates();