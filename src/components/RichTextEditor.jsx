import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo, 
  Heading1, Heading2, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react'
import { uploadImage } from '../lib/supabase'
import { useState, useEffect } from 'react'
import ImageCropper from './ImageCropper'

const MenuBar = ({ editor, onImageUpload }) => {
  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bold') ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('italic') ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('blockquote') ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Quote"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <button
        onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('link') ? 'bg-uk-blue text-white hover:bg-uk-blue-light' : ''
        }`}
        type="button"
        title="Add Link"
      >
        <LinkIcon size={18} />
      </button>

      <button
        onClick={onImageUpload}
        className="p-2 rounded hover:bg-gray-200 transition-colors"
        type="button"
        title="Insert Image"
      >
        <ImageIcon size={18} />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
        type="button"
        title="Undo"
      >
        <Undo size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
        type="button"
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  )
}

const RichTextEditor = ({ content, onChange }) => {
  const [uploading, setUploading] = useState(false)
  const [cropperImage, setCropperImage] = useState(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-uk-blue underline hover:text-uk-blue-light',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-4',
      },
    },
  })

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      // Read file and show cropper
      const reader = new FileReader()
      reader.onload = () => {
        setCropperImage(reader.result)
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }

  const handleCropComplete = async (croppedBlob) => {
    setCropperImage(null)
    setUploading(true)
    
    try {
      const file = new File([croppedBlob], 'content-image.jpg', { type: 'image/jpeg' })
      const url = await uploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCropCancel = () => {
    setCropperImage(null)
  }

  return (
    <>
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatios={true}
        />
      )}
      
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <MenuBar editor={editor} onImageUpload={handleImageUpload} />
        {uploading && (
          <div className="bg-blue-50 border-b border-blue-200 p-2 text-sm text-blue-800 text-center">
            Uploading image...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </>
  )
}

export default RichTextEditor
