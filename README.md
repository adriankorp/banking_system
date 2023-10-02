# Banking System Backend

## Overview
This is the backend system for a banking application.

## Getting Started

### Installation
To install the required dependencies:
npm install

### Running Docker
To run docker: docker-compose up 

To stop docker: 
docker-compose down

### Running the App
To run the app:
npm start

For development mode with auto-reload:
npm run dev

### Scripts
- **start**: Compile TypeScript and run the main app.
- **dev**: Use nodemon for auto-reload during development.
- **build**: Compile TypeScript files.
- **debug**: Run the app with debugging enabled.
- **lint**: Check the code for linting errors.
- **lint:fix**: Fix linting errors.
- **test**: Run the tests.
- **test-debug**: Run tests with debugging enabled.
- **test-debug:path**: Run a specific test path with debugging enabled.
- **test:path**: Run a specific test path.
- **prettier**: Format the code using Prettier.

## Dependencies

### Core Libraries:
- express
- cors
- dotenv
- helmet
- jsonwebtoken
- sequelize
... 

### Development Libraries:
- typescript
- eslint
- mocha
- chai
...

## Environment Configuration

Create a `.env` file in the root of your project and configure:

API_PORT=

MYSQL_HOST=

MYSQL_PORT=

MYSQL_USER=

MYSQL_PASSWORD=

MYSQL_DB=

JWT_SECRET=




