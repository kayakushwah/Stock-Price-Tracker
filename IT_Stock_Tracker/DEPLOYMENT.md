# Deployment Guide

The easiest way to deploy this full-stack MERN application is using **Render.com**. We have already configured the backend to serve the compiled frontend as a single deployable unit.

## Prerequisites
1. Push this entire codebase to a GitHub or GitLab repository.
2. Create an account on [Render.com](https://render.com).
3. Create a **MongoDB Atlas** database (free tier) and get your connection string.

---

## 🚀 Steps to Deploy on Render

1. Log into Render and click **New +** -> **Web Service**.
2. Connect your GitHub/GitLab repository.
3. Configure the web service with the following settings:
   - **Name:** `it-stock-tracker` (or your choice)
   - **Root Directory:** `server` (Important!)
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Expand the **Advanced** section and click **Add Environment Variable**. Add the following keys:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/it_tracker?retryWrites=true&w=majority` (Replace with your actual MongoDB Atlas URI)
   - `JWT_SECRET` = `any_secure_random_string_here`
   - `ALPHA_VANTAGE_API_KEY` = `your_alpha_vantage_key`
5. Click **Create Web Service**.

> **Note:** The `npm run build` script we configured inside `server/package.json` will automatically install backend dependencies, navigate to the `client` folder, install frontend dependencies, and build the React Vite app into the `client/dist` folder. The `server.js` file will then statically serve this `dist` folder.

Your application will be live at the provided Render URL!
