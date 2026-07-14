import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { getExams, createTest } from '../../services/db';

const CreateTest = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    exam: '',
    videoLink: '',
    thumbnail: '',
    questionsJson: '{\n  "title": "Example Test",\n  "questions": [\n    {\n      "question": "Sample Question",\n      "options": [\n        "A",\n        "B",\n        "C",\n        "D"\n      ],\n      "answer": 0\n    }\n  ]\n}'
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      const data = await getExams();
      setExams(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, exam: data[0].name }));
      }
    };
    fetchExams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration missing in .env");
      return;
    }

    setUploadingImage(true);
    setError(null);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );
      const data = await response.json();
      
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, thumbnail: data.secure_url }));
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      setError("Failed to upload image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePreview = () => {
    setError(null);
    try {
      const parsed = JSON.parse(formData.questionsJson);
      const parsedQuestions = parsed.questions || parsed;
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error("Questions must be an array and cannot be empty.");
      }
      for (const q of parsedQuestions) {
        if (!q.question || !Array.isArray(q.options) || typeof q.answer !== 'number') {
          throw new Error("Each question must have 'question', 'options' (array), and 'answer' (index).");
        }
      }
      setPreviewData(parsedQuestions);
    } catch (err) {
      setError(`Invalid JSON format: ${err.message}`);
    }
  };

  const handlePublish = async () => {
    setError(null);
    setSuccess(false);
    
    // Validate JSON
    let parsedQuestions;
    try {
      const parsed = JSON.parse(formData.questionsJson);
      parsedQuestions = parsed.questions || parsed; // Handle array or object wrapper
      
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error("Questions must be an array and cannot be empty.");
      }
      
      // Basic validation of question structure
      for (const q of parsedQuestions) {
        if (!q.question || !Array.isArray(q.options) || typeof q.answer !== 'number') {
          throw new Error("Each question must have 'question', 'options' (array), and 'answer' (index).");
        }
      }
    } catch (err) {
      setError(`Invalid JSON format: ${err.message}`);
      return;
    }

    if (!formData.title || !formData.exam) {
      setError("Title and Exam Category are required.");
      return;
    }

    setLoading(true);
    
    const testData = {
      title: formData.title,
      exam: formData.exam,
      videoLink: formData.videoLink,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      questions: parsedQuestions, // Store as parsed object or string based on preference. DB service handles it.
    };

    const res = await createTest(testData);
    
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/tests');
      }, 2000);
    } else {
      setError("Failed to publish test. Ensure Firebase is configured.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-950 tracking-tight">Create New Test</h1>
        <p className="text-zinc-500 mt-2">Publish a new MCQ test directly to the student platform.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 font-medium">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-center gap-3 mb-8 font-medium">
          <CheckCircle2 size={20} />
          Test published successfully! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Test Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete Physics"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Video Link (Optional)</label>
                <input 
                  type="url" 
                  name="videoLink"
                  value={formData.videoLink}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Exam Category</label>
                <select 
                  name="exam"
                  value={formData.exam}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 outline-none transition-all bg-white"
                >
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.name}>{exam.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">Thumbnail Image</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-950 hover:file:bg-zinc-200 transition-all cursor-pointer"
                  />
                  {uploadingImage && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-950"></div>
                  )}
                </div>
                {formData.thumbnail && (
                  <div className="mt-4 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-32 object-cover" />
                    <button 
                      onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                      className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-lg shadow-sm hover:bg-red-50"
                    >
                      <AlertCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: JSON Editor */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-zinc-700">Questions JSON</label>
              <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">Format Validation Required</span>
            </div>
            <textarea 
              name="questionsJson"
              value={formData.questionsJson}
              onChange={handleChange}
              className="flex-1 w-full p-4 rounded-xl border border-zinc-200 font-mono text-sm bg-zinc-50/50 focus:bg-white focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 outline-none transition-all min-h-[400px]"
              spellCheck="false"
            />
            
            <div className="mt-6 flex gap-4 justify-end">
              <Button variant="outline" onClick={handlePreview} className="px-6 py-3">
                Preview
              </Button>
              <Button 
                variant="primary" 
                onClick={handlePublish}
                disabled={loading}
                className="px-8 py-3"
              >
                {loading ? 'Publishing...' : 'Publish Test'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-zinc-200/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Test Preview</h2>
              <Button variant="outline" onClick={() => setPreviewData(null)} className="px-4 py-2 text-sm">Close</Button>
            </div>
            <div className="space-y-6">
              {previewData.map((q, i) => (
                <div key={i} className="p-4 border border-zinc-200 rounded-xl">
                  <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className={`p-2.5 rounded-lg border ${q.answer === optIdx ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium' : 'bg-zinc-50 border-zinc-100'}`}>
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTest;
