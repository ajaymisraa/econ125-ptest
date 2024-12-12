"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { ResultsSummary } from './ResultsSummary';

export function QuizView({ questions, onExit }) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Shuffle each question's options and update the correct index accordingly
    const shuffled = questions.map(q => {
      const { options, correct } = q;
      // Create an array of indices to shuffle
      const indices = options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const newOptions = indices.map(i => options[i]);
      const newCorrect = indices.indexOf(correct);
      return {
        ...q,
        options: newOptions,
        correct: newCorrect
      };
    });
    setShuffledQuestions(shuffled);
    setAnswers(new Array(questions.length).fill(null));
  }, [questions]);

  const handleAnswer = (index) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = index;
      return newAnswers;
    });
  };

  const nextQuestion = () => {
    if (currentQuestion === shuffledQuestions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  if (showResults) {
    return (
      <ResultsSummary 
        questions={shuffledQuestions} 
        answers={answers}
        onRetakeIncorrect={(incorrectQuestions) => {
          setCurrentQuestion(0);
          setAnswers(new Array(incorrectQuestions.length).fill(null));
          setShowResults(false);
          setAnswered(false);
          setSelectedAnswer(null);
        }}
        onNewQuiz={onExit}
      />
    );
  }

  // If questions haven't been shuffled yet, don't render
  if (shuffledQuestions.length === 0) {
    return null;
  }

  const currentQ = shuffledQuestions[currentQuestion];
  const score = answers.filter((ans, idx) => ans === shuffledQuestions[idx].correct).length;

  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      <button 
        onClick={onExit}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Exit Quiz
      </button>
      
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Question {currentQuestion + 1} of {shuffledQuestions.length}</CardTitle>
              <div className="text-sm text-gray-500">
                Score: {score}
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-medium mb-4">
              {currentQ.question}
            </div>
            <div className="space-y-2">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    answered
                      ? index === currentQ.correct
                        ? 'bg-green-50 border-green-500'
                        : index === selectedAnswer
                        ? 'bg-red-50 border-red-500'
                        : 'bg-gray-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } border ${
                    answered && (
                      index === currentQ.correct
                        ? 'border-green-500'
                        : index === selectedAnswer
                        ? 'border-red-500'
                        : 'border-gray-200'
                    )
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answered && (
                      index === currentQ.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : index === selectedAnswer && index !== currentQ.correct ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null
                    )}
                  </div>
                </button>
              ))}
            </div>
            {answered && (
              <button
                onClick={nextQuestion}
                className="w-full mt-4 py-4 px-6 bg-black text-white rounded-lg font-medium
                         hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
              >
                {currentQuestion === shuffledQuestions.length - 1 ? 'View Results' : 'Next Question'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
