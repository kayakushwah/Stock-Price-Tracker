# 📈 Stock Price Tracker

A clean, beginner-friendly full-stack web application to search for stocks, view historical price charts, and manage your personal portfolio. Built with React, Node.js, and MongoDB, this project integrates real-world **Google Analytics 4 (GA4)** and **Google Tag Manager (GTM)** tracking.

> 💡 **Beginner Friendly:** This project is designed to be simple to set up and explore. It serves as a great example of integrating frontend analytics (GA4/GTM) with a full-stack web application!

---

## 🖥️ App Screenshots

### GA4 + GTM Analytics Proof

**1. GTM Tag Firing (Tag Assistant)**
![GTM Fired](./gtm_fired.png)

**2. GA4 DebugView Timeline**
![GA4 DebugView](./ga4_debugview.png)

---

## ✨ Features

- 🔍 **Global Stock Search:** Search for any stock ticker (e.g., `AAPL`, `MSFT`) powered by the Alpha Vantage API.
- 📊 **Interactive Charts:** Visualize stock price history clearly on the stock detail page.
- 🔐 **User Authentication:** Secure account creation and login using JSON Web Tokens (JWT).
- ⭐ **Personal Watchlist:** Save your favorite stocks to keep a close eye on their performance.
- 💼 **Holdings Tracker:** Simulate buying stocks and track your personal portfolio.
- 📡 **Professional Analytics:** Fully integrated GA4 and GTM event tracking for user interactions and API errors.
- 🛡️ **Graceful Error Handling:** Custom UI messages when API limits are hit or invalid symbols are searched.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Stock Data** | Alpha Vantage REST API |
| **Analytics** | Google Analytics 4 via Google Tag Manager |

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js installed on your computer
- A free MongoDB Atlas account
- A free Alpha Vantage API key (Get one at [alphavantage.co](https://www.alphavantage.co/support/#api-key))

### 1. Clone & Install

```bash
git clone https://github.com/kayakushwah/Stock-Price-Tracker.git
cd Stock-Price-Tracker/IT_Stock_Tracker

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` folder (`server/.env`) and add the following:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

> 💡 **Security Tip:** Never commit your `.env` file to GitHub. The `.gitignore` is already configured to protect it!

### 3. Run the App Locally

Open two separate terminal windows:

```bash
# Terminal 1 — Start the Backend
cd server
npm start
```

```bash
# Terminal 2 — Start the Frontend
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser to see the app running!

---

## 📡 Analytics Tracking Plan

This project demonstrates professional analytics integration. Here is the tracking plan implemented via GTM:

| Event Name | Parameter | When it fires |
|-------|-----------|---------------|
| `stock_search` | `ticker` (e.g., AAPL) | When a user clicks on a search result or views a stock page. |
| `search_error` | `error_type` | When a search fails due to bad input or API limits. |

### `error_type` definitions:
- **`rate_limit`:** The Alpha Vantage API limit was reached.
- **`invalid_symbol`:** The user searched for a stock that doesn't exist.
- **`network_error`:** A general connection failure occurred.

---

## 🚀 Deployment

You can easily deploy this app for free:

### 1. Backend (Render)
- Go to **Render.com** and create a new **Web Service**.
- Connect this GitHub repository.
- Set the Root Directory to `IT_Stock_Tracker/server`.
- Add your Environment Variables (`MONGO_URI`, `ALPHA_VANTAGE_API_KEY`, `JWT_SECRET`).
- Click Deploy!

### 2. Frontend (Vercel)
- Go to **Vercel.com** and import this repository.
- Set the Root Directory to `IT_Stock_Tracker/client`.
- Update the API base URL in your frontend code to point to your new Render backend URL.
- Deploy!

---

## 📜 License

This project is open-source and available under the MIT License.
