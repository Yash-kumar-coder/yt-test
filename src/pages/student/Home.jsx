import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Stethoscope, Landmark, Globe, Train, Map } from 'lucide-react';
import { getExams, getAllTests } from '../../services/db';
import Card from '../../components/Card';

const iconMap = {
  BookOpen: BookOpen,
  Stethoscope: Stethoscope,
  Landmark: Landmark,
  Globe: Globe,
  Train: Train,
  Map: Map,
};

const Home = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testsCount, setTestsCount] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const examsData = await getExams();
        setExams(examsData);
        
        // Fetch tests to calculate count
        const allTests = await getAllTests();
        const counts = {};
        allTests.forEach(test => {
          counts[test.exam] = (counts[test.exam] || 0) + 1;
        });
        setTestsCount(counts);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/tests?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mt-20 mb-24 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-950 tracking-tighter mb-6 text-balance leading-[1.1]">
          Master Your Exams with <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-400">Mock Tests</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-500 font-normal leading-relaxed text-balance max-w-2xl mx-auto">
          Attempt high-quality MCQ tests created from educational YouTube videos. No login required.
        </p>
      </div>

      {/* Categories Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-zinc-950 mb-8 text-center tracking-tight">Choose Your Exam</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const IconComponent = iconMap[exam.icon] || BookOpen;
              const count = testsCount[exam.name] || 0;
              
              return (
                <Card 
                  key={exam.id} 
                  hoverable 
                  onClick={() => handleCategoryClick(exam.name)}
                  className="flex flex-col items-center text-center p-8 group"
                >
                  <div className="w-24 h-24 rounded-xl bg-white flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 p-4 shadow-sm ring-1 ring-zinc-200/50">
                    {exam.icon && (exam.icon.includes('/') || exam.icon.includes('.')) ? (
                      <img src={exam.icon} alt={exam.name} loading="lazy" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <IconComponent className="text-[#6D4AFF] group-hover:text-[#5a3ae0] w-10 h-10 transition-colors" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">{exam.name}</h3>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
