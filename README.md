# 🏈 Kentucky Sports Chronicle

A stunning, modern web application with a full-featured CMS for Kentucky's premier source of UK Athletics coverage, commentary, and news.

![Kentucky Sports Chronicle](./logobanner.JPG)

## ✨ Features

### Public Site
- **Modern React Architecture** - Built with React 18 and Vite for blazing-fast performance
- **Beautiful UI/UX** - Sleek design with Kentucky blue gradient accents and smooth animations
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Dynamic Article Feed** - Real-time articles from Supabase with category filtering
- **Individual Article Pages** - Full article view with SEO optimization
- **Social Sharing** - One-click sharing to Facebook, Twitter, Email, and link copying
- **Dynamic Meta Tags** - Open Graph and Twitter Cards for rich social previews
- **SEO Optimized** - Comprehensive meta tags, structured data, and semantic HTML
- **Email Subscription** - Integrated newsletter subscription system
- **Contact Form** - Easy-to-use contact form for reader engagement
- **Social Integration** - Facebook and email links for community building

### Content Management System (CMS)
- **Full Admin Dashboard** - Manage all articles from one place
- **Rich Text Editor** - Medium-style editor with image uploads
- **Drag & Drop Images** - Easy image management with Supabase storage
- **Draft System** - Save articles as drafts before publishing
- **Category Management** - Organize articles by sport/topic
- **Featured Articles** - Highlight important stories on homepage
- **User Authentication** - Secure login for authorized owners
- **Real-time Updates** - Articles appear instantly on the site
- **Analytics** - View counts and basic stats

## 🎨 Design Highlights

- Custom UK Blue color scheme matching the brand
- Smooth scroll animations and transitions
- Modern card-based layouts
- Gradient backgrounds and decorative elements
- Professional typography and spacing
- Hover effects and micro-interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed on your machine
- npm or yarn package manager
- A Supabase account (free tier works great!)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Supabase**
   
   Follow the detailed guide in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
   
   Quick steps:
   - Create a Supabase project
   - Run the database migration
   - Set up storage bucket
   - Create admin user accounts
   - Configure environment variables

3. **Configure Environment**
   
   Create a `.env.local` file:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Site**
   - Public site: `http://localhost:5173`
   - Admin login: `http://localhost:5173/admin/login`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
lacon/
├── public/
│   ├── logoround.JPG       # Round logo
│   └── logobanner.JPG      # Banner logo
├── src/
│   ├── components/
│   │   ├── Navigation.jsx  # Main navigation bar
│   │   ├── Hero.jsx        # Landing hero section
│   │   ├── ArticleFeed.jsx # Blog article feed
│   │   ├── About.jsx       # About section
│   │   ├── Contact.jsx     # Contact form
│   │   ├── Subscribe.jsx   # Email subscription
│   │   └── Footer.jsx      # Footer component
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS config
├── vite.config.js          # Vite config
└── README.md               # This file
```

## 🎯 Site Structure

### Public Pages
- **/** - Homepage with hero, article feed, about, contact, subscribe sections
- **/article/:slug** - Individual article pages with full content
- **/admin/login** - Admin authentication

### Admin Pages (Protected)
- **/admin/dashboard** - Article management dashboard
- **/admin/article/new** - Create new articles
- **/admin/article/:id** - Edit existing articles

### Sections on Homepage
- **Hero** - Eye-catching intro with call-to-action buttons
- **Articles** - Dynamic feed with category filtering and featured article
- **About** - Mission statement and what Kentucky Sports Chronicle covers
- **Contact** - Contact form (laconmckinney@icloud.com)
- **Subscribe** - Newsletter subscription
- **Footer** - Quick links and social media

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **date-fns** - Date formatting

### Backend & Database
- **Supabase** - Backend as a service
  - PostgreSQL database
  - Authentication
  - Storage for images
  - Real-time subscriptions
  - Row Level Security (RLS)

### Content Management
- **TipTap** - Rich text WYSIWYG editor
  - Bold, italic, headings
  - Lists and blockquotes
  - Image uploads
  - Link management
  - Undo/redo

## 📚 Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase setup guide
- **[CMS_GUIDE.md](./CMS_GUIDE.md)** - User guide for content creators
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment guide and 404 fix
- **[README.md](./README.md)** - This file (developer documentation)

## 👥 For Content Creators

If you're one of the Kentucky Sports Chronicle owners who will be writing articles, check out **[CMS_GUIDE.md](./CMS_GUIDE.md)** for a complete guide on:
- How to log in
- Creating and editing articles
- Using the rich text editor
- Managing images
- Publishing workflow
- Tips for great content

## 🎨 Customization

### Colors

The color scheme uses Kentucky blue defined in `tailwind.config.js`:

```javascript
colors: {
  'uk-blue': '#0033A0',      // Primary blue
  'uk-blue-light': '#0051C8', // Lighter blue
  'uk-blue-dark': '#002878',  // Darker blue
}
```

### Database Schema

Articles table includes:
- `id` - UUID primary key
- `title` - Article headline
- `slug` - URL-friendly version of title
- `content` - Full article HTML
- `excerpt` - Short summary
- `thumbnail_url` - Featured image URL
- `category` - Article category
- `author_name` - Writer name
- `is_published` - Published status
- `is_featured` - Featured on homepage
- `views` - View count
- `read_time` - Calculated reading time
- Timestamps (created, updated, published)

### Adding New Features

The codebase is modular and easy to extend:
- Add new routes in `src/App.jsx`
- Create new pages in `src/pages/`
- Add components in `src/components/`
- Modify Supabase schema with new migrations

## 📱 Social Media

- **Email**: laconmckinney@icloud.com
- **Facebook**: Update link in Navigation and Footer components

## 🚀 Deployment

Deploy to any modern hosting platform. **See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.**

Quick deploy options:

- **Netlify** - Auto-deploy from Git (Recommended)
- **Vercel** - `vercel` command or Git integration
- **GitHub Pages** - Use `gh-pages` package
- **AWS S3 + CloudFront** - Static website hosting

### Important: SPA Routing

Configuration files included to fix 404 errors on article links:
- ✅ `netlify.toml` - For Netlify
- ✅ `vercel.json` - For Vercel
- ✅ `public/_redirects` - For other platforms

These ensure shared article links work correctly!

## 📝 Future Enhancements

- Backend integration for article management
- User authentication and comments
- Real-time score updates
- Video content integration
- Advanced search functionality
- Social media feed integration
- Mobile app version

## 📄 License

All rights reserved © 2024 Kentucky Sports Chronicle

## 💙 Made with Love for Big Blue Nation

Go Wildcats! 🐾
