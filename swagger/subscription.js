/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management endpoints
 */

/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     description: Create a new subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Subscription name
 *                 minLength: 3
 *                 maxLength: 50
 *               price:
 *                 type: number
 *                 description: Subscription price
 *                 minimum: 0
 *               description:
 *                 type: string
 *                 description: Subscription description
 *                 minLength: 10
 *                 maxLength: 1000
 *               currency:
 *                 type: string
 *                 description: Subscription currency
 *                 enum: [USD, EUR, INR]
 *                 default: INR
 *               frequency:
 *                 type: string
 *                 description: Subscription frequency
 *                 enum: [daily, weekly, monthly, yearly]
 *                 default: monthly
 *               category:
 *                 type: string
 *                 description: Subscription category
 *                 enum: [free, basic, pro, enterprise]
 *                 default: free
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method
 *                 enum: [UPI, Debit Card, Credit Card, Bank Account]
 *                 default: Credit Card
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of subscription
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscription:
 *                       $ref: '#/components/schemas/Subscription'
 *                     workflowRunId:
 *                       type: string
 *                       description: ID of the workflow run for subscription reminders
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/subscriptions/user/{id}:
 *   get:
 *     summary: Get user's subscriptions
 *     description: Retrieve all subscriptions for a specific user. Users can only access their own subscriptions.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 