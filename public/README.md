# Public Assets

This directory contains static assets that are served at the root of the application.

## Files

- `logobanner.JPG` - Horizontal banner logo (used in Hero section)
- `logoround.JPG` - Round logo icon (used in Navigation, Footer, Admin pages)
- `hero-background.jpg` - Hero section background image (UK Sports graphic)

## Usage

Files in this directory are accessible at the root path:
- `/logobanner.JPG` → `public/logobanner.JPG`
- `/logoround.JPG` → `public/logoround.JPG`
- `/hero-background.jpg` → `public/hero-background.jpg`

## Hero Background Image

### Recommended Specifications:
- **Dimensions:** 1920x1080px to 2560x1440px
- **Aspect Ratio:** 16:9 (widescreen)
- **Format:** JPG or WebP (optimized)
- **File Size:** Under 500KB (compress before uploading)
- **Content:** UK Sports graphic (stadium, arena, action shots, logo, etc.)

### How to Add:
1. Find or create your UK Sports graphic
2. Optimize/compress it (use tinypng.com or similar)
3. Name it `hero-background.jpg`
4. Place it in this `public/` directory
5. Refresh your site - it will appear automatically!

### Tips:
- Choose images with UK blue colors
- Avoid overly busy images (text needs to be readable)
- Horizontal/landscape orientation works best
- Test on mobile to ensure it looks good at different screen sizes

## Note for Deployment

These files must be in the `public` directory for Vite to serve them correctly in both development and production (Vercel) environments.
