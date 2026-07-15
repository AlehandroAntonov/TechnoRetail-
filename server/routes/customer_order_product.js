const express = require('express');

const router = express.Router();

const {
    createOrderProduct,
     updateProductOrder,
      deleteProductOrder,
       getProductOrder,
       getAllProductOrders
  } = require('../controllers/customer_order_product');

/**
 * @openapi
 * /api/order-product:
 *   get:
 *     tags: [Order Products]
 *     summary: List all order-product links
 *     responses:
 *       200:
 *         description: A list of order-product links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/OrderProduct' }
 *   post:
 *     tags: [Order Products]
 *     summary: Add a product to an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OrderProductInput' }
 *     responses:
 *       201:
 *         description: Product added to order
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OrderProduct' }
 */
  router.route('/')
  .get(getAllProductOrders)
  .post(createOrderProduct);

/**
 * @openapi
 * /api/order-product/{id}:
 *   get:
 *     tags: [Order Products]
 *     summary: Get order products for an order id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Customer order id.
 *     responses:
 *       200:
 *         description: Products in the order (with product details)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/OrderProduct' }
 *   put:
 *     tags: [Order Products]
 *     summary: Update an order-product link
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OrderProductInput' }
 *     responses:
 *       200: { description: Updated }
 *   delete:
 *     tags: [Order Products]
 *     summary: Delete order-product links for an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 */
  router.route('/:id')
  .get(getProductOrder)
  .put(updateProductOrder)
  .delete(deleteProductOrder);


  module.exports = router;