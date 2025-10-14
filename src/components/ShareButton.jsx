import { useState } from 'react'
import { Share2, Link2, Facebook, Twitter, Mail, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ShareButton component with social sharing capabilities
 * Supports: Copy Link, Facebook, Twitter, Email
 */
const ShareButton = ({ url, title, excerpt, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = url || window.location.href
  const shareTitle = title || document.title
  const shareText = excerpt || 'Check out this article from Kentucky Sports Chronicle'

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Share to Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  // Share to Twitter
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  // Share via Email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle)
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  // Use native share API if available (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
          setIsOpen(true) // Fallback to custom share menu
        }
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Link2,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      action: copyToClipboard,
      label: copied ? 'Copied!' : 'Copy Link'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-[#1877F2]',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: shareToFacebook,
      label: 'Facebook'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-[#1DA1F2]',
      bgColor: 'bg-sky-50 hover:bg-sky-100',
      action: shareToTwitter,
      label: 'Twitter'
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      action: shareViaEmail,
      label: 'Email'
    },
  ]

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-uk-blue to-uk-blue-light text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        aria-label="Share article"
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>

      {/* Share Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'transparent' }}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            >
              <div className="p-2">
                {shareOptions.map((option, index) => (
                  <motion.button
                    key={option.name}
                    onClick={() => {
                      option.action()
                      if (option.name !== 'Copy Link') {
                        setIsOpen(false)
                      }
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${option.bgColor} group`}
                  >
                    <option.icon 
                      size={20} 
                      className={`${option.color} ${option.name === 'Copy Link' && copied ? 'animate-bounce' : ''}`} 
                    />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShareButton
