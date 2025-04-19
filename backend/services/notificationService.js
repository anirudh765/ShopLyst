const nodemailer = require('nodemailer');
const Notification = require('../models/Alert');
const NotificationSetting = require('../models/notificationSetting');
const { io } = require('../utils/socket');

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmailNotification(to, subject, text, html) {
  return transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text, html });
}

async function sendPriceDropNotification(userId, userEmail, product, oldPrice, newPrice) {
  const title = `Price dropped for ${product.name}`;
  const message = `Price dropped from ${oldPrice} to ${newPrice}. <a href="${product.url}">View</a>`;

  // Save alert
  const alert = await Notification.create({ user: userId, title, message });

  // Emit via Socket.io
  io.to(userId.toString()).emit('price-drop', alert);

  // Email if enabled
  const settings = await NotificationSetting.findOne({ user: userId });
  if (settings?.emailAlerts) {
    await sendEmailNotification(userEmail, title, message, `<p>${message}</p>`);
  }

  return alert;
}

module.exports = { sendEmailNotification, sendPriceDropNotification };