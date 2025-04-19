const mongoose = require('mongoose');

const notificationSettingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailAlerts: { type: Boolean, default: true },
  pushAlerts: { type: Boolean, default: false },
  minPriceDrop: { type: Number, default: 5 }, // percent
  instantAlerts: { type: Boolean, default: true }
});

module.exports = mongoose.model('NotificationSetting', notificationSettingSchema);
