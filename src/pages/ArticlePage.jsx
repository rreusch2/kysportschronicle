import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Calendar, Clock, User, ArrowLeft, Eye } from 'lucide-react'
import { format } from 'date-fns'

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-uk-blue transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="px-4 py-2 bg-uk-blue/10 text-uk-blue rounded-full font-semibold text-sm">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-semibold">{article.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {format(new Date(article.published_at || article.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{article.read_time} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>{article.views || 0} views</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.thumbnail_url && (
          <div className="mb-8">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-uk-blue">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-uk-blue prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-4 prose-blockquote:border-uk-blue prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <div
                  key={related.id}
                  onClick={() => navigate(`/article/${related.slug}`)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  {related.thumbnail_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={related.thumbnail_url}
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="px-3 py-1 bg-uk-blue/10 text-uk-blue rounded-full text-xs font-semibold">
                      {related.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticlePage
