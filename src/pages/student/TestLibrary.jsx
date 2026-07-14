import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, Clock, FileText } from 'lucide-react';
import { getTestsByCategory, getAllTests } from '../../services/db';
import Button from '../../components/Button';
import Card from '../../components/Card';

const TestLibrary = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        let fetchedTests = [];
        if (category) {
          fetchedTests = await getTestsByCategory(category);
        } else {
          fetchedTests = await getAllTests();
        }
        
        
        setTests(fetchedTests);
      } catch (error) {
        console.error("Failed to fetch tests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [category]);

  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-zinc-950 tracking-tight">
          {category ? `${category} Tests` : 'All Tests'}
        </h1>
      </div>

      <div className="mb-10 max-w-2xl relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search tests by name"
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-white focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100 outline-none transition-all shadow-sm text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button className="absolute right-1.5 top-1.5 bottom-1.5 py-1.5 px-5">
          Search
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTests.map((test) => {
            const questionsCount = test.questions ? (typeof test.questions === 'string' ? JSON.parse(test.questions).length : test.questions.length) : (test.questionsCount || 0);
            return (
              <Card key={test.id} className="flex flex-col p-0 overflow-hidden group">
                <div className="h-48 overflow-hidden relative bg-zinc-50 flex items-center justify-center p-4 border-b border-zinc-100">
                  <img 
                    src={test.thumbnail || 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80'} 
                    alt={test.title} 
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-base text-zinc-950 mb-3 line-clamp-2">{test.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-5 font-medium mt-auto">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-zinc-400" />
                      <span>{questionsCount} Qs</span>
                    </div>
                  </div>
                  <Button onClick={() => navigate(`/test/${test.id}`)} className="w-full py-2.5">
                    Start Test
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
          <p className="text-zinc-500 text-base">No tests found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default TestLibrary;
