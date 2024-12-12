"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Brain, RotateCcw, CheckCircle, XCircle, Timer, Target, ArrowRight } from "lucide-react";

export function ResultsSummary({ questions, answers, onRetakeIncorrect, onNewQuiz }) {
  // Calculate statistics
  const totalCorrect = answers.filter((answer, index) => answer === questions[index].correct).length;
  const percentage = Math.round((totalCorrect / questions.length) * 100);
  const streak = answers.reduce((acc, answer, index) => {
    const currentStreak = answer === questions[index].correct ? acc.current + 1 : 0;
    return {
      current: currentStreak,
      best: Math.max(acc.best, currentStreak)
    };
  }, { current: 0, best: 0 }).best;

  // Category performance
  const categoryStats = questions.reduce((acc, question, index) => {
    const category = question.category;
    if (!acc[category]) {
      acc[category] = { correct: 0, total: 0, name: category };
    }
    acc[category].total += 1;
    if (answers[index] === question.correct) {
      acc[category].correct += 1;
    }
    return acc;
  }, {});

  // Get incorrect questions
  const incorrectQuestions = questions.filter((_, index) => answers[index] !== questions[index].correct);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center space-y-4 mb-12">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75" />
        </div>

        <h1 className="text-4xl font-bold text-center">Done with the practice test</h1>
        <p className="text-gray-500">You've completed {questions.length} questions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">{percentage}%</CardTitle>
            <CardDescription>Overall Score</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={percentage} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">{totalCorrect}</CardTitle>
            <CardDescription>Correct Answers</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(totalCorrect / questions.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">{streak}</CardTitle>
            <CardDescription>Best Streak</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(streak / questions.length) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Question Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Question Timeline</CardTitle>
          <CardDescription>Review your performance question by question</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger>
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      answers[index] === question.correct
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {answers[index] === question.correct ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <p className="font-medium">Question {index + 1}</p>
                    <p className="text-sm">{question.question}</p>
                    <Separator />
                    <div className="text-sm">
                      <p className="text-gray-500">Your answer:</p>
                      <p className={answers[index] === question.correct ? 'text-green-600' : 'text-red-600'}>
                        {question.options[answers[index]]}
                      </p>
                      {answers[index] !== question.correct && (
                        <>
                          <p className="text-gray-500 mt-2">Correct answer:</p>
                          <p className="text-green-600">{question.options[question.correct]}</p>
                        </>
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>See how well you did in each topic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.values(categoryStats)
            .sort((a, b) => (b.correct / b.total) - (a.correct / a.total))
            .map(stat => (
              <div key={stat.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium capitalize">{stat.name}</p>
                    <p className="text-sm text-gray-500">
                      {stat.correct} of {stat.total} correct
                    </p>
                  </div>
                  <span className="text-2xl font-bold">
                    {Math.round((stat.correct / stat.total) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(stat.correct / stat.total) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incorrectQuestions.length > 0 && (
          <button
            onClick={() => onRetakeIncorrect(incorrectQuestions)}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-black text-white rounded-lg 
                     hover:bg-gray-900 transition-all group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Practice {incorrectQuestions.length} Incorrect Questions
          </button>
        )}
        <button
          onClick={onNewQuiz}
          className="flex items-center justify-center gap-2 py-4 px-6 bg-white text-black rounded-lg 
                   border border-black hover:bg-gray-50 transition-all group"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          Start New Quiz
        </button>
      </div>
    </div>
  );
}