import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const { version } = packageJson;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subscription Tracker API',
      version,
      description: 'API documentation for Subscription Tracker application',
      contact: {
        name: 'Adarsh Kumar',
        email: 'adarshkr010122@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
            },
            name: {
              type: 'string',
              description: 'User name',
              minLength: 3,
              maxLength: 50,
            },
            email: {
              type: 'string',
              description: 'User email',
              format: 'email',
            },
            password: {
              type: 'string',
              description: 'User password (will be hashed)',
              minLength: 8,
            },
            role: {
              type: 'string',
              description: 'User role',
              enum: ['admin', 'user'],
              default: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Subscription: {
          type: 'object',
          required: ['name', 'price', 'description', 'startDate', 'user'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
            },
            name: {
              type: 'string',
              description: 'Subscription name',
              minLength: 3,
              maxLength: 50,
            },
            price: {
              type: 'number',
              description: 'Subscription price',
              minimum: 0,
            },
            description: {
              type: 'string',
              description: 'Subscription description',
              minLength: 10,
              maxLength: 1000,
            },
            currency: {
              type: 'string',
              description: 'Subscription currency',
              enum: ['USD', 'EUR', 'INR'],
              default: 'INR',
            },
            frequency: {
              type: 'string',
              description: 'Subscription frequency',
              enum: ['daily', 'weekly', 'monthly', 'yearly'],
              default: 'monthly',
            },
            category: {
              type: 'string',
              description: 'Subscription category',
              enum: ['free', 'basic', 'pro', 'enterprise'],
              default: 'free',
            },
            paymentMethod: {
              type: 'string',
              description: 'Payment method',
              enum: ['UPI', 'Debit Card', 'Credit Card', 'Bank Account'],
              default: 'Credit Card',
            },
            status: {
              type: 'string',
              description: 'Subscription status',
              enum: ['active', 'cancelled', 'expired'],
              default: 'active',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Start date of subscription',
            },
            renewalDate: {
              type: 'string',
              format: 'date-time',
              description: 'Next renewal date, auto-calculated based on frequency',
            },
            user: {
              type: 'string',
              description: 'User ID who owns this subscription',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false,
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './swagger/*.js'],
};

const specs = swaggerJsdoc(options);

const serve = swaggerUi.serve;
const setup = swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
});

export { serve, setup };