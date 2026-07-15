const express = require('express');

const router = express.Router();

const {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers, 
    getUserByEmail
  } = require('../controllers/users');

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *   post:
 *     tags: [Users]
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400: { description: Invalid input (missing/invalid email or password < 8 chars) }
 */
  router.route('/')
  .get(getAllUsers)
  .post(createUser);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: The user, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 *       404: { description: User not found }
 *   put:
 *     tags: [Users]
 *     summary: Update a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       200: { description: User updated }
 *       404: { description: User not found }
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: User deleted }
 *       404: { description: User not found }
 */
  router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

/**
 * @openapi
 * /api/users/email/{email}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string, format: email }
 *     responses:
 *       200: { description: The user, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 *       404: { description: User not found }
 */
  router.route('/email/:email')
  .get(getUserByEmail);


  module.exports = router;