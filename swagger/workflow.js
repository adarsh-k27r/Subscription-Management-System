/**
 * @swagger
 * tags:
 *   name: Workflows
 *   description: Internal workflow management endpoints
 */

/**
 * @swagger
 * /api/v1/workflows/subscription/reminder:
 *   post:
 *     summary: Send subscription reminders
 *     description: Internal endpoint to manage subscription reminder workflows
 *     tags: [Workflows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionId
 *             properties:
 *               subscriptionId:
 *                 type: string
 *                 description: ID of the subscription to send reminders for
 *     responses:
 *       200:
 *         description: Workflow executed successfully
 *       401:
 *         description: Not authorized - requires internal API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 