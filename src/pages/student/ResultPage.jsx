import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Trophy, Home, Clock } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { submitTestAttempt } from '../../services/db';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { test, questions, answers, timeTaken } = location.state || {};

  useEffect(() => {
    if (!test || !questions) {
      navigate('/');
      return;
    }
    
    // Auto submit attempt to db (mock student name since no login)
    const score = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.answer ? 1 : 0);
    }, 0);
    
    const percentage = Math.round((score / questions.length) * 100);
    
    submitTestAttempt({
      testId: id,
      studentName: 'Anonymous Student',
      score,
      percentage,
      timeTaken: timeTaken || 0,
    });
  }, [test, questions, answers, id, navigate]);

  if (!test || !questions) return null;

  const totalQuestions = questions.length;
  const correctAnswers = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.answer ? 1 : 0), 0);
  const wrongAnswers = totalQuestions - correctAnswers;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-zinc-950 mb-4 tracking-tighter">Test Results</h1>
        <p className="text-xl text-zinc-500 font-medium tracking-tight">{test.title}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12 justify-center">
        {/* Score Circle Card */}
        <Card className="flex flex-col items-center justify-center p-10 flex-1 max-w-sm mx-auto">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={percentage >= 50 ? "#09090b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={`${percentage * 2.827} 282.7`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-zinc-950 tracking-tighter">{percentage}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xl font-bold text-zinc-950 tracking-tight">
            <Trophy className={percentage >= 50 ? "text-zinc-950" : "text-zinc-400"} size={28} />
            {percentage >= 50 ? 'Great Job!' : 'Keep Practicing'}
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="flex flex-col justify-center p-10 flex-1 max-w-sm mx-auto gap-6">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <CheckCircle2 className="text-emerald-600" size={24} />
              </div>
              <span className="font-bold text-gray-700 text-lg">Correct</span>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{correctAnswers}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-xl">
                <XCircle className="text-red-500" size={24} />
              </div>
              <span className="font-bold text-gray-700 text-lg">Wrong/Skipped</span>
            </div>
            <span className="text-2xl font-bold text-red-500">{wrongAnswers}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm ring-1 ring-zinc-200">
                <Clock className="text-zinc-900" size={20} />
              </div>
              <span className="font-semibold text-zinc-700 text-base">Time Taken</span>
            </div>
            <span className="text-xl font-bold text-zinc-950 font-mono">{formatTime(timeTaken || 0)}</span>
          </div>
        </Card>
      </div>

      <div className="flex justify-center gap-6 mb-16">
        <Button onClick={() => window.scrollTo({ top: document.getElementById('review').offsetTop, behavior: 'smooth' })} variant="primary" className="px-8 py-3">
          Review Answers
        </Button>
        <Button onClick={() => navigate('/')} variant="outline" className="px-8 py-3">
          <Home size={18} className="mr-2" />
          Back to Home
        </Button>
      </div>

      <div id="review" className="scroll-mt-10">
        <h2 className="text-2xl font-bold text-zinc-950 mb-8 border-b border-zinc-200 pb-4 tracking-tight">Detailed Review</h2>
        <div className="space-y-8">
          {questions.map((q, idx) => {
            const studentAns = answers[idx];
            const correctAns = q.answer;
            const isSkipped = studentAns === undefined;
            const isCorrect = studentAns === correctAns;

            return (
              <Card key={idx} className="p-8">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                  <h3 className="text-lg font-semibold text-zinc-900 leading-relaxed tracking-tight flex-1">
                    <span className="text-zinc-400 mr-2">{idx + 1}.</span>
                    {q.question}
                  </h3>
                  {isCorrect ? (
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full font-bold flex items-center gap-2 shrink-0 self-start">
                      <CheckCircle2 size={18} /> Correct
                    </div>
                  ) : (
                    <div className="bg-red-50 text-red-500 px-4 py-2 rounded-full font-bold flex items-center gap-2 shrink-0 self-start">
                      <XCircle size={18} /> {isSkipped ? 'Skipped' : 'Wrong'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, optIdx) => {
                    let optStyle = "border-gray-100 bg-gray-50 text-gray-500";
                    let Icon = null;

                    if (optIdx === correctAns) {
                      optStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200";
                      Icon = CheckCircle2;
                    } else if (optIdx === studentAns && !isCorrect) {
                      optStyle = "border-red-500 bg-red-50 text-red-800 ring-2 ring-red-200";
                      Icon = XCircle;
                    }

                    return (
                      <div key={optIdx} className={`p-4 rounded-xl border flex items-center justify-between ${optStyle}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm bg-white shadow-sm ring-1 ring-inset ring-zinc-200
                            ${optIdx === correctAns ? 'text-emerald-600' : optIdx === studentAns ? 'text-red-500' : 'text-zinc-400'}
                          `}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="font-medium text-base">{opt}</span>
                        </div>
                        {Icon && <Icon size={20} className={optIdx === correctAns ? "text-emerald-500" : "text-red-500"} />}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
