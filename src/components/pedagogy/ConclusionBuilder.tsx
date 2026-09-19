import React, { useState } from 'react';
import { useLabStore } from '../../store/labStore';
import { FileText, Download } from 'lucide-react';
import { generateReportHTML, ReportData } from '../../utils/exportReport';
import { analyzeData } from '../../utils/physicsCalculations';

export const ConclusionBuilder: React.FC = () => {
  const { conclusions, setConclusions, hypothesis, dataPoints, velocity, questions, studentName, setStudentName } = useLabStore();
  const [text, setText] = useState(conclusions);
  const [generating, setGenerating] = useState(false);

  const reflectionQuestions = [
    '¿Se cumplió tu hipótesis? ¿Por qué?',
    '¿Qué aprendiste sobre el movimiento rectilíneo uniforme?',
    '¿Cómo se relacionan las gráficas con las ecuaciones?',
    '¿Qué mejorarías en tu proceso de medición?',
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    
    const analysis = dataPoints.length >= 2 ? analyzeData(dataPoints, velocity) : null;
    const answeredQuestions = questions.filter(q => q.answered).map(q => ({
      question: q.text,
      answer: q.answer || '',
    }));

    const reportData: ReportData = {
      studentName: studentName || 'Estudiante',
      date: new Date().toLocaleDateString(),
      hypothesis,
      dataPoints,
      analysis,
      conclusions: text,
      answers: answeredQuestions,
    };

    const html = generateReportHTML(reportData);
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }

    setGenerating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-2xl">📝</span> Conclusiones y Reporte
      </h3>

      {/* Student name */}
      <div className="mb-3">
        <label className="text-xs text-gray-500 font-medium">Nombre del estudiante:</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Tu nombre"
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        />
      </div>

      {/* Reflection prompts */}
      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 font-medium mb-2">Preguntas para reflexionar:</p>
        <ul className="space-y-1">
          {reflectionQuestions.map((q, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-start gap-1">
              <span className="text-blue-400">•</span> {q}
            </li>
          ))}
        </ul>
      </div>

      {/* Conclusions text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tus conclusiones aquí..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        rows={5}
      />

      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{text.length} caracteres</span>
        <button
          onClick={() => setConclusions(text)}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
        >
          Guardar
        </button>
      </div>

      {/* Report generation */}
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={handleGenerateReport}
          disabled={generating || dataPoints.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <FileText size={18} />
              Generar Reporte PDF
              <Download size={16} />
            </>
          )}
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          Se abrirá una ventana para imprimir/guardar como PDF
        </p>
      </div>
    </div>
  );
};
