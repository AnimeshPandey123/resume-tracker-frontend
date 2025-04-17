import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "@/styles/resumes.css";

interface Resume {
  user_id: number;
  title: string;
  summary: string;
}

function ResumeUpdate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setResume((prev) => prev ? {
      ...prev,
      [field]: value
    } : null);
    
    // Clear success message when editing
    if (saveSuccess) setSaveSuccess(false);
  };

  const resumeFetch = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = `${API_URL}/api/resumes/${id}?user_id=1`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resume: ${response.statusText}`);
      }
      
      const data: Resume = await response.json();
      setResume(data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      setError('Unable to load resume. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      const url = `${API_URL}/api/resumes/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resume),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update resume: ${response.statusText}`);
      }
      
      setSaveSuccess(true);
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error updating resume:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (id) {
      resumeFetch(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => resumeFetch(id || '')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Resume not found</p>
        </div>
        <button 
          onClick={() => navigate('/resumes')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Resumes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Resume updated successfully!</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Resume</h1>
        <button 
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Resume Title</label>
          <input
            id="title"
            type="text"
            value={resume.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter a title for your resume"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
          <textarea
            id="summary"
            value={resume.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition h-40"
            placeholder="Write a summary highlighting your qualifications, experience, and career goals..."
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            A good summary is concise, highlights your strengths, and captures what makes you unique.
          </p>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
               
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResumeUpdate;