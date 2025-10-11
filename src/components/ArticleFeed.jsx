import { useState } from 'react'
import { Clock, ArrowRight, Calendar, User } from 'lucide-react'

// Sample articles - In production, these would come from a CMS or API
const sampleArticles = [
  {
    id: 1,
    title: "Wildcats Dominate in Season Opener: A Complete Breakdown",
    excerpt: "Kentucky put on a commanding performance in their season opener, showcasing the depth and talent that has fans excited for the year ahead. We break down the key plays and standout performances.",
    author: "Kentucky Sports Chronicle",
    date: "2024-10-10",
    readTime: "5 min read",
    category: "Football",
    featured: true,
  },
  {
    id: 2,
    title: "Basketball Practice Report: Five Takeaways from the First Week",
    excerpt: "As the Wildcats basketball team completes their first week of practice, we dive into the early observations and what they mean for the upcoming season.",
    author: "Kentucky Sports Chronicle",
    date: "2024-10-09",
    readTime: "4 min read",
    category: "Basketball",
    featured: false,
  },
  {
    id: 3,
    title: "Recruiting Roundup: Kentucky Lands Top Prospect",
    excerpt: "The Wildcats continue to build an impressive recruiting class with the latest commitment from a highly-touted prospect. Here's what this means for the program's future.",
    author: "Kentucky Sports Chronicle",
    date: "2024-10-08",
    readTime: "3 min read",
    category: "Recruiting",
    featured: false,
  },
  {
    id: 4,
    title: "Women's Volleyball Continues Undefeated Streak",
    excerpt: "Kentucky women's volleyball extends their winning streak to 10 games with another dominant performance. We analyze the team's success and what makes them so special.",
    author: "Kentucky Sports Chronicle",
    date: "2024-10-07",
    readTime: "4 min read",
    category: "Volleyball",
    featured: false,
  },
  {
    id: 5,
    title: "SEC Power Rankings: Where Do the Wildcats Stand?",
    excerpt: "A comprehensive look at how Kentucky stacks up against SEC competition across all major sports as we head deeper into the fall season.",
    author: "Kentucky Sports Chronicle",
    date: "2024-10-06",
    readTime: "6 min read",
    category: "Analysis",
    featured: false,
  },
  {
    id: 6,
    title: "Behind the Scenes: A Day with UK Athletics",
    excerpt: "Get an exclusive look at what goes on behind the scenes in Kentucky's athletic department, from training facilities to game day preparation.",
    author: "Kentucky Sports Chronicle",
    date: "2024-10-05",
    readTime: "7 min read",
    category: "Feature",
    featured: false,
  },
]

const ArticleFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', 'Football', 'Basketball', 'Recruiting', 'Volleyball', 'Analysis', 'Feature']
  
  const filteredArticles = selectedCategory === 'All' 
    ? sampleArticles 
    : sampleArticles.filter(article => article.category === selectedCategory)

  const featuredArticle = sampleArticles.find(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay up to date with the latest news, analysis, and commentary on Kentucky athletics
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                selectedCategory === category
                  ? 'gradient-blue text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {selectedCategory === 'All' && featuredArticle && (
          <div className="mb-12 animate-slide-up">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-uk-blue to-uk-blue-light p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold mb-4">
                      Featured Story
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {featuredArticle.title}
                    </h3>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="px-3 py-1 bg-uk-blue/10 text-uk-blue rounded-full font-semibold">
                        {featuredArticle.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(featuredArticle.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {featuredArticle.readTime}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                      {featuredArticle.excerpt}
                    </p>
                  </div>
                  <button className="group inline-flex items-center gap-2 text-uk-blue font-semibold hover:gap-3 transition-all">
                    Read Full Article
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, index) => (
            <article
              key={article.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="gradient-blue h-48 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <span className="text-white text-5xl font-bold opacity-20 group-hover:opacity-40 transition-opacity">
                  {article.category.charAt(0)}
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="px-3 py-1 bg-uk-blue/10 text-uk-blue rounded-full font-semibold text-xs">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {article.readTime}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-uk-blue transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} />
                    <span>{article.author.split(' ')[0]}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(article.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <button className="mt-4 w-full py-3 border-2 border-uk-blue text-uk-blue font-semibold rounded-lg hover:bg-uk-blue hover:text-white transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                  <span>Read More</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 gradient-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  )
}

export default ArticleFeed
