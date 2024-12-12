import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Questions</h1>
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
                        className={`p-3 rounded-lg flex items-center justify-between ${
                            option === question.correct_answer
                            ? 'bg-green-100 border-2 border-green-500 text-green-900'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                        >
                        <span>{option}</span>
                        {option === question.correct_answer && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-200 text-green-900">
                            Correct Answer
                            </span>
                        )}
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

export default AllQuestionsView;