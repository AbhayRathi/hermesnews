
import React, { useState } from 'react';
import type { NewArticleData } from '../types';

interface UploadFormProps {
  onUpload: (articleData: NewArticleData) => Promise<void>;
  isLoading: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload, isLoading }) => {
  const [formData, setFormData] = useState<NewArticleData>({
    title: '',
    publisher: '',
    author: '',
    category: '',
    article: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Cast value to string to resolve TypeScript error. All values in formData are strings.
    if (Object.values(formData).some(value => (value as string).trim() === '')) {
      alert('Please fill out all fields.');
      return;
    }
    await onUpload(formData);
    setFormData({ title: '', publisher: '', author: '', category: '', article: '' });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-brand-blue pb-2">Publish New Content</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Article Title"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            required
          />
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Publisher Name"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            required
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author Name"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            required
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category (e.g., Technology)"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            required
          />
        </div>
        <textarea
          name="article"
          value={formData.article}
          onChange={handleChange}
          placeholder="Full article content..."
          rows={8}
          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-brand-blue text-white font-bold rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Upload & Generate Summary'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
