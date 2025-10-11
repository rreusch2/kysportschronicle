import { ArrowRight, Trophy, TrendingUp, Users } from 'lucide-react'

const Hero = ({ scrollToSection }) => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-blue-radial opacity-5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-uk-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-uk-blue-light/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="mb-8 inline-block">
              <img 
                src="/logobanner.JPG" 
                alt="Kentucky Sports Chronicle" 
                className="h-24 md:h-32 object-contain mx-auto animate-slide-up"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 animate-slide-up">
              Your Source for
              <span className="block mt-2 bg-gradient-to-r from-uk-blue to-uk-blue-light bg-clip-text text-transparent">
                Kentucky Sports
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up">
              Comprehensive coverage and expert commentary on University of Kentucky Athletics 
              and the stories shaping sports across the Commonwealth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <button
                onClick={() => scrollToSection('articles')}
                className="group px-8 py-4 gradient-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center space-x-2"
              >
                <span>Read Latest Stories</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              
              <button
                onClick={() => scrollToSection('subscribe')}
                className="px-8 py-4 bg-white text-uk-blue font-semibold rounded-xl border-2 border-uk-blue hover:bg-uk-blue hover:text-white transition-all duration-200 hover:scale-105 shadow-md"
              >
                Subscribe to Updates
              </button>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <Trophy className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Game Coverage</h3>
              <p className="text-gray-600">
                In-depth analysis and live updates from every Wildcats game across all sports.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Analysis</h3>
              <p className="text-gray-600">
                Professional commentary and insights on team performance, strategy, and more.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Join thousands of passionate Kentucky sports fans staying informed and engaged.
              </p>
            </div>
          </div>
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
