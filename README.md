# Golf Charity Subscription Platform

![Platform Dashboard Overview](assets/dashboard.png)

Production-ready MERN stack application meticulously engineered for the Digital Heroes Selection Process.

## Key Features (PRD Aligned)
- **Strict 5-Score FIFO**: Calculates metrics on exactly the 5 latest games. Old games automatically drop off.
- **Charity Engine**: Requires users to select supported charities and minimum 10% pledge logic.
- **SaaS Subscription Wall**: Completely limits free users to a maximum of 5 entries, prompting premium upsells.
- **Local Smart Draw**: Dynamic React-side intelligent number generation yielding huge graphical UI updates on match wins.
- **Dark Glassmorphism**: Tailored, rich gradient animations using Framer Motion and Tailwind CSS v4.

## Complete Deployment Guide

### 1. Backend (Deployment on Render.com)
1. Push this entire repository to your GitHub account.
2. Log into Render.com and create a **"New Web Service"**.
3. Connect your new GitHub repository. 
4. **Important**: Set the **Root Directory** to `backend`.
5. Set the **Build Command** to: `npm install`
6. Set the **Start Command** to: `npm start`
7. Add your Environment Variables in the Render dashboard:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0...`
   - `JWT_SECRET`: `any_random_secure_long_string`
   - `NODE_ENV`: `production`

### 2. Frontend (Deployment on Vercel.com)
1. Log into Vercel.com and click **"Add New Project"**.
2. Import the exact same GitHub repository.
3. Set the Framework Preset to **Vite**.
4. **Important**: Set the **Root Directory** to `frontend`.
5. Under Environment Variables, add exactly:
   - `VITE_API_URL`: The live URL provided by Render from step 1 (e.g., `https://your-backend-app.onrender.com/api`)
6. Click **Deploy**!

Everything is configured. Once deployed, the frontend will automatically route API requests to the environment variables supplied securely.
