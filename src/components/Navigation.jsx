import { useState, useEffect } from 'react'
import { Menu, X, Facebook } from 'lucide-react'

const Navigation = ({ activeSection, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'articles', label: 'Blog' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'subscribe', label: 'Subscribe' },
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg py-3' 
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <img 
              src="/logoround.JPG" 
              alt="Kentucky Sports Chronicle" 
              className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="text-uk-blue font-bold text-xl leading-tight">
                Kentucky Sports
              </span>
              <span className="text-uk-blue-light font-semibold text-sm leading-tight">
                Chronicle
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-semibold transition-all duration-200 relative group ${
                  activeSection === item.id
                    ? 'text-uk-blue'
                    : 'text-gray-600 hover:text-uk-blue'
                }`}
              >
                {item.label}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-uk-blue transition-transform duration-200 ${
                    activeSection === item.id 
                      ? 'scale-x-100' 
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-uk-blue transition-colors duration-200"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-uk-blue p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-down">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id)
                    setIsOpen(false)
                  }}
                  className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'bg-uk-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Facebook size={20} />
                <span className="font-semibold">Facebook</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
