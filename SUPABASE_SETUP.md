# 🗄️ Supabase Setup Guide

This guide will walk you through setting up your Supabase backend for Kentucky Sports Chronicle.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: Kentucky Sports Chronicle
   - **Database Password**: (choose a strong password - save it!)
   - **Region**: Choose closest to Kentucky (e.g., `us-east-1`)
5. Click **"Create new project"** (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
4. **Copy these values** - you'll need them next

## Step 3: Configure Environment Variables

1. In this project, create a file called `.env.local`:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace `your_project_url_here` with your Project URL
3. Replace `your_anon_key_here` with your anon key

**IMPORTANT**: The `.env.local` file is already in `.gitignore` so your keys won't be committed to git.

## Step 4: Run Database Migration

1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **"New query"**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` from this project
4. Paste into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`

You should see: "Success. No rows returned"

## Step 5: Set Up Storage

1. In Supabase dashboard, click **Storage** in sidebar
2. Click **"Create a new bucket"**
3. Name it: `article-images`
4. Make it **Public** (toggle the switch)
5. Click **"Create bucket"**

### Configure Storage Policies

1. Click on the `article-images` bucket
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Choose **"For full customization"**
5. Add these two policies:

**Policy 1: Public Read Access**
- Policy name: `Public read access`
- Target roles: `public`
- Policy definition: `SELECT`
- USING expression: `true`

**Policy 2: Authenticated Upload**
- Policy name: `Authenticated users can upload`
- Target roles: `authenticated`
- Policy definition: `INSERT`
- WITH CHECK expression: `true`

## Step 6: Create Admin Users

You need to create accounts for the 2 owners:

1. Go to **Authentication** in Supabase sidebar
2. Click **"Add user"** 
3. Choose **"Create new user"**
4. Enter:
   - Email: owner1@example.com (use real email)
   - Password: (choose a strong password)
   - Auto Confirm User: ✅ (check this)
5. Click **"Create user"**
6. Repeat for the second owner

**Give these credentials to the owners** - they'll use them to log into the admin dashboard.

## Step 7: Install Dependencies

In your terminal, run:

```bash
npm install
```

## Step 8: Start the App

```bash
npm run dev
```

## ✅ You're Done!

Your CMS is now ready! The owners can:

1. Visit the site at `http://localhost:5173`
2. Click **"Admin"** in the navigation (or go to `/admin`)
3. Log in with the credentials you created
4. Start writing articles!

## 🔐 Security Notes

- The `.env.local` file is never committed to git (it's in `.gitignore`)
- Only authenticated users can create/edit/delete articles
- Images in the `article-images` bucket are public (so they display on your site)
- Supabase Row Level Security (RLS) protects your data

## 📱 Going Live

When you're ready to deploy:

1. Set up the same environment variables on your hosting platform (Vercel, Netlify, etc.)
2. Your Supabase project stays the same - just works!
3. No additional backend needed

## 💡 Tips

- **Free tier limits**: 500MB database, 1GB file storage, 50MB file uploads
- This is plenty for thousands of articles!
- Supabase automatically backs up your data
- You can upgrade later if needed
