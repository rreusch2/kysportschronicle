import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.log('Please create a .env.local file with your Supabase credentials.')
  console.log('See SUPABASE_SETUP.md for instructions.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Helper function to upload images
export const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from('article-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('article-images')
    .getPublicUrl(filePath)

  return publicUrl
}

// Helper function to delete images
export const deleteImage = async (imageUrl) => {
  // Extract file path from URL
  const urlParts = imageUrl.split('/article-images/')
  if (urlParts.length < 2) return

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('article-images')
    .remove([filePath])

  if (error) {
    console.error('Error deleting image:', error)
  }
}

// Helper to generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper to calculate read time
export const calculateReadTime = (content) => {
  const wordsPerMinute = 200
  const text = content.replace(/<[^>]*>/g, '') // Strip HTML
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
