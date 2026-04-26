# 👗 Cloth Rental App (Thriftyyy)

Thriftyyy is a full-stack web application that allows users to rent clothing for special occasions instead of purchasing expensive outfits.

It provides an efficient platform for browsing, booking, and managing rental clothing, while also enabling admins to manage inventory and bookings.

---

## 🚀 Live Demo
🔗 https://thriftyyy.vercel.app/

---

## 🧠 Problem Statement

Many people prefer renting clothes for occasions like weddings or parties instead of buying expensive outfits. However, there is a lack of simple and efficient digital platforms to:

- Browse available clothing  
- Check availability for specific dates  
- Rent items seamlessly  

This application solves that problem by providing a structured rental system.

---

## 📌 Features

### 👤 User Features
- Register & Login (JWT Authentication)
- Browse clothing catalog
- Filter items by category (wedding, party, casual, etc.)
- Check availability for selected dates
- Rent outfits for a defined period
- View booking history

### 🛠️ Admin Features
- Add / Edit / Delete clothing items
- Manage inventory
- Track bookings and returns
- Monitor user activity

---

## 🔄 System Flow

### User Flow
1. Register / Login  
2. Browse clothes  
3. Select item  
4. Check availability  
5. Book item  
6. (Optional) Payment  
7. Confirmation  
8. Return after usage  

### Admin Flow
- Manage clothing inventory  
- Track bookings  
- Update availability after returns  

---

## 🏗️ Architecture

### 🔹 3-Tier Architecture
- Frontend: React  
- Backend: Node.js + Express  
- Database: MongoDB  

### 🔹 Backend Modules
- Authentication (JWT, bcrypt)
- Clothing API (/clothes)
- Booking API (/bookings)
- User API (/users)

### 🔹 Core Logic
- Booking management  
- Date overlap checking  
- Price calculation  
- Inventory updates  

---

## 🗄️ Database Design

### Users Collection
- name  
- email  
- password  
- role (user/admin)  

### Clothes Collection
- title  
- description  
- category  
- size  
- pricePerDay  
- availability  
- imageUrl  

### Bookings Collection
- userId  
- clothId  
- startDate  
- endDate  
- totalPrice  
- status  

### Payments (Optional)
- userId  
- bookingId  
- amount  
- paymentStatus  

---

## 🛠️ Tech Stack

Frontend
- React.js  
- HTML, CSS, JavaScript  

Backend
- Node.js  
- Express.js  

Database
- MongoDB (Mongoose)  

Other Tools
- JWT (Authentication)  
- bcrypt (Password hashing)  
- Cloudinary / AWS S3 (Image upload)  
- Postman (API testing)  

---

## ⚙️ Installation

bash git clone https://github.com/tejasrmap/Thriftyyy.git cd Thriftyyy 

### Backend Setup
bash cd server npm install npm start 

### Frontend Setup
bash cd client npm install npm run dev 

---

## 🔐 Environment Variables

env MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_secret_key PORT=5000 CLOUDINARY_URL=your_cloudinary_config 

---

## 🔮 Future Enhancements

- 💳 Payment integration (Razorpay / Stripe)  
- 📅 Real-time availability calendar  
- ⭐ Ratings & reviews  
- 🔔 Email/SMS notifications  
- ❤️ Wishlist feature  
- 🤖 AI-based recommendations  

---

## 📚 Learning Outcomes

- Full Stack MERN Development  
- REST API Design  
- Authentication using JWT  
- MongoDB Schema Design  
- Booking system logic (date handling)  
- Role-based access control  

---

## 👨‍💻 Author

Teja Ganugula
🔗 https://github.com/tejasrmap  

---

## ⭐ Support

If you like this project, give it a ⭐ on