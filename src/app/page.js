"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Brain, BookOpen, Target, ArrowRight, Loader2, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { QuizView } from '@/components/QuizView';
import { Analytics } from '@vercel/analytics/next';

const AllQuestionsView = ({ questions, categories, onExit }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const questionsByCategory = categories.map(category => ({
    ...category,
    questions: questions.filter(q => q.category === category.id)
  }));

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Questions</h1>
          <button
            onClick={onExit}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Back to Quiz
          </button>
        </div>

        <div className="space-y-4">
          {questionsByCategory.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full"
              >
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-gray-500" />
                      <div className="text-left">
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          {category.questions.length} questions
                        </CardDescription>
                      </div>
                    </div>
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
              </button>
              
              {expandedCategories.has(category.id) && (
                <CardContent className="bg-gray-50">
                  <div className="space-y-4 py-4">
                    {category.questions.map((question, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="font-medium mb-2">{question.question}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                          {question.options.map((option, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg ${
                                option === question.correct_answer
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [questionCount, setQuestionCount] = useState([25]);
  const [quizMode, setQuizMode] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [viewingAllQuestions, setViewingAllQuestions] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/entrepreneurship-questions.json');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setAvailableQuestions(data.questions);
        setCategories(data.categories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (quizMode !== 'category') {
      setSelectedCategories(new Set());
    }
  }, [quizMode]);

  const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleStart = () => {
    const count = questionCount[0];
    let selectedQs;

    if (quizMode === 'all') {
      selectedQs = getRandomQuestions(availableQuestions, count);
    } else {
      const filteredQuestions = availableQuestions.filter(q => 
        selectedCategories.has(q.category)
      );
      selectedQs = getRandomQuestions(filteredQuestions, Math.min(count, filteredQuestions.length));
    }

    setSelectedQuestions(selectedQs);
    setQuizStarted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (viewingAllQuestions) {
    return (
      <AllQuestionsView 
        questions={availableQuestions}
        categories={categories}
        onExit={() => setViewingAllQuestions(false)}
      />
    );
  }

  if (quizStarted && selectedQuestions.length > 0) {
    return (
      <QuizView 
        questions={selectedQuestions} 
        onExit={() => {
          setQuizStarted(false);
          setSelectedQuestions([]);
          setQuizMode(null);
          setSelectedCategories(new Set());
        }}
      />
    );
  }

  const maxQuestions = quizMode === 'category'
    ? availableQuestions.filter(q => selectedCategories.has(q.category)).length
    : availableQuestions.length;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-12 text-center space-y-3">
        <h1 className="text-4xl font-bold text-black">
          ECON125 Final Prep
        </h1>
        <p className="text-sm text-gray-500">
          {availableQuestions.length} questions available
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <Analytics />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`group cursor-pointer transition-all hover:shadow-lg ${
              quizMode === 'all' 
                ? 'ring-2 ring-black' 
                : 'hover:ring-1 hover:ring-gray-200'
            }`}
            onClick={() => setQuizMode('all')}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  All Questions
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${
                  quizMode === 'all' ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                } group-hover:translate-x-0 group-hover:opacity-100`} />
              </CardTitle>
              <CardDescription>
                Practice with all available questions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`group cursor-pointer transition-all hover:shadow-lg ${
              quizMode === 'category' 
                ? 'ring-2 ring-black' 
                : 'hover:ring-1 hover:ring-gray-200'
            }`}
            onClick={() => setQuizMode('category')}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  By Category
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${
                  quizMode === 'category' ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                } group-hover:translate-x-0 group-hover:opacity-100`} />
              </CardTitle>
              <CardDescription>
                Choose specific topics to practice
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {quizMode === 'category' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Categories</CardTitle>
              <CardDescription>
                Choose one or more categories to include in your quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                      selectedCategories.has(category.id)
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <CheckCircle 
                      className={`w-5 h-5 transition-all ${
                        selectedCategories.has(category.id)
                          ? 'opacity-100 text-black'
                          : 'opacity-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedCategories.size > 0 && (
                <p className="mt-4 text-sm text-gray-500">
                  {availableQuestions.filter(q => selectedCategories.has(q.category)).length} questions available in selected categories
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Number of Questions
            </CardTitle>
            <CardDescription>
              Select how many questions you want to practice with
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="px-4">
              <Slider
                value={questionCount}
                onValueChange={setQuestionCount}
                max={maxQuestions}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-gray-500">Selected: {questionCount} questions</span>
              <span className="text-gray-500">Final Exam: Probably 50~ questions</span>
            </div>
          </CardContent>
        </Card>

        <button
          onClick={() => setViewingAllQuestions(true)}
          className="w-full py-4 px-6 bg-white text-black border-2 border-black rounded-lg font-medium
                   hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          View All Questions
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          disabled={!quizMode || (quizMode === 'category' && selectedCategories.size === 0)}
          onClick={handleStart}
          className="w-full py-4 px-6 bg-black text-white rounded-lg font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed
                   enabled:hover:bg-gray-900
                   transition-all flex items-center justify-center gap-2"
        >
          Start Quiz
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-sm text-gray-500">
          Questions are based off of{" "}
          <a 
            href="https://docs.google.com/document/d/1vKhWn6xpbkvRcThuIuH80IZbZHDTtcAz_M92wLLxolQ/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline transition-colors"
          >
            group final Google Doc. 
          </a>
          // for specifically post midterm stuff, click categories then post exam applicable. or just do everything. made by ajay misra of group 8
        </p>
      </div>
    </div>
  );
}