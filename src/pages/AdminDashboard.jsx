import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  PlusCircle, Edit, Trash2, Eye, EyeOff, LogOut, 
  Search, Star, Calendar, BarChart, Mail
} from 'lucide-react'
import { format } from 'date-fns'

const AdminDashboard = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, views: 0 })

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setArticles(data || [])
      
      // Calculate stats
      const published = data.filter(a => a.is_published).length
      const totalViews = data.reduce((sum, a) => sum + (a.views || 0), 0)
      setStats({
        total: data.length,
        published,
        drafts: data.length - published,
        views: totalViews
      })
    } catch (error) {
      console.error('Error fetching articles:', error)
      alert('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error

      setArticles(articles.filter(a => a.id !== id))
      alert('Article deleted successfully')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article')
    }
  }

  const togglePublish = async (article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ 
          is_published: !article.is_published,
          published_at: !article.is_published ? new Date().toISOString() : null
        })
        .eq('id', article.id)

      if (error) throw error

      fetchArticles()
    } catch (error) {
      console.error('Error toggling publish:', error)
      alert('Failed to update article status')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const categories = ['All', 'Football', 'Basketball', 'Baseball', 'Volleyball', 'Recruiting', 'Analysis', 'Feature', 'Announcement']

  const filteredArticles = articles
    .filter(a => filterCategory === 'All' || a.category === filterCategory)
    .filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logoround.JPG" alt="KSC" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/inbox')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-uk-blue font-semibold transition-colors"
              >
                <Mail size={18} />
                Inbox
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-uk-blue font-semibold transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Articles</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-uk-blue/10 rounded-lg flex items-center justify-center">
                <BarChart className="text-uk-blue" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.published}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Drafts</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.drafts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <EyeOff className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Views</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.views}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none font-semibold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button
                onClick={() => navigate('/admin/article/new')}
                className="gradient-blue text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <PlusCircle size={20} />
                New Article
              </button>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-uk-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600 text-lg">No articles found</p>
            <button
              onClick={() => navigate('/admin/article/new')}
              className="mt-4 gradient-blue text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create Your First Article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{article.title}</h3>
                      {article.is_featured && (
                        <Star className="text-yellow-500 fill-current" size={20} />
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        article.is_published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span className="px-3 py-1 bg-uk-blue/10 text-uk-blue rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {format(new Date(article.created_at), 'MMM d, yyyy')}
                      </span>
                      <span>•</span>
                      <span>{article.read_time} min read</span>
                      <span>•</span>
                      <span>{article.views || 0} views</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublish(article)}
                      className={`p-2 rounded-lg transition-colors ${
                        article.is_published
                          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                      title={article.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {article.is_published ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/article/${article.id}`)}
                      className="p-2 bg-uk-blue/10 text-uk-blue rounded-lg hover:bg-uk-blue/20 transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
