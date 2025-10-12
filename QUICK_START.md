# ⚡ Quick Start Guide

Get Kentucky Sports Chronicle up and running in minutes!

## 🎯 What You Need

1. A Supabase account (sign up at [supabase.com](https://supabase.com) - it's free!)
2. Node.js installed on your computer
3. 10-15 minutes

## 📋 Step-by-Step Setup

### Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **"New Project"**
3. Fill in:
   - Name: `Kentucky Sports Chronicle`
   - Database Password: (create a strong password)
   - Region: `US East` (closest to Kentucky)
4. Click **"Create new project"** and wait ~2 minutes

### Step 2: Configure Database (3 minutes)

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of the file `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see "Success. No rows returned"

### Step 3: Set Up Image Storage (2 minutes)

1. Click **Storage** in the left sidebar
2. Click **"Create a new bucket"**
3. Name it: `article-images`
4. Toggle **"Public bucket"** to ON
5. Click **"Create bucket"**

Now set permissions:
1. Click on your `article-images` bucket
2. Click **"Policies"** tab
3. Click **"New policy"** → **"For full customization"**
4. Add two policies:

**Policy 1:**
- Name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `true`

**Policy 2:**
- Name: `Authenticated upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: `true`

### Step 4: Create Admin Users (2 minutes)

1. Click **Authentication** in the left sidebar
2. Click **"Add user"** → **"Create new user"**
3. Enter the first owner's email and password
4. Check **"Auto Confirm User"** ✅
5. Click **"Create user"**
6. Repeat for the second owner

**Important:** Save these credentials - you'll give them to the owners!

### Step 5: Get Your API Keys (1 minute)

1. Click **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
4. **Keep this page open** - you'll need these in the next step

### Step 6: Configure Your App (2 minutes)

1. In your project folder, create a file called `.env.local`
2. Add these lines (replace with YOUR values from Step 5):

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

### Step 7: Install and Run (2 minutes)

Open your terminal in the project folder and run:

```bash
npm install
npm run dev
```

Wait for it to start, then open your browser to:
- **Website**: http://localhost:5173
- **Admin**: http://localhost:5173/admin/login

## ✅ You're Done!

### Test It Out

1. Go to http://localhost:5173/admin/login
2. Log in with one of the admin accounts you created
3. Click **"New Article"**
4. Write a test article
5. Click **"Publish"**
6. Go back to the homepage - your article is live!

## 🎉 Next Steps

### For the Owners
Send them:
1. Their login credentials (email & password)
2. The **CMS_GUIDE.md** file
3. The website URL (once deployed)

### For Deployment
When you're ready to go live:

**Vercel (Recommended - Easiest)**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Add your environment variables (same as .env.local)
5. Deploy! You'll get a URL like `kentuckysportschronicle.vercel.app`

**Netlify**
1. Run `npm run build`
2. Drag the `dist` folder to [netlify.com](https://netlify.com)
3. Add environment variables in Netlify settings
4. Done!

## 🆘 Troubleshooting

**"Cannot find module" errors**
- Run `npm install` again

**"Missing Supabase environment variables"**
- Check that your `.env.local` file exists
- Make sure the variable names start with `VITE_`
- Restart the dev server after creating .env.local

**Can't log in**
- Make sure you created the admin user in Supabase
- Check that Auto Confirm User was checked
- Try the email/password you set (it's case-sensitive)

**Images won't upload**
- Make sure you created the storage bucket
- Check that the bucket is PUBLIC
- Verify you added the storage policies

## 📞 Need Help?

Check these files:
- **SUPABASE_SETUP.md** - Detailed Supabase guide
- **CMS_GUIDE.md** - How to use the CMS
- **README.md** - Full documentation

---

**That's it! You now have a fully functional sports news website with a professional CMS.** 🎉

Go Big Blue! 🐾
