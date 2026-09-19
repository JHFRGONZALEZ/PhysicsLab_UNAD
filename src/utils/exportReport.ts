import { DataPoint, AnalysisResult, Hypothesis } from '../types/simulation.types';

/**
 * Export data points to CSV format
 */
export function exportToCSV(dataPoints: DataPoint[]): string {
  const header = 'Tiempo (s),Posición (m),Velocidad (m/s)\n';
  const rows = dataPoints.map(p => `${p.time.toFixed(2)},${p.position.toFixed(2)},${p.velocity.toFixed(2)}`).join('\n');
  return header + rows;
}

/**
 * Download CSV file
 */
export function downloadCSV(dataPoints: DataPoint[], filename: string = 'datos_mru.csv'): void {
  const csv = exportToCSV(dataPoints);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Generate PDF report content
 */
export interface ReportData {
  studentName: string;
  date: string;
  hypothesis: Hypothesis | null;
  dataPoints: DataPoint[];
  analysis: AnalysisResult | null;
  conclusions: string;
  answers: { question: string; answer: string }[];
}

/**
 * Create a printable report as HTML for PDF generation
 */
export function generateReportHTML(data: ReportData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte MRU - ${data.studentName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #1e40af; border-bottom: 2px solid #1e40af; }
        h2 { color: #374151; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: center; }
        th { background: #f3f4f6; }
        .highlight { background: #dbeafe; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Laboratorio Virtual: Movimiento Rectilíneo Uniforme</h1>
      <p><strong>Estudiante:</strong> ${data.studentName}</p>
      <p><strong>Fecha:</strong> ${data.date}</p>
      
      <h2>1. Objetivos</h2>
      <ul>
        <li>Comprender que en MRU la velocidad es constante</li>
        <li>Relacionar posición, velocidad y tiempo mediante ecuaciones</li>
        <li>Interpretar gráficas posición-tiempo y velocidad-tiempo</li>
        <li>Recolectar datos experimentales y analizarlos críticamente</li>
      </ul>

      <h2>2. Hipótesis</h2>
      <div class="highlight">${data.hypothesis?.text || 'No se registró hipótesis'}</div>

      <h2>3. Datos Experimentales</h2>
      <table>
        <tr><th>Tiempo (s)</th><th>Posición (m)</th><th>Velocidad (m/s)</th></tr>
        ${data.dataPoints.map(p => `<tr><td>${p.time.toFixed(2)}</td><td>${p.position.toFixed(2)}</td><td>${p.velocity.toFixed(2)}</td></tr>`).join('')}
      </table>

      <h2>4. Análisis de Resultados</h2>
      ${data.analysis ? `
        <p><strong>Velocidad teórica:</strong> ${data.analysis.theoreticalVelocity.toFixed(2)} m/s</p>
        <p><strong>Velocidad experimental:</strong> ${data.analysis.experimentalVelocity.toFixed(2)} m/s</p>
        <p><strong>Error porcentual:</strong> ${data.analysis.percentError.toFixed(2)}%</p>
        <p><strong>Ecuación ajustada:</strong> ${data.analysis.equation}</p>
        <p><strong>R²:</strong> ${data.analysis.rSquared.toFixed(4)}</p>
      ` : '<p>No hay datos suficientes para el análisis.</p>'}

      <h2>5. Conclusiones</h2>
      <div class="highlight">${data.conclusions || 'No se registraron conclusiones'}</div>

      <h2>6. Respuestas a Preguntas</h2>
      ${data.answers.map(a => `<p><strong>${a.question}</strong><br/>${a.answer}</p>`).join('<hr/>')}
    </body>
    </html>
  `;
}
