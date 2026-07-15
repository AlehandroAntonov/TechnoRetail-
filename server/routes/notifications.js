const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  createNotification,
  updateNotification,
  bulkMarkAsRead,
  deleteNotification,
  bulkDeleteNotifications,
  getUnreadCount
} = require('../controllers/notificationController');

/**
 * @openapi
 * /api/notifications/{userId}/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: { unreadCount: { type: integer } }
 */
router.get('/:userId/unread-count', getUnreadCount);

/**
 * @openapi
 * /api/notifications/{userId}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notifications for a user (with filtering/pagination)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The user's notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Notification' }
 */
router.get('/:userId', getUserNotifications);

/**
 * @openapi
 * /api/notifications:
 *   post:
 *     tags: [Notifications]
 *     summary: Create a notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Notification' }
 *     responses:
 *       201: { description: Notification created }
 */
router.post('/', createNotification);

/**
 * @openapi
 * /api/notifications/mark-read:
 *   post:
 *     tags: [Notifications]
 *     summary: Bulk mark notifications as read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids: { type: array, items: { type: string } }
 *     responses:
 *       200: { description: Notifications marked as read }
 */
router.post('/mark-read', bulkMarkAsRead);

/**
 * @openapi
 * /api/notifications/bulk:
 *   delete:
 *     tags: [Notifications]
 *     summary: Bulk delete notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids: { type: array, items: { type: string } }
 *     responses:
 *       200: { description: Notifications deleted }
 */
router.delete('/bulk', bulkDeleteNotifications);

/**
 * @openapi
 * /api/notifications/{id}:
 *   put:
 *     tags: [Notifications]
 *     summary: Update a notification (mark read/unread)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notification updated }
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a single notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Notification deleted }
 */
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);

module.exports = router;