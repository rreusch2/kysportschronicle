# 🚀 Deployment Guide - Kentucky Sports Chronicle

This guide will help you deploy your Kentucky Sports Chronicle web app and fix the 404 errors when sharing article links.

## 🔧 The 404 Problem Explained

When you deploy a React Single Page Application (SPA), direct links to routes like `/article/some-slug` result in 404 errors because:
- The web server tries to find a file at that path
- Instead, it should serve `index.html` and let React Router handle the routing

## ✅ Solutions Implemented

We've added configuration files for all major hosting platforms:

### 1. **Netlify** (`netlify.toml`)
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. **Vercel** (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. **Other Static Hosts** (`public/_redirects`)
```
/*    /index.html   200
```

## 📦 Deployment Instructions

### **Netlify (Recommended)**

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect Vite settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy"

3. **Configure Environment Variables**
   - In Netlify dashboard: Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Custom Domain (Optional)**
   - Site settings → Domain management
   - Add your custom domain
   - Update DNS records as instructed

### **Vercel**

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   vercel
   ```
   Or connect via [vercel.com](https://vercel.com) dashboard

3. **Configure Environment Variables**
   - Project Settings → Environment Variables
   - Add your Supabase credentials

### **Other Hosting Platforms**

#### **GitHub Pages**
```bash
npm install --save-dev gh-pages
```

Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/repository-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Deploy:
```bash
npm run deploy
```

#### **AWS S3 + CloudFront**
1. Build the app: `npm run build`
2. Upload `dist` folder to S3
3. Configure CloudFront with:
   - Error Pages: 404 → /index.html (200 response)
4. Update Supabase environment variables

## 🎨 Social Sharing Features

We've implemented comprehensive sharing capabilities:

### **Meta Tags**
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Dynamic meta tags per article
- ✅ SEO optimization

### **Share Button Component**
- ✅ Copy link to clipboard
- ✅ Share to Facebook
- ✅ Share to Twitter
- ✅ Share via Email
- ✅ Native share API (mobile)
- ✅ Beautiful animated UI

### **Where Share Buttons Appear**
1. **Sticky header** on article pages
2. **Bottom of article** with call-to-action
3. **Mobile-optimized** native sharing

## 🧪 Testing Your Deployment

### **Before Deploying**
```bash
npm run build
npm run preview
```
Visit `http://localhost:4173` and test:
- ✓ Navigate to article pages
- ✓ Refresh the page (should NOT 404)
- ✓ Copy URL and open in new tab (should NOT 404)

### **After Deploying**
1. **Test Article Links**
   - Share an article link with someone
   - Open in incognito/private window
   - Should load the article, not 404

2. **Test Social Sharing**
   - Copy an article link
   - Paste into Facebook/Twitter/LinkedIn
   - Verify the preview shows:
     - Article title
     - Thumbnail image
     - Description

3. **Test Share Button**
   - Click "Share" button on article
   - Try each sharing method
   - Verify copied links work

## 🔍 Troubleshooting

### **Still Getting 404s?**

**Netlify:**
- Check the `netlify.toml` is in the root directory
- Verify the build deployed successfully
- Check build logs for errors

**Vercel:**
- Ensure `vercel.json` is in root directory
- Check deployment logs
- Try redeploying

**Custom Server:**
- Configure your web server to redirect all routes to `index.html`
- For Apache: Use `.htaccess` with mod_rewrite
- For Nginx: Configure try_files directive

### **Meta Tags Not Showing?**

1. **Check Deployment**
   - Ensure latest changes are deployed
   - Clear CDN cache if applicable

2. **Test Meta Tags**
   - Use [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - View page source (should see meta tags)

3. **Force Refresh**
   - Social platforms cache previews
   - Use platform debuggers to refresh

### **Environment Variables Not Working?**

- Vite only exposes variables prefixed with `VITE_`
- Must restart dev server after changing `.env.local`
- In production, set variables in hosting platform dashboard
- Rebuild and redeploy after changing variables

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Supabase RLS policies enabled
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (HTTPS)
- [ ] Article links tested and working
- [ ] Share buttons functional
- [ ] Meta tags showing in social previews
- [ ] Mobile responsiveness verified
- [ ] Performance tested (Lighthouse score)
- [ ] Analytics configured (optional)

## 🌐 Update Your Domain

After deploying, update these URLs in your code:

1. **index.html** (line 17 & 25)
   ```html
   <meta property="og:url" content="https://your-actual-domain.com/" />
   <meta name="twitter:url" content="https://your-actual-domain.com/" />
   ```

2. **MetaTags.jsx** (optional - for Twitter handle)
   ```jsx
   updateMetaTag('meta[name="twitter:site"]', '@YourActualTwitter')
   ```

## 📊 Monitoring

After deployment, monitor:
- **Uptime**: Use UptimeRobot or similar
- **Analytics**: Google Analytics, Plausible, etc.
- **Errors**: Check hosting platform logs
- **Performance**: Lighthouse CI, PageSpeed Insights

## 🎉 You're All Set!

Your Kentucky Sports Chronicle is now:
- ✅ Deployed and accessible
- ✅ Article links work when shared
- ✅ Social sharing optimized
- ✅ SEO-friendly
- ✅ Mobile-ready

## 📞 Need Help?

If you encounter issues:
1. Check the platform's documentation
2. Verify all configuration files are in place
3. Check build logs for errors
4. Ensure environment variables are set correctly

**Happy Publishing! Go Wildcats! 🐾**
