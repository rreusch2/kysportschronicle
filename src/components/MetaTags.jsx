import { useEffect } from 'react'

/**
 * MetaTags component for dynamic SEO and social sharing
 * Updates document head with Open Graph and Twitter Card meta tags
 */
const MetaTags = ({ 
  title, 
  description, 
  image, 
  url,
  type = 'article',
  author = 'Kentucky Sports Chronicle',
  publishedTime,
  keywords = []
}) => {
  useEffect(() => {
    // Update page title
    document.title = title ? `${title} | Kentucky Sports Chronicle` : 'Kentucky Sports Chronicle | UK Athletics Coverage & Commentary'
    
    // Helper to update or create meta tags
    const updateMetaTag = (selector, content, attribute = 'content') => {
      if (!content) return
      
      let element = document.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        const [attr, value] = selector.match(/\[([^=]+)="([^"]+)"\]/).slice(1, 3)
        element.setAttribute(attr, value)
        document.head.appendChild(element)
      }
      element.setAttribute(attribute, content)
    }

    // Standard meta tags
    updateMetaTag('meta[name="description"]', description)
    if (keywords.length > 0) {
      updateMetaTag('meta[name="keywords"]', keywords.join(', '))
    }
    updateMetaTag('meta[name="author"]', author)

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', title)
    updateMetaTag('meta[property="og:description"]', description)
    updateMetaTag('meta[property="og:image"]', image)
    updateMetaTag('meta[property="og:url"]', url)
    updateMetaTag('meta[property="og:type"]', type)
    updateMetaTag('meta[property="og:site_name"]', 'Kentucky Sports Chronicle')
    if (publishedTime) {
      updateMetaTag('meta[property="article:published_time"]', publishedTime)
    }
    updateMetaTag('meta[property="article:author"]', author)

    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', image ? 'summary_large_image' : 'summary')
    updateMetaTag('meta[name="twitter:title"]', title)
    updateMetaTag('meta[name="twitter:description"]', description)
    if (image) {
      updateMetaTag('meta[name="twitter:image"]', image)
    }
    updateMetaTag('meta[name="twitter:site"]', '@KentuckySports')

    // Cleanup function
    return () => {
      // Reset to default title on unmount
      document.title = 'Kentucky Sports Chronicle | UK Athletics Coverage & Commentary'
    }
  }, [title, description, image, url, type, author, publishedTime, keywords])

  return null // This component doesn't render anything
}

export default MetaTags
