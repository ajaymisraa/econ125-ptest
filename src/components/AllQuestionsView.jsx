"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle } from "lucide-react";

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

  // Group questions by category
  const questionsByCategory = categories.map(category => ({
    ...category,
    questions: questions.filter(q => q.category === category.id)
  }));

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">All Questions</h1>
            <p className="text-sm text-gray-500 mt-2">
              {questions.length} questions total across {categories.length} categories
            </p>
          </div>
          <button
            onClick={onExit}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Back to Quiz
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {questionsByCategory.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full text-left"
              >
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-gray-500" />
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
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
                  <div className="space-y-6 py-4">
                    {category.questions.map((question, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="font-medium text-lg mb-4">
                          {`${idx + 1}. ${question.question}`}
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {question.options.map((option, optIdx) => {
                            const isCorrect = Number(question.correct) === optIdx;
                            return (
                              <div
                                key={optIdx}
                                className={`p-4 rounded-lg flex items-center justify-between ${
                                  isCorrect
                                    ? 'bg-green-50 border-2 border-green-500'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <span className={isCorrect ? 'font-bold text-green-900' : ''}>
                                  {option}
                                </span>
                                {isCorrect && (
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800">
                                      Correct Answer
                                    </span>
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Click on any category to expand and view its questions
        </div>
      </div>
    </div>
  );
};

export default AllQuestionsView;