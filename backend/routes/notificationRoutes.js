const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Notification = require('../models/Alert');
const NotificationSetting = require('../models/notificationSetting');

router.use(authMiddleware);

// @GET /api/alerts
router.get('/', async (req, res) => {
  const { page = 1, limit = 20, unread } = req.query;
  try {
    const query = { user: req.user.id };
    if (unread === 'true') query.read = false;
    if (unread === 'false') query.read = true;

    const alerts = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit);

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// @GET /api/alerts/:id
router.get('/:id', async (req, res) => {
  try {
    const alert = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

// @PUT /api/alerts/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const alert = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark alert as read' });
  }
});

// @PUT /api/alerts/read-all
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ message: 'All alerts marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all alerts as read' });
  }
});

// @DELETE /api/alerts/:id
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// @DELETE /api/alerts
router.delete('/', async (req, res) => {
  const { status = 'all' } = req.query;
  const query = { user: req.user.id };

  if (status === 'read') query.read = true;
  else if (status === 'unread') query.read = false;

  try {
    await Notification.deleteMany(query);
    res.json({ message: 'Alerts deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear alerts' });
  }
});

// @GET /api/alerts/settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await NotificationSetting.findOne({ user: req.user.id });
    if (!settings) {
      settings = new NotificationSetting({ user: req.user.id });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// @PUT /api/alerts/settings
router.put('/settings', async (req, res) => {
  const { emailAlerts, pushAlerts, minPriceDrop, instantAlerts } = req.body;
  try {
    const updated = await NotificationSetting.findOneAndUpdate(
      { user: req.user.id },
      { emailAlerts, pushAlerts, minPriceDrop, instantAlerts },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// @GET /api/alerts/unread-count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user.id, read: false });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// @POST /api/alerts/test
router.post('/test', async (req, res) => {
  try {
    const alert = new Notification({
      user: req.user.id,
      title: 'Test Notification',
      message: 'This is a test alert to check notification system',
      read: false,
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

module.exports = router;