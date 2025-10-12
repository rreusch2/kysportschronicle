import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ArrowRight, Calendar, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const ArticleFeed = () => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [displayCount, setDisplayCount] = useState(9)
  
  // Auto Animate refs for smooth list animations
  const [articlesGridRef] = useAutoAnimate()
  const [categoriesRef] = useAutoAnimate()
  
  const categories = ['All', 'Football', 'Basketball', 'Baseball', 'High School', 'Recruiting', 'Analysis', 'Feature', 'Opinion']

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  const featuredArticle = filteredArticles.find(article => article.is_featured)
  const regularArticles = filteredArticles
    .filter(article => !article.is_featured)
    .slice(0, displayCount)

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
        <motion.div 
          ref={categoriesRef}
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-uk-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading articles...</p>
          </div>
        )}

        {/* No Articles */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found in this category.</p>
          </div>
        )}

        {/* Featured Article */}
        {!loading && selectedCategory === 'All' && featuredArticle && (
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
                        {format(new Date(featuredArticle.published_at || featuredArticle.created_at), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {featuredArticle.read_time} min read
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                      {featuredArticle.excerpt}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/article/${featuredArticle.slug}`)}
                    className="group inline-flex items-center gap-2 text-uk-blue font-semibold hover:gap-3 transition-all"
                  >
                    Read Full Article
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {!loading && (
          <div ref={articlesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                onClick={() => navigate(`/article/${article.slug}`)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                {article.thumbnail_url ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="gradient-blue h-48 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    <span className="text-white text-5xl font-bold opacity-20 group-hover:opacity-40 transition-opacity">
                      {article.category.charAt(0)}
                    </span>
                  </div>
                )}
              
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="px-3 py-1 bg-uk-blue/10 text-uk-blue rounded-full font-semibold text-xs">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {article.read_time} min read
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
                    <span>{article.author_name?.split(' ')[0] || 'KSC'}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {format(new Date(article.published_at || article.created_at), 'MMM d')}
                  </span>
                </div>
                
                <div className="mt-4 w-full py-3 border-2 border-uk-blue text-uk-blue font-semibold rounded-lg hover:bg-uk-blue hover:text-white transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                  <span>Read More</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && regularArticles.length < filteredArticles.filter(a => !a.is_featured).length && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setDisplayCount(displayCount + 9)}
              className="px-8 py-4 gradient-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleFeed
