const express = require("express");
const router = express.Router();

const {
  uploadCsvAndCreateBatch,
  listBatches,
  getBatchDetail,
  updateBatchItems,
  deleteBatch,
} = require("../controllers/bulkUpload");

/**
 * @openapi
 * /api/bulk-upload:
 *   get:
 *     tags: [Bulk Upload]
 *     summary: List bulk-upload batches
 *     responses:
 *       200: { description: A list of batches }
 *   post:
 *     tags: [Bulk Upload]
 *     summary: Upload a CSV and create a bulk-upload batch
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Batch created }
 *       400: { description: Invalid CSV }
 */
router.route("/")
  .post(uploadCsvAndCreateBatch)
  .get(listBatches);

/**
 * @openapi
 * /api/bulk-upload/{batchId}:
 *   get:
 *     tags: [Bulk Upload]
 *     summary: Get batch detail
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Batch detail }
 *       404: { description: Batch not found }
 *   put:
 *     tags: [Bulk Upload]
 *     summary: Update batch items
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Batch updated }
 *   delete:
 *     tags: [Bulk Upload]
 *     summary: Delete a batch
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Batch deleted }
 */
router.route("/:batchId")
  .get(getBatchDetail)
  .put(updateBatchItems)
  .delete(deleteBatch);

module.exports = router;
