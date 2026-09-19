import React, { useState } from 'react';
import { useLabStore } from '../../store/labStore';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export const GuidedQuestions: React.FC = () => {
  const { questions, answerQuestion } = useLabStore();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState<Record<number, string>>({});

  const levels = [
    { key: 'observation', label: 'Nivel 1: Observación', color: 'bg-blue-100 text-blue-800', icon: '👁️' },
    { key: 'analysis', label: 'Nivel 2: Análisis', color: 'bg-purple-100 text-purple-800', icon: '🔍' },
    { key: 'synthesis', label: 'Nivel 3: Síntesis', color: 'bg-orange-100 text-orange-800', icon: '🧩' },
    { key: 'application', label: 'Nivel 4: Aplicación', color: 'bg-green-100 text-green-800', icon: '🚀' },
  ];

  const handleSubmitAnswer = (questionId: number) => {
    const text = answerText[questionId];
    if (text && text.trim().length > 5) {
      answerQuestion(questionId, text.trim());
      setAnswerText({ ...answerText, [questionId]: '' });
      setExpandedQuestion(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">❓</span> Preguntas Guía
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {questions.filter(q => q.answered).length}/{questions.length}
        </span>
      </h3>

      <div className="space-y-3">
        {levels.map(level => {
          const levelQuestions = questions.filter(q => q.level === level.key);
          return (
            <div key={level.key} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className={`px-3 py-2 ${level.color} flex items-center gap-2`}>
                <span>{level.icon}</span>
                <span className="text-sm font-medium">{level.label}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {levelQuestions.map(q => (
                  <div key={q.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 ${
                        q.answered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {q.answered ? '✓' : q.id}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{q.text}</p>
                        
                        {/* Hint */}
                        <button
                          onClick={() => setShowHint(showHint === q.id ? null : q.id)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <HelpCircle size={12} />
                          {showHint === q.id ? 'Ocultar pista' : 'Ver pista'}
                        </button>
                        {showHint === q.id && (
                          <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 flex items-start gap-1">
                            <Lightbulb size={12} className="mt-0.5 shrink-0" />
                            <span>{q.hint}</span>
                          </div>
                        )}

                        {/* Answer area */}
                        {expandedQuestion === q.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={answerText[q.id] || ''}
                              onChange={(e) => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                              placeholder="Escribe tu respuesta aquí..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSubmitAnswer(q.id)}
                                disabled={!answerText[q.id] || answerText[q.id].trim().length < 5}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                              >
                                Guardar respuesta
                              </button>
                              <button
                                onClick={() => setExpandedQuestion(null)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : !q.answered ? (
                          <button
                            onClick={() => setExpandedQuestion(q.id)}
                            className="mt-1 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ChevronDown size={12} /> Responder
                          </button>
                        ) : (
                          <div className="mt-1 p-2 bg-green-50 rounded text-xs text-green-800">
                            <strong>Respuesta:</strong> {q.answer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
