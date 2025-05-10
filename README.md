# Apna Bank - Banking Application

This project consists of two main components:
1. **Frontend**: React-based SPA for Apna Bank digital banking
2. **Backend**: Spring Boot Java backend providing RESTful APIs

## Setup Instructions

### Prerequisites
- Node.js v16+ and npm
- Java 17+
- Maven
- MySQL Server

### Database Setup
1. Create a MySQL database named `bank_db`
2. Configure the database connection in `bakingbackend/src/main/resources/application.properties`

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd bakingbackend
   ```

2. Build the application:
   ```
   mvn clean install
   ```

3. Run the application:
   ```
   mvn spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd bank-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```
   
   The frontend will start on `http://localhost:5173`

## API Documentation

The API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- API Docs: `http://localhost:8080/v3/api-docs`

## Features

- Authentication (Register, Login, OTP Verification)
- Account Management
- Fund Transfers
- Bill Payments and Mobile/DTH Recharges
- Investments (Fixed Deposits, Recurring Deposits, Mutual Funds)
- Loans (Personal, Home, Car)
- User Profile Management

## Integration

The frontend and backend are integrated through RESTful API calls. The main integration points are:

- API Base URL: `http://localhost:8080`
- Authentication: JWT-based token authentication
- API Response Format: All APIs return responses in the following format:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }
  ```

## Troubleshooting

### CORS Issues
If you encounter CORS issues, make sure:
1. Backend CORS settings in `WebConfig.java` are correctly configured
2. Frontend requests are including the correct headers
3. The allowed origins in `application.properties` include your frontend URL

### Connection Issues
If the frontend cannot connect to the backend:
1. Verify the backend is running on port 8080
2. Check if the API base URL in `config.js` is correct
3. Use the connection test utility (`testBackendConnection`) to verify connectivity

### Authentication Issues
If authentication fails:
1. Check JWT token expiration and format
2. Ensure the token is being correctly passed in the Authorization header
3. Verify user credentials in the database 