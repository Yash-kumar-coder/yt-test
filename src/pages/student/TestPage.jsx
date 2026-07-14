import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, PlayCircle } from 'lucide-react';
import { getTestById } from '../../services/db';
import Button from '../../components/Button';
import Card from '../../components/Card';

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadTest = async () => {
      setLoading(true);
      try {
        let testData = await getTestById(id);
        
        // Mock data fallback
        if (!testData) {
          testData = {
            id,
            title: 'Mock Test: Complete Physics',
            duration: 30,
            questions: JSON.stringify([
              { question: 'What is the SI unit of force?', options: ['Newton', 'Joule', 'Watt', 'Pascal'], answer: 0 },
              { question: 'Which law states that for every action, there is an equal and opposite reaction?', options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"], answer: 2 },
              { question: 'What is the speed of light?', options: ['3 x 10^8 m/s', '3 x 10^5 m/s', '3 x 10^6 m/s', '3 x 10^9 m/s'], answer: 0 },
            ])
          };
        }
        
        setTest(testData);
        const parsedQs = typeof testData.questions === 'string' ? JSON.parse(testData.questions) : testData.questions;
        setQuestions(parsedQs || []);
        setTimeElapsed(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [id]);

  useEffect(() => {
    if (loading) return;
    const timerId = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [loading]);

  const handleSelectOption = (optIdx) => {
    setAnswers({ ...answers, [currentIdx]: optIdx });
  };

  const handleSubmit = () => {
    // Navigate to result and pass answers in state
    navigate(`/result/${id}`, { state: { test, questions, answers, timeTaken: timeElapsed } });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );

  if (!test || questions.length === 0) return <div>Test not found</div>;



  const currentQ = questions[currentIdx];
  const progressPercent = ((currentIdx + 1) / questions.length) * 100;
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">{test.title}</h1>
          <p className="text-zinc-500 font-medium mt-1">Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {test.videoLink && (
            <a 
              href={test.videoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-full font-semibold shadow-sm ring-1 ring-inset ring-red-200/50 transition-colors"
            >
              <PlayCircle size={18} />
              <span className="text-sm">Watch Video</span>
            </a>
          )}
          <div className="flex items-center gap-2 bg-zinc-100 text-zinc-950 px-5 py-2.5 rounded-full font-semibold shadow-sm ring-1 ring-inset ring-zinc-200/50">
            <Clock size={18} />
            <span className="text-base font-mono tracking-wide">{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 h-1.5 rounded-full mb-10 overflow-hidden">
        <div 
          className="bg-zinc-900 h-1.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="mb-8 p-6 md:p-10">
        <h2 className="text-xl md:text-xl text-zinc-950 font-semibold mb-6 md:mb-8 leading-relaxed tracking-tight">
          {currentIdx + 1}. {currentQ.question}
        </h2>
        
        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentIdx] === idx;
            return (
              <div 
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`
                  p-4 md:p-5 rounded-xl border cursor-pointer transition-all duration-200 text-base
                  ${isSelected 
                    ? 'border-zinc-950 bg-zinc-50 shadow-sm text-zinc-950 font-medium' 
                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50 text-zinc-700'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors
                    ${isSelected ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}
                  `}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  {opt}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 mt-12 bg-white p-6 rounded-2xl shadow-sm ring-1 ring-zinc-200/50">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className={currentIdx === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIdx === questions.length - 1}
            className={currentIdx === questions.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Next
            <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
        
        {/* Navigator Dots */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isCurrent = i === currentIdx;
            let dotClass = "w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center cursor-pointer transition-all duration-200";
            
            if (isCurrent) dotClass += " bg-zinc-950 text-white shadow-sm ring-2 ring-zinc-950/20 ring-offset-1";
            else if (isAnswered) dotClass += " bg-zinc-200 text-zinc-900 hover:bg-zinc-300";
            else dotClass += " bg-zinc-50 text-zinc-400 hover:bg-zinc-200 border border-zinc-200";

            return (
              <div key={i} onClick={() => setCurrentIdx(i)} className={dotClass}>
                {i + 1}
              </div>
            );
          })}
        </div>

        <Button onClick={() => setShowConfirm(true)} variant="primary" className="px-8">
          Submit Test
        </Button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fade-in scale-100 ring-1 ring-zinc-200/50">
            <div className="flex items-center gap-3 text-zinc-950 mb-4">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-950 rounded-full flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Submit Test?</h3>
            </div>
            <p className="text-zinc-500 mb-8 font-medium">
              You have answered {Object.keys(answers).length} out of {questions.length} questions.
              Are you sure you want to submit?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
