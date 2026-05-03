# Real-Time IT Stock Tracker

A MERN stack application tracking real-time stock prices for 5 major IT companies (TCS, INFY, WIT, HCLTECH, TECHM), featuring a modern fintech UI, secure JWT authentication, and a failover caching strategy to handle free-tier API rate limits.

## Project Structure
- `client/`: React + Vite frontend application
- `server/`: Node.js + Express backend application

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- Alpha Vantage API Key

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory based on the `.env.example` provided in the project root.
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
# Start the development server
npm run dev
```

## Features
- Real-time stock data fetching
- Failover Cache strategy for rate-limits
- JWT-based authentication
- Interactive Recharts stock graphs
- "Robinhood-style" premium modern UI
