import { ImageUpload } from '@/components/image-upload'
import {Button} from "@/components/custom/Button";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f5f5fa]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto px-6 py-6 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Snap Extract</h1>
          <p className="text-red-500 mt-2 text-bold">
            Sign up
          </p>
        </div>
      </header>

      {/* Main Content */}
        <section className="max-w-2xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Paste your image below</h2>
            <ImageUpload/>
            <div className="mt-8 flex justify-center">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg shadow-md">
                    Submit
                </Button>
            </div>
        </section>
    </main>
  )
}
