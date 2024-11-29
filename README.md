# BootcampRishon

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Tools and Libraries](#tools-and-libraries)
4. [.env Configuration](#env-configuration)
5. [Key Concepts](#key-concepts)
    - [Routes and Controllers](#routes-and-controllers)
    - [API Versioning](#api-versioning)
    - [Middleware](#middleware)
    - [Module](#module)
6. [Getting Started](#getting-started)
7. [Conclusion](#conclusion)

## Overview

This project follows the MVC (Model-View-Controller) architectural pattern with a few modifications to enhance organization and maintainability.

## Directory Structure

- **`routes/`**: Contains the route definitions. Routes are responsible for defining the endpoints and delegating the request handling to the appropriate controllers.
- **`controllers/`**: Contains the controllers which hold the business logic. Controllers process the incoming requests, interact with the models, and send responses back to the client.
- **`views/`**: Contains the view templates. This directory includes a `partials/` subdirectory that holds reusable parts of web pages, such as headers, footers, and navigation bars.
- **`public/`**: Contains static assets like CSS, JavaScript, and images. These files are accessible to the client and are used for client-side functionality and styling.
- **`models/`**: Contains the MongoDB schemas. Models define the structure of the data and interact with the database.
- **`.env`**: Contains global parameters and environment variables. This file is used to store configuration settings like database connection strings, API keys, and other sensitive information.
- **`public/css/styles.css`**: This file serves as global styling for all files.
- **`utils/`**: Contains utility functions and helper methods that are used across the application. These functions are designed to be reusable and can perform common tasks such as data validation, formatting, and more.

## Tools and Libraries

This project uses the following tools and libraries:

- **jQuery**: A fast, small, and feature-rich JavaScript library.
- **Bootstrap**: A powerful, mobile-first front-end framework for faster and easier web development.
- **Express**: A minimal and flexible Node.js web application framework.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **dotenv**: A module that loads environment variables from a `.env` file into `process.env`.

## .env Configuration

Copy `.env_example` and change the new file's name to `.env`. This will be your local configuration file.
The `.env` file is used to store environment variables that configure the application. Here are some common variables you might need to set:

- `MONGODB_URL`: The connection string for your MongoDB database. Example: `MONGODB_URL=mongodb://localhost:27017/mydatabase`
- `PORT`: The port number on which the server will run. Example: `PORT=8080`
- `SESSION_SECRET`: A secret key used for session management. Example: `SESSION_SECRET=yourSessionSecret`
- `JWT_SECRET`: A secret key for signing JSON Web Tokens (JWT). Example: `JWT_SECRET=mysecretkey`

### Environment Variables

**NODE_ENV**
- `NODE_ENV=development`: For the development environment, typically using HTTP.
- `NODE_ENV=production`: For the production environment, typically using HTTPS.

**HTTP_ONLY**
- `HTTP_ONLY=true`: For the development environment, typically using HTTP.
- `HTTP_ONLY=false`: For the production environment, typically using HTTPS.

### Additional Environment Variables

**SKIP_AUTH**
- `SKIP_AUTH=true`: Set this to `true` to skip authentication for the development environment.
- `SKIP_AUTH=false`: Set this to `false` to enforce authentication for the development
envirnoment.


Make sure to keep the `.env` file secure and do not commit it to version control. Use a `.gitignore` file to exclude it from your repository.

## Key Concepts

### Routes and Controllers

In this project, routes and controllers are separated to improve code organization:

- **Routes**: Define the URL endpoints and map them to the corresponding controller functions.
- **Controllers**: Contain the logic for handling requests, interacting with models, and returning responses.

### API Versioning

The project uses versioning for the API to manage changes and updates without breaking existing clients:

- **/api/v1/**: This directory contains the routes and controllers for version 1 of the API. By separating the API into versions, we can introduce new features or changes in future versions (e.g., `/api/v2/`) without affecting the existing functionality of version 1.

### Middleware

Middleware in web development is like a series of checkpoints or filters that a request passes through before it reaches its final destination. Each checkpoint can do something useful, like checking if you're logged in, making sure your request is safe, or adding some extra information.

### Module

A module in Node.js is a reusable block of code whose existence does not impact other code unless explicitly imported.

## Getting Started

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. [Set up the environment variables in the `.env` file.](#env-configuration)
4. Start the server using `node app.js`.
5. Open your browser and navigate to `http://localhost:8080` to view the application.

## Conclusion

This project structure follows the MVC pattern with a clear separation of concerns, making the codebase organized and maintainable. By separating routes and controllers, using partials in views, and organizing static assets in the public directory, we ensure a clean and efficient development process.