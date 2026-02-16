'use client'

import React, { useState, useRef, useImperativeHandle } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import {useImageStore} from "@/store/useImageStore";
import {images} from "next/dist/build/webpack/config/blocks/images";

export interface ImageFile {
    file: File
    preview: string
}

export interface ImageUploadRef {
    addFiles: (files: FileList) => void;
}

export const ImageUpload = React.forwardRef<ImageUploadRef, {}>((props, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    // const [images, setImages] = useState<ImageFile[]>([])
    const images = useImageStore((state) => state.images)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const addImagesToStore = useImageStore((state) => state.addImages)
    const removeImageFromStore = useImageStore((state) => state.removeImage)
    const clearImagesFromStore = useImageStore((state) => state.clearImages)

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

                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
                const preview = URL.createObjectURL(file)
                newImages.push({ file, preview })
            }

            // setImages((prev) => [...prev, ...newImages])
            addImagesToStore(newImages)

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
        // setImages((prev) => {
        //     const updated = [...prev]
        //     URL.revokeObjectURL(updated[index].preview)
        //     updated.splice(index, 1)
        //     return updated
        // })
        useImageStore.getState().removeImage(index)
    }

    useImperativeHandle(ref, () => ({
        addFiles: (files: FileList) => {
            handleFiles(files);
        }
    }));

    return (
        <div className="w-full">
            {/* Upload Area */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`relative group w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
                    ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500'
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

                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-3">
                        <ImagePlus
                            size={48}
                            className={`transition-colors duration-200 
                                ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500'}`
                            }
                        />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Drop your image here or <span className="text-blue-600 dark:text-blue-400">browse</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Maximum file size is 10MB</p>
                    </div>
                </div>

                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-xl">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/20 dark:border-red-700">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Image Gallery */}
            {images.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Uploaded ({images.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((item, index) => (
                            <div
                                key={item.preview}
                                className="relative group aspect-square"
                            >
                                <img
                                    src={item.preview}
                                    alt={`Preview ${index + 1}`}
                                    onLoad={() => URL.revokeObjectURL(item.preview)} // Clean up memory
                                    className="w-full h-full object-cover rounded-xl shadow-md"
                                />
                                <div
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeImage(index)
                                        }}
                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform transform-gpu hover:scale-110"
                                        aria-label="Remove image"
                                    >
                                        <X size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
})
ImageUpload.displayName = 'ImageUpload'
