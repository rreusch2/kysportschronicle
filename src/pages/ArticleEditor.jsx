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
    <div className="min-h-screen bg-gray-50">
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isNew ? 'New Article' : 'Edit Article'}
                </h1>
                <p className="text-sm text-gray-600">
                  {formData.is_published ? 'Published' : 'Draft'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {showSuccess && (
                <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Saved!</span>
                </div>
              )}
              
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 gradient-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Eye size={18} />
                {formData.is_published ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Article Title"
                value={formData.title}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  title: e.target.value,
                  slug: '' // Reset slug to regenerate
                })}
                className="w-full text-4xl font-bold border-none focus:outline-none placeholder-gray-300"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt (appears in article cards)
              </label>
              <textarea
                placeholder="Brief summary of the article..."
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Content
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Image</h3>
              
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author_name || ''}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Kentucky Sports Chronicle"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 text-uk-blue focus:ring-uk-blue rounded"
                  />
                  <label htmlFor="featured" className="flex items-center gap-2 font-semibold text-gray-900 cursor-pointer">
                    <Star size={18} className="text-yellow-600" />
                    Feature this article
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-uk-blue focus:outline-none text-sm font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to auto-generate
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
