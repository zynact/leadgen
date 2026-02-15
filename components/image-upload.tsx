'use client'

import React, { useState, useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'

interface ImageFile {
  file: File
  preview: string
}

export function ImageUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [images, setImages] = useState<ImageFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only image files (JPEG, PNG, GIF, WebP) are allowed'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB'
    }
    return null
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    setIsLoading(true)

    try {
      const newImages: ImageFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const validationError = validateFile(file)

        if (validationError) {
          setError(validationError)
          continue
        }

        const preview = URL.createObjectURL(file)
        newImages.push({ file, preview })
      }

      setImages((prev) => [...prev, ...newImages])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative p-12 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <ImagePlus
            size={56}
            className={`transition-colors duration-200 ${
              isDragging ? 'text-indigo-500' : 'text-indigo-400'
            }`}
          />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Drop your image here or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-1">Max file size 10MB</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((item, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square animate-in fade-in duration-300"
              >
                <img
                  src={item.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terms of Use */}
      {/*<p className="text-center text-xs text-gray-500 mt-6">*/}
      {/*  By proceeding, you agree to our{' '}*/}
      {/*  <a href="#" className="text-indigo-500 hover:text-indigo-600 underline">*/}
      {/*    Terms of Use*/}
      {/*  </a>*/}
      {/*</p>*/}
    </div>
  )
}
