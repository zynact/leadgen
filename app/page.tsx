import {ImageUpload} from '@/components/image-upload'
import {Button} from "@/components/custom/Button";
import {ThemeToggle} from "@/components/theme-toggle";

export default function Page() {
    return (
        <div className="dark:bg-gray-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-gray-800 border-b-[1px]">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Snap Extract</h1>
                        <div className="flex items-center space-x-4">
                            {/*<ThemeToggle />*/}
                            <Button variant="ghost" className="text-gray-600 dark:text-gray-300">Sign in</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign up</Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Your Image</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Drag and drop or click to select a file from your device.</p>
                        </div>
                        <ImageUpload/>
                        <div className="mt-10 flex justify-end">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                                Extract Now
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
