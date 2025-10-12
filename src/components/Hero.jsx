import { ArrowRight, Trophy, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = ({ scrollToSection }) => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-gray-100 to-white">
      {/* Background Image - Add your UK Sports graphic here! */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300" 
        style={{ 
          backgroundImage: 'url(/hero-background.jpg)',
          backgroundAttachment: 'scroll' // Change to 'fixed' for parallax effect
        }}
      >
        {/* Dark overlay for text readability - Stronger gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-white/95" />
        {/* Centered darker overlay for main content area */}
        <div className="absolute inset-0 bg-radial-gradient-custom" 
          style={{
            background: 'radial-gradient(circle at center 40%, rgba(0, 0, 0, 0.6) 0%, transparent 70%)'
          }} 
        />
      </div>
      
      {/* Decorative Elements - Keep for extra depth */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-uk-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-uk-blue-light/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16">
            <motion.div 
              className="mb-10 inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              <img 
                src="/logobanner.JPG" 
                alt="Kentucky Sports Chronicle" 
                className="h-32 md:h-40 lg:h-48 w-auto object-contain mx-auto"
                style={{ 
                  filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.8)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.6))',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '1rem 1.5rem',
                  borderRadius: '1rem'
                }}
              />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
              style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Your Source for
              <motion.span 
                className="block mt-2 text-uk-blue-light font-extrabold"
                style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 255, 255, 0.3)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                Kentucky Sports
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
              style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.8)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Comprehensive coverage and expert commentary on University of Kentucky Athletics 
              and the stories shaping sports across the Commonwealth.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                onClick={() => scrollToSection('articles')}
                className="group px-8 py-4 gradient-blue text-white font-semibold rounded-xl shadow-lg flex items-center space-x-2"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 30px rgba(0, 51, 160, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Read Latest Stories</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </motion.button>
              
              <motion.button
                onClick={() => scrollToSection('subscribe')}
                className="px-8 py-4 bg-white text-uk-blue font-semibold rounded-xl border-2 border-uk-blue shadow-md"
                whileHover={{ scale: 1.05, backgroundColor: "#0033A0", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe to Updates
              </motion.button>
            </motion.div>
          </div>
          
          {/* Feature Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <Trophy className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Game Coverage</h3>
              <p className="text-gray-600">
                In-depth analysis and live updates from every Wildcats game across all sports.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Analysis</h3>
              <p className="text-gray-600">
                Professional commentary and insights on team performance, strategy, and more.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Join thousands of passionate Kentucky sports fans staying informed and engaged.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </div>
  )
}

export default Hero
