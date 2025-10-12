# 🏈 Hero Background Image Guide

## 🎯 Quick Start

1. **Find your UK Sports graphic** (see recommendations below)
2. **Optimize it** using [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
3. **Name it** `hero-background.jpg`
4. **Drop it** in the `public/` folder
5. **Refresh** your browser - done! 🎉

---

## 📐 Technical Specs

### Required Dimensions:
```
Optimal: 1920x1080px (Full HD) or 2560x1440px (2K)
Minimum: 1600x900px
Aspect Ratio: 16:9
```

### File Requirements:
```
Format: JPG or WebP
Max Size: 500KB (compressed)
Quality: 80-90% (balance quality/size)
```

---

## 🖼️ Image Ideas

### Top Recommendations:

1. **Kroger Field Panorama**
   - Packed stadium during game day
   - Wide-angle shot from elevated position
   - Blue seats, crowd, field visible

2. **Rupp Arena Basketball**
   - Court view with fans
   - UK blue lighting
   - Action shot or pre-game

3. **UK Sports Collage**
   - Multiple sports combined
   - Basketball, football, baseball
   - Dynamic, energetic layout

4. **Commonwealth Stadium**
   - Aerial view
   - Sunset/golden hour lighting
   - Dramatic sky

5. **Abstract UK Blue**
   - UK logo/wordmark
   - Sports equipment silhouettes
   - Geometric patterns in UK colors

### What to Avoid:
- ❌ Too dark (text won't show)
- ❌ Too busy/cluttered
- ❌ Low resolution/pixelated
- ❌ Portrait orientation
- ❌ Copyrighted pro photos (without permission)

---

## 🔍 Where to Find Images

### Free Sources:
1. **Unsplash** - [unsplash.com](https://unsplash.com)
   - Search: "stadium", "basketball arena", "sports crowd"
   
2. **Pexels** - [pexels.com](https://pexels.com)
   - High-quality free sports photos

3. **UK Athletics (check license)** - [ukathletics.com](https://ukathletics.com)
   - Official photos (may need permission)

4. **Create Your Own**
   - Canva or Photoshop
   - UK blue background + sports elements
   - Logo + abstract design

### Paid Sources (if budget):
1. **Getty Images** - Professional sports photos
2. **Shutterstock** - Wide selection
3. **Adobe Stock** - High quality

---

## 🛠️ Image Optimization Tools

### Online (Free):
- **TinyPNG** - https://tinypng.com (best for JPG/PNG)
- **Squoosh** - https://squoosh.app (Google tool, very powerful)
- **Compressor.io** - https://compressor.io

### Desktop (Advanced):
- **Photoshop** - Save for Web (Legacy)
- **GIMP** - Free alternative to Photoshop
- **ImageOptim** (Mac) - Drag and drop

---

## ⚙️ Current Setup

The hero section is configured with:

✅ **Responsive background** - Scales properly on all devices
✅ **Smart overlays** - Gradient from dark (top) to light (bottom)
✅ **UK Blue tint** - Subtle brand color overlay
✅ **Text readability** - Dark overlay ensures white text pops
✅ **Decorative blurs** - Extra depth with blue orbs

---

## 🎨 Overlay Explanation

### Current Layers (bottom to top):
1. **Your background image** - The UK Sports graphic
2. **Gradient overlay** - Black 40% (top) → White 95% (bottom)
3. **UK Blue tint** - Subtle 5% blue overlay
4. **Decorative elements** - Blurred blue circles
5. **Content** - Logo, text, buttons

This ensures:
- Top of image is visible but slightly darkened
- Text remains readable
- UK blue brand color present
- Smooth transition to white bottom section

---

## 🔧 Customization Options

If you want to adjust the overlay after adding your image, edit `src/components/Hero.jsx`:

### Make image more visible:
```javascript
// Change this line (line 10):
<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-white/95" />
// To:
<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-white/95" />
```

### Make image less visible (darker):
```javascript
// Change to:
<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-white/95" />
```

### Remove UK Blue tint:
```javascript
// Delete or comment out line 12:
{/* <div className="absolute inset-0 bg-uk-blue/5" /> */}
```

---

## 📱 Mobile Considerations

The background image will automatically:
- Scale down for mobile screens
- Crop to focus on center
- Maintain aspect ratio
- Load responsive version (if you provide multiple sizes)

**Pro Tip:** Test on mobile after adding! Use Chrome DevTools device emulation.

---

## ✅ Checklist

Before uploading your image:

- [ ] Image is 1920x1080px or larger
- [ ] File is named `hero-background.jpg`
- [ ] File size is under 500KB
- [ ] Image is compressed/optimized
- [ ] Image is horizontal (landscape)
- [ ] Image has UK blue colors or sports theme
- [ ] Image isn't too busy or cluttered
- [ ] You have rights to use the image

---

## 🚀 Next Steps

1. Find/create your image
2. Follow the quick start steps above
3. Drop it in `public/` folder
4. Refresh your browser
5. Admire your amazing hero section! 🎉

**Need help?** The overlay and positioning are already perfect - just add your image!
