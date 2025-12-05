import React, { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { ICreateToken } from '../../../lib/types/fourMeme'

interface Step1BasicDetailsProps {
  data: ICreateToken
  onDataChange: (updates: Partial<ICreateToken>) => void
  onImageChange?: (file: File | undefined) => void
  imageFile?: File
  walletConnected: boolean
}

const Step1BasicDetails: React.FC<Step1BasicDetailsProps> = ({
  data,
  onDataChange,
  onImageChange,
  imageFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: keyof ICreateToken['basicDetails'], value: string) => {
    onDataChange({
      basicDetails: {
        ...data.basicDetails,
        [field]: value
      }
    })
  }

  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    onImageChange?.(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Update data with placeholder URL
    handleInputChange('image', URL.createObjectURL(file))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const removeImage = () => {
    onImageChange?.(undefined)
    setImagePreview(null)
    handleInputChange('image', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Token Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
              Token Name *
            </label>
            <input
              type="text"
              value={data.basicDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Doge Killer"
              maxLength={50}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-bsc-500 focus:outline-none transition-all font-exo"
            />
            <p className="text-xs text-gray-500 mt-1 font-exo">
              Your meme token's full name
            </p>
          </div>

          <div>
            <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
              Symbol *
            </label>
            <input
              type="text"
              value={data.basicDetails.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
              placeholder="e.g., DOGEK"
              maxLength={10}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-bsc-500 focus:outline-none transition-all font-exo uppercase"
            />
            <p className="text-xs text-gray-500 mt-1 font-exo">
              Short symbol for your token (max 10 characters)
            </p>
          </div>

          <div>
            <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={data.basicDetails.desc}
              onChange={(e) => handleInputChange('desc', e.target.value)}
              placeholder="Tell the world about your meme token! What makes it special? What's the story behind it?"
              rows={6}
              maxLength={500}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-bsc-500 focus:outline-none transition-all resize-none font-exo"
            />
            <p className="text-xs text-gray-500 mt-1 font-exo">
              {data.basicDetails.desc.length}/500 characters
            </p>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Token Logo *
          </label>

          {imagePreview ? (
            <div className="relative">
              <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={imagePreview}
                  alt="Token preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={openFileDialog}
                className="mt-2 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-exo font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-bsc-500 bg-bsc-50'
                  : 'border-gray-300 hover:border-bsc-500 hover:bg-bsc-50'
              }`}
              onClick={openFileDialog}
              onDrop={handleDrop}
              onDragOver={handleDrag}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-bsc-100 rounded-full flex items-center justify-center mx-auto">
                  {dragActive ? (
                    <Upload className="w-8 h-8 text-bsc-600" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-bsc-600" />
                  )}
                </div>
                <div>
                  <p className="text-gray-700 font-exo font-medium">
                    {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 font-exo">
                    PNG, JPG up to 5MB • Square format recommended
                  </p>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {/* FourMeme Info */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-exo font-medium text-purple-900 mb-2">🎯 Four.Meme Integration</h4>
            <div className="space-y-1 text-sm text-purple-700 font-exo">
              <p>• Token will be listed on Four.Meme DEX</p>
              <p>• Fixed tokenomics: 1B supply, 24 BNB pool</p>
              <p>• 0.25% trading fees, BNB base pair</p>
              <p>• Immediate trading after launch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      {data.basicDetails.name && data.basicDetails.symbol && data.basicDetails.desc && imageFile && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg font-exo text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          All required information provided. Ready to continue!
        </div>
      )}
    </div>
  )
}

export default Step1BasicDetails