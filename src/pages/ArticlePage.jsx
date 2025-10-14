import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Calendar, Clock, User, ArrowLeft, Eye } from 'lucide-react'
import { format } from 'date-fns'
import MetaTags from '../components/MetaTags'
import ShareButton from '../components/ShareButton'

const ArticlePage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedArticles, setRelatedArticles] = useState([])

  useEffect(() => {
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      // Fetch the article
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) throw error

      setArticle(data)

      // Increment view count
      await supabase
        .from('articles')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id)

      // Fetch related articles
      const { data: related } = await supabase
        .from('articles')
        .select('*')
        .eq('category', data.category)
        .eq('is_published', true)
        .neq('id', data.id)
        .limit(3)
        .order('published_at', { ascending: false })

      setRelatedArticles(related || [])
    } catch (error) {
      console.error('Error fetching article:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-uk-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-uk-blue hover:text-uk-blue-light font-semibold"
          >
            Return home
          </button>
        </div>
      </div>
    )
  }

  // Get the full article URL
  const articleUrl = `${window.location.origin}/article/${article.slug}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Dynamic Meta Tags for SEO and Social Sharing */}
      <MetaTags
        title={article.title}
        description={article.excerpt}
        image={article.thumbnail_url}
        url={articleUrl}
        author={article.author_name}
        publishedTime={article.published_at}
        keywords={[article.category, 'Kentucky', 'UK Athletics', 'Sports']}
      />

      {/* Header with Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-uk-blue transition-all font-semibold hover:gap-3 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          {/* Share Button in Header */}
          <ShareButton 
            url={articleUrl}
            title={article.title}
            excerpt={article.excerpt}
          />
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 animate-fade-in">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-uk-blue to-uk-blue-light text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-shadow">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight animate-slide-up">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 animate-slide-up">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <User size={18} className="text-uk-blue" />
              <span className="font-semibold text-gray-900">{article.author_name}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <Calendar size={18} className="text-uk-blue" />
              <span>
                {format(new Date(article.published_at || article.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <Clock size={18} className="text-uk-blue" />
              <span>{article.read_time} min read</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <Eye size={18} className="text-uk-blue" />
              <span>{article.views || 0} views</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.thumbnail_url && (
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10 rounded-2xl" />
            </div>
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-uk-blue shadow-md animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-1 h-full bg-uk-blue rounded-full" />
              <div>
                <p className="text-sm font-bold text-uk-blue uppercase tracking-wide mb-2">Article Summary</p>
                <p className="text-xl text-gray-800 leading-relaxed font-medium">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Share Section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-md animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Enjoyed this article?</h3>
              <p className="text-gray-600">Share it with fellow Big Blue fans!</p>
            </div>
            <ShareButton 
              url={articleUrl}
              title={article.title}
              excerpt={article.excerpt}
            />
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 py-16 mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Related Articles</h2>
              <p className="text-gray-600 mb-8">Continue reading more stories like this</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => navigate(`/article/${related.slug}`)}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:-translate-y-2 group"
                  >
                    {related.thumbnail_url && (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={related.thumbnail_url}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-uk-blue/10 text-uk-blue rounded-full text-xs font-bold">
                        {related.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 line-clamp-2 group-hover:text-uk-blue transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {related.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticlePage
