import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, uploadImage, generateSlug, calculateReadTime } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import RichTextEditor from '../components/RichTextEditor'
import ImageCropper from '../components/ImageCropper'
import { 
  Save, Eye, ArrowLeft, Image as ImageIcon, 
  Star, Upload, X, CheckCircle, Crop
} from 'lucide-react'

const ArticleEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isNew = id === 'new'

  const [saving, setSaving] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [cropperImage, setCropperImage] = useState(null)
  const [cropperType, setCropperType] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail_url: '',
    category: 'General',
    is_featured: false,
    is_published: false,
  })

  useEffect(() => {
    if (!isNew) {
      fetchArticle()
    }
  }, [id])

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setFormData(data)
    } catch (error) {
      console.error('Error fetching article:', error)
      alert('Failed to load article')
      navigate('/admin/dashboard')
    }
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Read the file and show cropper
    const reader = new FileReader()
    reader.onload = () => {
      setCropperImage(reader.result)
      setCropperType('thumbnail')
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob) => {
    setUploadingThumbnail(true)
    setCropperImage(null)
    setCropperType(null)
    
    try {
      // Create a File object from the blob
      const file = new File([croppedBlob], 'thumbnail.jpg', { type: 'image/jpeg' })
      const url = await uploadImage(file)
      setFormData({ ...formData, thumbnail_url: url })
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      alert('Failed to upload thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleCropCancel = () => {
    setCropperImage(null)
    setCropperType(null)
  }

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    if (!formData.content.trim() || formData.content === '<p></p>') {
      alert('Please write some content')
      return
    }

    setSaving(true)
    try {
      // Generate slug if new or title changed
      const slug = formData.slug || generateSlug(formData.title)
      const readTime = calculateReadTime(formData.content)

      const articleData = {
        ...formData,
        slug,
        read_time: readTime,
        author_id: user.id,
        author_name: formData.author_name || 'Kentucky Sports Chronicle',
        is_published: publish ? true : formData.is_published,
        published_at: publish && !formData.is_published ? new Date().toISOString() : formData.published_at,
      }

      let result
      if (isNew) {
        const { data, error } = await supabase
          .from('articles')
          .insert([articleData])
          .select()
          .single()
        
        if (error) throw error
        result = data
        navigate(`/admin/article/${result.id}`, { replace: true })
      } else {
        const { data, error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        result = data
        setFormData(result)
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Failed to save article: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const categories = [
    'General', 'Football', 'Basketball', 'Baseball', 'Volleyball', 
    'Recruiting', 'Analysis', 'Feature', 'Announcement', 'Opinion'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Image Cropper Modal */}
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatios={cropperType === 'thumbnail'}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left side */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Back to Dashboard"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-uk-blue to-uk-blue-light bg-clip-text text-transparent">
                  {isNew ? '✨ New Article' : '📝 Edit Article'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    formData.is_published 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {formData.is_published ? '● Live' : '○ Draft'}
                  </span>
                  {formData.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      <Star size={12} className="fill-current" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {showSuccess && (
                <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                  <CheckCircle size={20} />
                  <span className="font-semibold hidden sm:inline">Saved!</span>
                </div>
              )}
              
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 text-sm md:text-base"
              >
                <Save size={18} />
                <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Draft'}</span>
                <span className="sm:hidden">Save</span>
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 gradient-blue text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm md:text-base"
              >
                <Eye size={18} />
                <span className="hidden sm:inline">{formData.is_published ? 'Update' : 'Publish'}</span>
                <span className="sm:hidden">{formData.is_published ? 'Update' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-fade-in">
              <input
                type="text"
                placeholder="Your article title here..."
                value={formData.title}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  title: e.target.value,
                  slug: '' // Reset slug to regenerate
                })}
                className="w-full text-3xl md:text-4xl font-bold border-none focus:outline-none placeholder-gray-300 bg-transparent"
              />
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                💡 <span className="font-medium">Tip:</span> Make it catchy and engaging
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span>
                Excerpt
                <span className="ml-auto text-xs font-normal text-gray-500">Appears in preview cards</span>
              </label>
              <textarea
                placeholder="Write a compelling summary that makes readers want to click..."
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-uk-blue focus:outline-none resize-none transition-colors"
              />
              <div className="mt-2 text-xs text-gray-500">
                {formData.excerpt?.length || 0} characters • Recommended: 120-160
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">✍️</span>
                Article Content
                <span className="ml-auto text-xs font-normal text-gray-500">
                  {calculateReadTime(formData.content)} min read
                </span>
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-900 font-medium mb-2">📝 Editor Tips:</p>
                <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                  <li>Use <strong>bullet points</strong> and <strong>numbered lists</strong> for clarity</li>
                  <li>Break up text with <strong>headings</strong> (H1, H2)</li>
                  <li>Add <strong>images</strong> to make content more engaging</li>
                  <li><strong>Bold</strong> key points and <em>italicize</em> for emphasis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">🖼️</span>
                Featured Image
              </h3>
              
              {formData.thumbnail_url ? (
                <div className="relative group">
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Thumbnail" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">
                      Image uploaded • Displays in article cards
                    </p>
                  </div>
                </div>
              ) : (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-uk-blue transition-colors">
                    {uploadingThumbnail ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-uk-blue border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <Crop className="mx-auto mb-2 text-gray-400" size={32} />
                        <p className="text-sm text-gray-600 font-semibold">
                          Click to upload & crop thumbnail
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                        <p className="text-xs text-uk-blue mt-2 font-semibold">
                          ✨ Crop & adjust before uploading
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    disabled={uploadingThumbnail}
                  />
                </label>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                Article Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    📁 Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-uk-blue focus:outline-none transition-colors font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    ✏️ Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author_name || ''}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Kentucky Sports Chronicle"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-uk-blue focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-300 transition-colors cursor-pointer group">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 text-uk-blue focus:ring-uk-blue rounded cursor-pointer"
                  />
                  <label htmlFor="featured" className="flex items-center gap-2 font-bold text-gray-900 cursor-pointer flex-1">
                    <Star size={18} className={`${formData.is_featured ? 'text-yellow-600 fill-current' : 'text-yellow-600'} group-hover:scale-110 transition-transform`} />
                    <span>Feature this article</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    🔗 URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-uk-blue focus:outline-none text-sm font-mono transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span>💡</span> Leave empty to auto-generate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleEditor
