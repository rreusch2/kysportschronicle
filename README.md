# 🏈 Kentucky Sports Chronicle

A stunning, modern web application for Kentucky's premier source of UK Athletics coverage, commentary, and news.

![Kentucky Sports Chronicle](./logobanner.JPG)

## ✨ Features

- **Modern React Architecture** - Built with React 18 and Vite for blazing-fast performance
- **Beautiful UI/UX** - Sleek design with Kentucky blue gradient accents and smooth animations
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Article Feed** - Dynamic blog feed with category filtering and featured stories
- **Email Subscription** - Integrated newsletter subscription system
- **Contact Form** - Easy-to-use contact form for reader engagement
- **Social Integration** - Facebook and email links for community building

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

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   - Navigate to `http://localhost:5173`
   - The site will hot-reload as you make changes

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

## 🎯 Sections

- **Home** - Eye-catching hero section with call-to-action buttons
- **Blog** - Article feed with filtering by category (Football, Basketball, Recruiting, etc.)
- **About** - Mission statement and what Kentucky Sports Chronicle covers
- **Contact** - Contact form with email: laconmckinney@icloud.com
- **Subscribe** - Newsletter subscription for daily updates
- **Footer** - Quick links and social media connections

## 🛠️ Technologies Used

- **React 18** - Modern UI framework
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **PostCSS** - CSS processing

## 🎨 Customization

### Colors

The color scheme uses Kentucky blue with the following values defined in `tailwind.config.js`:

```javascript
colors: {
  'uk-blue': '#0033A0',      // Primary blue
  'uk-blue-light': '#0051C8', // Lighter blue
  'uk-blue-dark': '#002878',  // Darker blue
}
```

### Adding Articles

Articles are currently stored in `src/components/ArticleFeed.jsx` in the `sampleArticles` array. 

For production, integrate with:
- A headless CMS (Contentful, Sanity, Strapi)
- A custom backend API
- Static markdown files with frontmatter

### Email Integration

The subscription and contact forms currently log to console. To make them functional:

1. Integrate with an email service (SendGrid, Mailchimp, ConvertKit)
2. Set up a backend API endpoint
3. Configure form submission handlers

## 📱 Social Media

- **Email**: laconmckinney@icloud.com
- **Facebook**: Update link in Navigation and Footer components

## 🚀 Deployment

Deploy to any modern hosting platform:

- **Vercel** - `vercel` (Recommended)
- **Netlify** - Drag and drop `dist` folder
- **GitHub Pages** - Use `gh-pages` package
- **AWS S3** - Static website hosting

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
