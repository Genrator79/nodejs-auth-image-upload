# Auth-Based Image Uploader

A secure backend application built with Node.js, Express, and MongoDB for image uploading with user authentication and role-based access control.

---

## Features

- User registration and login with JWT-based authentication  
- Password hashing using bcrypt for secure storage  
- Role-based access: admin-only image uploads and user-specific image deletion  
- Image upload and management using Multer and Cloudinary  
- Protected routes for enhanced security  
- RESTful API design

---

## Tech Stack

- Node.js  
- Express.js  
- MongoDB & Mongoose  
- JWT for authentication  
- bcrypt for password hashing  
- Multer for handling multipart/form-data uploads  
- Cloudinary for image storage and management  

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## API Endpoints

- `POST /api/auth/register` — Register a new user  
- `POST /api/auth/login` — Login and receive JWT token  
- `POST /api/images/upload` — Upload an image (admin only)  
- `DELETE /api/images/:id` — Delete an image (uploaded by user)  
- `GET /api/images` — Get all images uploaded by the user  

---
