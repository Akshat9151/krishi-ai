# 🔐 Google Sign-In & Email Provider Setup

## ⚡ Quick Summary

This guide explains how to get Google Sign-In buttons working on the login/register pages and configure email OTP delivery.

---

## 🔷 Part 1: Google Sign-In Setup (Frontend - Vercel)

### Step 1: Create Google OAuth 2.0 Credentials

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable **Google+ API** (APIs & Services → Library → Search "Google+")
4. Go to **Credentials** → Click **"Create Credentials"** → **OAuth 2.0 Client ID**
   - Choose **Web Application** as the application type
   - Add Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:3000
     https://khetitak.in
     https://krishi-ai-sable-sigma.vercel.app
     ```
   - Add Authorized redirect URIs:
     ```
     http://localhost:5173
     https://khetitak.in
     https://krishi-ai-sable-sigma.vercel.app
     ```
5. Copy the **Client ID** (looks like: `xxx.apps.googleusercontent.com`)

### Step 2: Add to Vercel Dashboard

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select **kheti-tak-fix** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Name: VITE_GOOGLE_CLIENT_ID
   Value: YOUR_GOOGLE_CLIENT_ID_HERE
   Environments: Production, Preview, Development
   ```
5. Click **Save**
6. Trigger a redeploy (Vercel will auto-redeploy, or click "Redeploy" button)

### Step 3: Test Locally

```bash
# Add to frontend/.env.local
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
VITE_API_URL=http://localhost:8000

# Start dev server
cd frontend
npm run dev

# Go to http://localhost:5173/#login
# You should see "Sign in with Google" button
```

---

## 📧 Part 2: Email Provider Setup (Backend - Render)

Choose ONE email provider below:

### Option A: Brevo (Recommended - Free 300/day)

**Setup Brevo Account:**
1. Go to https://www.brevo.com
2. Sign up for free account
3. Go to **Settings** → **SMTP & API**
4. Copy **API Key (v3)**

**Add to Render:**
1. Go to Render Dashboard: https://dashboard.render.com
2. Select **krishi-ai-2** backend service
3. Go to **Environment**
4. Add/Update:
   ```
   EMAIL_PROVIDER=brevo
   BREVO_API_KEY=your_api_key_here
   ```
5. Click **Save** (auto-redeploy will trigger)

**Test:**
```bash
# Backend will automatically send OTP via Brevo when user requests signup/login OTP
# Check Brevo email logs: https://app.brevo.com/logs
```

---

### Option B: SendGrid (Free 100/day)

**Setup SendGrid Account:**
1. Go to https://sendgrid.com
2. Sign up for free account
3. Go to **Settings** → **API Keys**
4. Create new API Key with "Mail Send" access
5. Copy the key

**Add to Render:**
```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_api_key_here
```

---

### Option C: Resend (Newer, clean API)

**Setup Resend Account:**
1. Go to https://resend.com
2. Sign up for free account
3. Go to **API Keys**
4. Create new key
5. Copy the key

**Add to Render:**
```
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_api_key_here
```

---

### Option D: SMTP (Self-hosted email)

**Add to Render:**
```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com (or your email host)
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@khetitak.in
```

---

## 🎯 Adding Backend Google OAuth (Optional)

If you want backend OAuth verification for extra security:

**Add to Render:**
```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

This allows the backend to verify Google tokens. Already configured in code.

---

## ✅ Verification Checklist

- [ ] Google Client ID created in Google Cloud Console
- [ ] Client ID added to Vercel as `VITE_GOOGLE_CLIENT_ID`
- [ ] Email provider API key created
- [ ] Email provider key added to Render environment
- [ ] Vercel redeployed (check log at https://vercel.com/dashboard)
- [ ] Render redeployed (check log at https://dashboard.render.com)
- [ ] Test login page: https://khetitak.in/#login
- [ ] Verify "Sign in with Google" button appears
- [ ] Try Google Sign-In flow

---

## 🧪 Testing OTP Email Flow

### Local Testing:
```bash
# 1. Set EMAIL_PROVIDER=mock in .env (default)
# Backend logs OTP to console
# Check terminal output for: "Mock email OTP for email@example.com: 123456"

# 2. Or add BREVO_API_KEY to .env for production-like testing
EMAIL_PROVIDER=brevo
BREVO_API_KEY=your_brevo_key
```

### Production Testing (Render):
1. Go to https://khetitak.in/#register
2. Enter email + password
3. Click "Request OTP"
4. Check email inbox (or spam folder)
5. OTP code should arrive within 5 seconds

---

## 🐛 Troubleshooting

### Google Sign-In button not showing:
- ❌ `VITE_GOOGLE_CLIENT_ID` not set in Vercel
- ✅ Add environment variable and redeploy

### OTP email not received:
- ❌ EMAIL_PROVIDER=mock (logs to backend console, doesn't send)
- ❌ EMAIL_PROVIDER configured but API key not set
- ✅ Add correct API key to Render environment

### "Invalid Client ID" error on Google Sign-In:
- ❌ Client ID format wrong
- ❌ Domain not added to Google Cloud Console authorized origins
- ✅ Use correct format: `xxx.apps.googleusercontent.com`
- ✅ Add https://khetitak.in to Google Cloud Console

### "Email provider is not configured" error:
- ❌ EMAIL_PROVIDER set but API key is empty
- ✅ Add API key to Render environment

---

## 📱 Voting App (VoteVictory) - Same Setup

Use **same** Google Client ID and email provider in voting app:

1. VoteVictory frontend: Add `VITE_GOOGLE_CLIENT_ID` to Vercel
2. VoteVictory backend: Add `EMAIL_PROVIDER` + API key to Render
3. Share secrets across apps via environment configuration

---

## 🔒 Security Notes

- ✅ API keys stored in Render (not in git)
- ✅ Frontend only stores `VITE_GOOGLE_CLIENT_ID` (safe, non-secret)
- ✅ Backend verifies Google tokens server-side
- ✅ OTP codes expire in 10 minutes
- ✅ Max 5 OTP attempts per challenge

---

**Questions?** Check backend logs at Render dashboard.

