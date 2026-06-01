# STORY Ecommerce Deployment Guide

## ✅ Step 1: GitHub Repository Setup - COMPLETED
Your code has been successfully pushed to: https://github.com/varuntejreddy03/story.git

## 📋 Deployment Overview
You have 3 applications to deploy:
- **Backend API** → Render
- **User Frontend** → Vercel  
- **Admin Frontend** → Vercel

---

## 🚀 Step 2: Deploy Backend on Render

### 2.1 Create Render Account & Service
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select `varuntejreddy03/story` repository

### 2.2 Configure Backend Service
**Service Settings:**
- **Name:** `story-backend`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `npm start`

### 2.3 Environment Variables
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-store-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=STORY India <orders@story.in>
FRONTEND_URL=https://your-user-frontend.vercel.app
ADMIN_FRONTEND_URL=https://your-admin-frontend.vercel.app
```

### 2.4 Database Setup
- Use Render's PostgreSQL add-on or external provider like Supabase/Neon
- Copy the DATABASE_URL to your environment variables
- Database migrations will run automatically on deployment

**Your backend will be available at:** `https://story-backend.onrender.com`

---

## 🌐 Step 3: Deploy User Frontend on Vercel

### 3.1 Create Vercel Account & Project
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import `varuntejreddy03/story` repository

### 3.2 Configure User Frontend
**Project Settings:**
- **Project Name:** `story-user-frontend`
- **Root Directory:** `storyuser`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3.3 Environment Variables
Add in Vercel dashboard:
```env
VITE_API_BASE_URL=https://story-backend.onrender.com/api
```

**Your user frontend will be available at:** `https://story-user-frontend.vercel.app`

---

## 🔧 Step 4: Deploy Admin Frontend on Vercel

### 4.1 Create Second Vercel Project
1. In Vercel dashboard, click "New Project"
2. Import the same `varuntejreddy03/story` repository again

### 4.2 Configure Admin Frontend
**Project Settings:**
- **Project Name:** `story-admin-frontend`
- **Root Directory:** `story-luxury-admin`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 4.3 Environment Variables
Add in Vercel dashboard:
```env
VITE_API_BASE_URL=https://story-backend.onrender.com/api
```

**Your admin frontend will be available at:** `https://story-admin-frontend.vercel.app`

---

## 🔄 Step 5: Update Backend CORS Settings

After getting your Vercel URLs, update your backend environment variables on Render:

```env
FRONTEND_URL=https://story-user-frontend.vercel.app
ADMIN_FRONTEND_URL=https://story-admin-frontend.vercel.app
```

Then redeploy your backend service on Render.

---

## 🧪 Step 6: Testing Your Deployment

### 6.1 Test Backend API
Visit: `https://story-backend.onrender.com/api/health`
Should return: `{"status": "OK"}`

### 6.2 Test User Frontend
1. Visit your user frontend URL
2. Browse products
3. Test user registration/login
4. Test cart functionality
5. Test checkout process (use Razorpay test mode)

### 6.3 Test Admin Frontend
1. Visit your admin frontend URL
2. Login with admin credentials
3. Test product management
4. Test order management
5. Test dashboard analytics

---

## 🔐 Security Checklist

- [ ] All environment variables are set correctly
- [ ] Database is secured with strong credentials
- [ ] JWT secret is at least 32 characters
- [ ] CORS is configured for your frontend domains only
- [ ] Razorpay is in live mode for production
- [ ] SMTP credentials are secure
- [ ] No sensitive data in GitHub repository

---

## 📝 Important Notes

1. **First Deploy:** Backend might take 2-3 minutes to start (Render free tier)
2. **Database:** Ensure your PostgreSQL database is accessible from Render
3. **Domain Names:** You can add custom domains in Vercel settings
4. **SSL:** Both Vercel and Render provide SSL certificates automatically
5. **Monitoring:** Set up monitoring for your backend service

---

## 🆘 Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify all environment variables are set
- Ensure database connection is working

### Frontend Issues
- Check Vercel deployment logs
- Verify API URL is correct
- Check browser console for errors

### CORS Issues
- Ensure FRONTEND_URL and ADMIN_FRONTEND_URL match your Vercel URLs exactly
- Redeploy backend after updating CORS settings

---

## 🎉 Deployment Complete!

Once all steps are completed, you'll have:
- ✅ Backend API running on Render
- ✅ User frontend running on Vercel
- ✅ Admin frontend running on Vercel
- ✅ All services connected and communicating

Your STORY ecommerce platform is now live and ready for customers!