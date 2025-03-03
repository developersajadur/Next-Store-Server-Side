# Bicycle Shop API

## Overview

The Bicycle Shop API is a backend service designed to manage bicycle products, orders, and track total revenue. It allows customers to browse bicycles, create orders, and calculates total revenue from completed orders. The API uses **Express.js**, **MongoDB**, **Mongoose**, and **Zod** for validation.

## Features

- **Product Management**: Add, update, and retrieve bicycles with detailed information such as name, brand, price, description, stock quantity, and availability.
- **Order Management**: Place an order for a bicycle, calculate the total price based on the quantity, and manage stock levels.
- **Revenue Calculation**: View the total revenue generated from all completed orders.
- **Stock Management**: Automatically update the bicycle's stock quantity when an order is placed, and set the stock status to `false` if the quantity reaches zero.

## Project Setup

Follow these steps to set up the project locally:

### Prerequisites

Ensure you have the following tools installed:

- **Node.js**: Download and install from [here](https://nodejs.org/).
- **MongoDB**: You need a MongoDB instance running locally or you can use MongoDB Atlas.

### 1. Clone the Repository

```bash
git clone https://github.com/developersajadur/Bicycle-Api-By-Mongoose-And-Typescript.git
cd bicycle-shop-api
2. Install Dependencies
bash
Copy code
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add the following:

.env
Copy code
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bicycle_shop
PORT: The port the application will run on.
MONGODB_URI: Your MongoDB connection string (can be local or MongoDB Atlas).
4. Start the Server
bash
Copy code
npm start
The API will now be running at http://localhost:5000.

Routes:
GET /api/bicycles
Description: Retrieve a list of all bicycles in the shop.

Response:

json
Copy code
[
  {
    "_id": "648a45e5f0123c45678d9012",
    "name": "Mountain Master 7000",
    "brand": "TrailBlaze",
    "price": 450,
    "type": "Mountain",
    "description": "Built for rugged terrain and extreme durability.",
    "quantity": 15,
    "inStock": true,
    "createdAt": "2024-11-19T12:00:00.000Z",
    "updatedAt": "2024-11-19T12:00:00.000Z"
  },
  ...
]
POST /api/orders
Description: Create a new order for a bicycle.

Request Body:

json
Copy code
{
  "email": "customer@example.com",
  "product": "648a45e5f0123c45678d9012",
  "quantity": 2,
  "totalPrice": 600
}
Response:

json
Copy code
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "648b45f5e1234b56789a6789",
    "email": "customer@example.com",
    "product": "648a45e5f0123c45678d9012",
    "quantity": 2,
    "totalPrice": 600,
    "createdAt": "2024-11-19T12:00:00.000Z",
    "updatedAt": "2024-11-19T12:00:00.000Z"
  }

GET /api/orders/revenue
Description: Retrieve the total revenue from all completed orders.

Response:

json
Copy code
{
  "message": "Revenue calculated successfully",
  "status": true,
  "data": {
    "totalRevenue": 2400
  }

Validation
I use Zod for data validation. All incoming data is validated using the defined schemas. If any data fails the validation, a descriptive error message is returned.

Error Handling
If an order fails to meet the validation rules, a 400 status code is returned with detailed error messages.
If there is a server issue, a 500 status code is returned with an error message.
```
