# Subscription Tracker

A robust, scalable subscription management system built with Node.js, Express, MongoDB, and Redis. This application helps users track and manage their subscriptions efficiently with features like automated notifications, workflow management, and secure authentication.

## 🚀 Features

- **User Authentication & Authorization**
  - Secure JWT-based authentication
  - Token Refreshing
  - Role-based access control
  - Password hashing with bcrypt

- **Subscription Management**
  - Create, read, update, and delete subscriptions
  - Track subscription status and renewal dates
  - Automated notifications for upcoming renewals

- **Workflow Automation**
  - Integration with Upstash for workflow management
  - Automated email notifications using Nodemailer
  - Redis-based caching for improved performance

- **API Documentation**
  - Swagger/OpenAPI documentation
  - Interactive API testing interface
  - Detailed endpoint documentation

- **Security Features**
  - Helmet.js for security headers
  - CORS configuration
  - Arcjet middleware for rate limiting
  - Environment-based configuration

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT, bcrypt
- **Documentation**: Swagger/OpenAPI
- **Testing**: Postman
- **Security**: Helmet.js, CORS
- **Deployment**: AWS Lambda, API Gateway
- **CI/CD**: Jenkins, Terraform

## 📦 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- AWS Account (for deployment)
- Jenkins (for CI/CD)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/adarsh-k27r/Subscription-Management-System.git
   cd subscription-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Configure the necessary environment variables

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the API documentation**
   - Visit `http://localhost:${PORT}/api-docs`

## 🔧 Configuration

The application uses multiple environment files for different environments:
- `.env.development.local` - Development environment
- `.env.production.local` - Production environment
- `.env` - Default environment

## 🏗️ Architecture

The application follows a modular architecture:
- **Controllers**: Handle business logic
- **Models**: Define database schemas
- **Routes**: Define API endpoints
- **Middlewares**: Handle cross-cutting concerns
- **Utils**: Reusable utility functions
- **Config**: Environment and service configurations

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Helmet.js for security headers
- CORS configuration
- Rate limiting with Arcjet
- Environment-based configuration

## 📚 API Documentation

The API documentation is available at `/api-docs` when the server is running. It includes:
- Detailed endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests

## 🚀 Deployment

The application is configured for deployment to AWS Lambda using:
- Jenkins for CI/CD
- Terraform for infrastructure as code
- AWS Lambda and API Gateway

For detailed deployment instructions, see [CI/CD Setup Guide](ci-cd-README.md).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

Adarsh Kumar

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- Redis team
- AWS team
- Jenkins team
- Terraform team
