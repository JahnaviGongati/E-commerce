# ShopEasy - Full Stack E-Commerce Store

ShopEasy is a full-stack e-commerce web application developed as a capstone project. It provides a simple and responsive online shopping experience with user authentication, product management, shopping cart, and checkout functionality.

## Features

- User Registration and Login
- JWT-based Authentication
- User Logout
- Product Catalog
- Product Search
- Category Filtering
- Add Products to Cart
- Increase and Decrease Cart Quantity
- Remove Products from Cart
- Checkout
- Order Placement
- Order Storage in MongoDB
- Product CRUD APIs
  - Create
  - Read
  - Update
  - Delete
- RESTful API using Express.js
- MongoDB Atlas Database
- Responsive Frontend

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Tools
- Visual Studio Code
- Postman
- MongoDB Atlas
- Git
- GitHub

## Project Structure

```text
e-commerce/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── index.html
    ├── login.html
    ├── signup.html
    ├── products.html
    ├── cart.html
    ├── checkout.html
    ├── style.css
    └── script.js
