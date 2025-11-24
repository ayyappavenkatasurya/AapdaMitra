# 🚨 AapdaMitra: AI-Powered Hyperlocal Disaster Response Grid

![Hack for Social Cause](https://img.shields.io/badge/Hack_For_Social_Cause-2026-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototype_Ready-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Solution & Key Features](#-solution--key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Future AI Integration](#-future-ai-roadmap)
- [Screenshots](#-screenshots)
- [Contributors](#-contributors)

---

## 💡 Project Overview
**AapdaMitra** (Friend in Disaster) is a centralized, resilient disaster management platform designed to bridge the gap between Government authorities (NDRF), Volunteers, and Victims during the critical "Golden Hour" of a calamity.

Submitted for **Hack for Social Cause - Youth Tech Challenge 2026** under the theme **AI, GIS & Emerging Technologies**.

---

## 🚩 Problem Statement
During natural disasters (floods, earthquakes), the primary cause of high casualties is **Information Asymmetry**.
1.  **Victims** cannot communicate precise needs or locations.
2.  **Authorities** lack a real-time visual map of "Red Zones."
3.  **Resources** (boats, food) are often mismanaged due to a lack of data on "Supply vs. Demand."

---

## 🚀 Solution & Key Features
AapdaMitra solves this using a **Geospatial Command Center**:

1.  **📍 One-Click SOS & Geotagging:** Victims can send distress signals with live GPS coordinates. Signals are categorized by urgency (Medical Emergency, Food/Water, Rescue Needed).
2.  **🗺️ Live Crisis Mapping:** A real-time heatmap visualization for authorities to identify high-density distress zones.
3.  **🤝 Resource Matching (Uber for Relief):** Connects volunteers (Supply) with victims (Demand) based on proximity.
4.  **📶 Offline-First Architecture:** Designed to cache requests locally and sync when connectivity is restored.

---

## 🛠 Tech Stack
This project is built using the **MERN Stack**:

| Component     | Technology            | Description                                                   |
| :---          | :---                  | :---                                                          |
| **Frontend**  | React.js, Tailwind CSS| Responsive, mobile-first UI for victims and volunteers.        |
| **Backend**   | Node.js, Express.js   | RESTful API to handle SOS requests and resource allocation.    |
| **Database**  | MongoDB               | Storing user data, inventory, and Geospatial Indexing (GeoJSON).|
| **Mapping**   | Leaflet / Google Maps API | Visualizing coordinates on the admin dashboard.           |
| **Auth**      | JWT                   | Secure authentication for Admins and Volunteers.               |

---

## 🏗 Architecture
The application follows a standard MVC (Model-View-Controller) architecture.

1.  **Client:** React App sends HTTP requests (SOS/Login) to the server.
2.  **Server:** Express.js processes requests, validates coordinates, and interacts with the DB.
3.  **Database:** MongoDB stores data with `2dsphere` indexes to allow "Find requests near me" queries.

---

## ⚙ Installation & Setup
Follow these steps to run the prototype locally:

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas URL)
- Git

### 2. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AapdaMitra.git
cd AapdaMitra
```

### 3. Backend Setup

```bash
cd server
npm install
# Start the server
npm start
```

Server runs on Port **5000** by default.

### 4. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
# Start the React App
npm start
```

Client runs on Port **3000** by default.

---

## 🔐 Environment Variables

Create a `.env` file in the server directory with the following credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/aapdamitra
JWT_SECRET=your_secret_key_here
```

---

## 🤖 Future AI Roadmap (AI & DS Integration)

As an AI & DS student project, the next phase involves integrating Machine Learning models:

- **Cluster Analysis (K-Means):** Automatically group individual SOS signals into "High Priority Zones" for NDRF deployment.
- **Predictive Modelling:** Use historical flood data to predict resource requirements 24 hours in advance.
- **Sentiment Analysis:** Parse social media (Twitter/X) calls for help during disasters.

---

## 📸 Screenshots

1. **Landing Page & Login**

![Landing Page Screenshot](https://via.placeholder.com/600x300?text=Landing+Page+Screenshot)
*(Replace this link with your actual screenshot)*

2. **Victim Dashboard (SOS)**

![SOS Interface Screenshot](https://via.placeholder.com/600x300?text=SOS+Interface+Screenshot)
*(Replace this link with your actual screenshot)*

3. **Admin Command Center (Map View)**

![Admin Map Screenshot](https://via.placeholder.com/600x300?text=Admin+Map+Screenshot)
*(Replace this link with your actual screenshot)*

---

## 👥 Contributors

- Nallamothu Ayyappa Venkata Surya (Team Lead - AI & DS)
- [Team Member 2 Name]
- [Team Member 3 Name]

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
