import { Heart, Target, Users, Award } from 'lucide-react'

const About = () => {
  return (
    <div className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-uk-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-uk-blue-light/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-uk-blue">Kentucky Sports Chronicle</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-uk-blue to-uk-blue-light mx-auto mb-8 rounded-full" />
            <p className="text-xl text-gray-700 leading-relaxed">
              Kentucky's source for coverage and commentary of UK athletics and the stories 
              shaping sports across the Commonwealth.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-br from-uk-blue to-uk-blue-light rounded-2xl p-8 md:p-12 text-white mb-12 shadow-xl animate-slide-up">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <Target size={32} />
              Our Mission
            </h3>
            <p className="text-lg leading-relaxed opacity-95">
              We're dedicated to providing comprehensive, insightful coverage of University of Kentucky 
              athletics and the broader sports landscape across Kentucky. From game analysis to recruiting 
              updates, from player profiles to championship moments, we bring Big Blue Nation the stories 
              that matter most.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="w-16 h-16 gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
                <Heart className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Passion</h4>
              <p className="text-gray-600">
                Driven by love for Kentucky sports and commitment to our readers
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
                <Award className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Excellence</h4>
              <p className="text-gray-600">
                Delivering high-quality journalism and expert analysis
              </p>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="w-16 h-16 gradient-blue rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
                <Users className="text-white" size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Community</h4>
              <p className="text-gray-600">
                Building connections among Kentucky sports fans
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What We Cover
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-uk-blue">Game Coverage:</strong> Comprehensive recaps, live updates, 
                and post-game analysis for all major UK sports including football, basketball, baseball, 
                volleyball, and more.
              </p>
              <p>
                <strong className="text-uk-blue">Recruiting:</strong> Stay informed on the latest commitments, 
                prospects, and recruiting news that will shape the future of Kentucky athletics.
              </p>
              <p>
                <strong className="text-uk-blue">Commentary & Analysis:</strong> Expert insights, opinion pieces, 
                and deep-dive analysis that go beyond the box score.
              </p>
              <p>
                <strong className="text-uk-blue">Commonwealth Sports:</strong> Coverage of high school sports, 
                local athletes, and the broader Kentucky sports community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
