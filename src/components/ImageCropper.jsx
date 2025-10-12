import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, ZoomIn, ZoomOut, Maximize, Check, RotateCw } from 'lucide-react'

const ImageCropper = ({ image, onComplete, onCancel, aspectRatios = true }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [selectedAspect, setSelectedAspect] = useState(16 / 9)

  const aspectOptions = [
    { label: '16:9', value: 16 / 9, desc: 'Widescreen' },
    { label: '4:3', value: 4 / 3, desc: 'Standard' },
    { label: '1:1', value: 1, desc: 'Square' },
    { label: '3:4', value: 3 / 4, desc: 'Portrait' },
    { label: 'Free', value: null, desc: 'Any size' },
  ]

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      )
      onComplete(croppedImage)
    } catch (e) {
      console.error('Error cropping image:', e)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Crop & Adjust Image</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Cropper Area */}
      <div className="flex-1 relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={selectedAspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-700 p-6 space-y-6">
        {/* Aspect Ratio Selection */}
        {aspectRatios && (
          <div>
            <label className="text-white text-sm font-semibold mb-3 block">
              Aspect Ratio
            </label>
            <div className="flex gap-2 flex-wrap">
              {aspectOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedAspect(option.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedAspect === option.value
                      ? 'bg-uk-blue text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm">{option.label}</div>
                  <div className="text-xs opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zoom Control */}
        <div>
          <label className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <ZoomIn size={16} />
            Zoom
          </label>
          <div className="flex items-center gap-4">
            <ZoomOut size={20} className="text-gray-400" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <ZoomIn size={20} className="text-gray-400" />
            <span className="text-white text-sm font-mono w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>

        {/* Rotation Control */}
        <div>
          <label className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <RotateCw size={16} />
            Rotation
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-white text-sm font-mono w-12 text-right">
              {rotation}°
            </span>
            <button
              onClick={() => setRotation(0)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createCroppedImage}
            className="px-6 py-3 gradient-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Check size={20} />
            Apply & Upload
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to crop the image
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  ctx.drawImage(image, 0, 0)

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0)

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file)
      } else {
        reject(new Error('Canvas is empty'))
      }
    }, 'image/jpeg', 0.95)
  })
}

export default ImageCropper
