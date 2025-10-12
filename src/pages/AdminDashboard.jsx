import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  PlusCircle, Edit, Trash2, Eye, EyeOff, LogOut, 
  Search, Star, Calendar, BarChart, Mail, Menu, X,
  TrendingUp, FileText, Clock, ExternalLink
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 md:gap-4">
              <img 
                src="/logoround.JPG" 
                alt="KSC" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-md" 
              />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-uk-blue to-uk-blue-light bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs md:text-sm text-gray-600 truncate max-w-[200px]">{user?.email}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/inbox')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-uk-blue font-semibold transition-colors rounded-lg hover:bg-gray-50"
              >
                <Mail size={18} />
                <span>Inbox</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-uk-blue font-semibold transition-colors rounded-lg hover:bg-gray-50"
              >
                <ExternalLink size={18} />
                <span>View Site</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 gradient-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-uk-blue transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-2 animate-fade-in">
              <button
                onClick={() => {
                  navigate('/admin/inbox')
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <Mail size={20} />
                <span>Inbox</span>
              </button>
              <button
                onClick={() => {
                  navigate('/')
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <ExternalLink size={20} />
                <span>View Site</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 gradient-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Welcome Banner */}
        <div className="gradient-blue rounded-2xl p-6 md:p-8 mb-6 md:mb-8 text-white shadow-xl animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-blue-100 text-sm md:text-base">
                Here's what's happening with your content today
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/article/new')}
              className="bg-white text-uk-blue px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <PlusCircle size={20} />
              <span>Create Article</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Articles */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 gradient-blue rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-semibold mb-1">Total Articles</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <TrendingUp size={12} />
              <span>All time</span>
            </div>
          </div>

          {/* Published */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Eye className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-semibold mb-1">Published</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.published}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-medium">
              <span>Live now</span>
            </div>
          </div>

          {/* Drafts */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="text-orange-600" size={20} />
              </div>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-semibold mb-1">Drafts</p>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">{stats.drafts}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-orange-600 font-medium">
              <span>In progress</span>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart className="text-purple-600" size={20} />
              </div>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-semibold mb-1">Total Views</p>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">{stats.views.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-purple-600 font-medium">
              <TrendingUp size={12} />
              <span>Engagement</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:border-uk-blue focus:outline-none transition-colors text-sm md:text-base"
              />
            </div>

            {/* Filter & Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:border-uk-blue focus:outline-none font-semibold text-sm md:text-base bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button
                onClick={() => navigate('/admin/article/new')}
                className="gradient-blue text-white px-6 py-2.5 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <PlusCircle size={20} />
                <span className="hidden sm:inline">New Article</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Found <span className="font-bold text-uk-blue">{filteredArticles.length}</span> article{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-uk-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading your content...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-12 md:p-16 text-center shadow-sm border border-gray-100 animate-fade-in">
            <div className="w-20 h-20 bg-uk-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-uk-blue" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? 'No results found' : 'No articles yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search or filter'
                : 'Start creating amazing content for your readers'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/admin/article/new')}
                className="gradient-blue text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all inline-flex items-center gap-2 hover:scale-105"
              >
                <PlusCircle size={22} />
                Create Your First Article
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {filteredArticles.map((article, index) => (
              <div
                key={article.id}
                className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group animate-slide-up"
                style={{ animationDelay: `${(index % 5) * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">
                  {/* Thumbnail */}
                  {article.thumbnail_url && (
                    <div className="sm:w-48 sm:flex-shrink-0">
                      <img 
                        src={article.thumbnail_url} 
                        alt={article.title}
                        className="w-full h-40 sm:h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-start gap-2 mb-3">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-uk-blue transition-colors flex-1 min-w-0">
                        {article.title}
                      </h3>
                      {article.is_featured && (
                        <Star className="text-yellow-500 fill-current flex-shrink-0" size={18} />
                      )}
                    </div>
                    
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        article.is_published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {article.is_published ? '● Live' : '○ Draft'}
                      </span>
                      <span className="px-3 py-1 bg-uk-blue/10 text-uk-blue rounded-full text-xs font-bold">
                        {article.category}
                      </span>
                    </div>
                    
                    {/* Excerpt */}
                    <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="flex-shrink-0" />
                        <span className="hidden sm:inline">
                          {format(new Date(article.created_at), 'MMM d, yyyy')}
                        </span>
                        <span className="sm:hidden">
                          {format(new Date(article.created_at), 'MMM d')}
                        </span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="flex-shrink-0" />
                        {article.read_time} min
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={14} className="flex-shrink-0" />
                        {(article.views || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions - Desktop */}
                  <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => togglePublish(article)}
                      className={`p-2.5 rounded-lg transition-all ${
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
                      className="p-2.5 bg-uk-blue/10 text-uk-blue rounded-lg hover:bg-uk-blue/20 transition-all"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Actions - Mobile */}
                <div className="sm:hidden flex items-center gap-2 px-4 pb-4 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => togglePublish(article)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                      article.is_published
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {article.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                    <span>{article.is_published ? 'Unpublish' : 'Publish'}</span>
                  </button>
                  <button
                    onClick={() => navigate(`/admin/article/${article.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 gradient-blue text-white rounded-lg font-semibold text-sm"
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    className="p-2.5 bg-red-100 text-red-600 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
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
