import {create} from "zustand/react";
import {ImageFile} from "@/components/image-upload";

type ImageState = {
    images: ImageFile[]
    addImages: (files: ImageFile[]) => void
    removeImage: (index: number) => void
    clearImages: () => void
}

export const useImageStore = create<ImageState>((set) => ({
    images: [],
    addImages: (files: ImageFile[]) => {
        set((state) => ({
            images: [...state.images, ...files],
        }))
    },
    removeImage: (index: number) => {
        set((state) => ({
            images: state.images.filter((_, i) => i !== index),
        }))
    },
    clearImages: () => {
        set({images: []})
    },
}))
