'use client'

import {useRef, useEffect} from "react";
import {ImageUpload, ImageUploadRef} from '@/components/image-upload'
import {Button} from "@/components/custom/Button";
import imageProcess from "@/lib/api/image-process";
import {useImageStore} from "@/store/useImageStore";

export default function Page() {
    const imageUploadRef = useRef<ImageUploadRef>(null);

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (items) {
                const files = [];
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        const file = items[i].getAsFile();
                        if (file) {
                            files.push(file);
                        }
                    }
                }
                if (files.length > 0) {
                    const dataTransfer = new DataTransfer();
                    files.forEach(file => dataTransfer.items.add(file));
                    imageUploadRef.current?.addFiles(dataTransfer.files);
                }
            }
        };

        window.addEventListener('paste', handlePaste);

        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <div className="dark:bg-gray-900">
            {/* Header */}
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-gray-800 border-b-[1px]">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LeadGen</h1>
                        {/*<div className="flex items-center space-x-4">*/}
                        {/*    /!*<ThemeToggle />*!/*/}
                        {/*    <Button variant="ghost" className="text-gray-600 dark:text-gray-300">Sign in</Button>*/}
                        {/*    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign up</Button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Your Image</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Drag and drop, paste, or click to
                                select a file from your device.</p>
                        </div>
                        <ImageUpload ref={imageUploadRef}/>
                        <div className="mt-10 flex justify-end">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                                    onClick={async () => {
                                        const imageFiles = useImageStore.getState().images;
                                        if (imageFiles && imageFiles.length > 0) {
                                            try {
                                                imageUploadRef.current?.setLoading(true);
                                                const files = imageFiles.map(f => f.file);
                                                const response = await imageProcess(files);
                                                response.forEach(res => {
                                                    if(res.success) {
                                                        console.log('Markdown content:', res.extractedText);
                                                    } else {
                                                        console.error('Error processing image:', res.error);
                                                    }
                                                });
                                            } catch (error) {
                                                console.log('Error processing image:', error);
                                            }
                                            finally {
                                                imageUploadRef.current?.setLoading(false);
                                                useImageStore.getState().clearImages();
                                            }
                                        } else {
                                            console.log('Please upload an image before extracting.');
                                        }
                                    }}>
                                Extract Now
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
