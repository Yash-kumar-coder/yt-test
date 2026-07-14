import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import { getAllTests, deleteTest } from '../../services/db';
import Card from '../../components/Card';

const AllTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const data = await getAllTests();
        setTests(data);
      } catch (error) {
        console.error("Failed to fetch tests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleDelete = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      const res = await deleteTest(testId);
      if (res.success) {
        setTests(prev => prev.filter(t => t.id !== testId));
      } else {
        alert("Failed to delete test.");
      }
    }
  };

  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    test.exam.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-950 tracking-tight">All Tests</h1>
          <p className="text-zinc-500 mt-2">Manage your published tests.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 outline-none transition-all"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Test</th>
                <th className="px-6 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider">Questions</th>
                <th className="px-6 py-4 font-semibold text-zinc-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-950"></div>
                    </div>
                    Loading tests...
                  </td>
                </tr>
              ) : filteredTests.length > 0 ? (
                filteredTests.map((test) => {
                  const qCount = test.questions ? (typeof test.questions === 'string' ? JSON.parse(test.questions).length : test.questions.length) : 0;
                  return (
                    <tr key={test.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={test.thumbnail || 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=100&q=80'} 
                            alt="" 
                            className="w-16 h-12 rounded-lg object-contain bg-zinc-50 p-1 border border-zinc-100"
                          />
                          <div>
                            <p className="font-semibold text-zinc-950 text-sm">{test.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-100 text-zinc-700 font-medium px-3 py-1 rounded-full text-xs">
                          {test.exam}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-600 text-sm">{qCount}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDelete(test.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Test"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No tests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AllTests;
