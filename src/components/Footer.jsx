import { Facebook, Mail, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer = ({ scrollToSection }) => {
  const currentYear = new Date().getFullYear()
  const navigate = useNavigate()

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <button 
              onClick={() => navigate('/admin/login')}
              className="flex items-center space-x-3 mb-4 group cursor-pointer"
              aria-label="Admin Access"
            >
              <img 
                src="/logoround.JPG" 
                alt="Kentucky Sports Chronicle" 
                className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight group-hover:text-uk-blue transition-colors">
                  Kentucky Sports
                </span>
                <span className="text-gray-400 text-sm leading-tight">
                  Chronicle
                </span>
              </div>
            </button>
            <p className="text-gray-400 mb-4 max-w-md">
              Kentucky's source for coverage and commentary of UK athletics and the 
              stories shaping sports across the Commonwealth.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-uk-blue transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="mailto:laconmckinney@icloud.com"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-uk-blue transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('articles')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Football</li>
              <li className="text-gray-400">Basketball</li>
              <li className="text-gray-400">Baseball</li>
              <li className="text-gray-400">Recruiting</li>
              <li className="text-gray-400">Analysis</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Kentucky Sports Chronicle. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <Heart size={14} className="text-uk-blue fill-current" /> for Big Blue Nation
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
