const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    authProvider: { type: String, default: 'local' },
    supabaseUserId: { type: String, sparse: true, unique: true },
    phone: { type: String },
    role: { type: String, enum: ['PATIENT', 'ADMIN', 'PHARMACY'], default: 'PATIENT' },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    }
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
