import SnippetUploader from '@/components/SnippetUploader.tsx';
import SnippetGallery from '@/components/SnippetGallery.tsx';

function SnippetsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">
          My Snippets
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Upload and explore your wellness journal snippets. Capture your
          thoughts, feelings, and experiences.
        </p>

        <SnippetUploader />

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Your Snippet Collection
          </h2>
          <SnippetGallery />
        </div>
      </div>
    </div>
  );
}

export default SnippetsPage;
