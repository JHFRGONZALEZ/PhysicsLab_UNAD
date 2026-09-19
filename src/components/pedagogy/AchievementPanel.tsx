import React, { useState } from 'react';
import { useLabStore } from '../../store/labStore';
import { Trophy, X } from 'lucide-react';

export const AchievementPanel: React.FC = () => {
  const { achievements } = useLabStore();
  const [showAll, setShowAll] = useState(false);

  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <Trophy size={16} className="text-yellow-500" />
          Logros
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
            {unlocked.length}/{achievements.length}
          </span>
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {showAll ? 'Ocultar' : 'Ver todos'}
        </button>
      </div>

      {/* Unlocked achievements */}
      <div className="flex flex-wrap gap-2">
        {unlocked.map(a => (
          <div
            key={a.id}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-xs"
            title={a.description}
          >
            <span>{a.icon}</span>
            <span className="text-yellow-800 font-medium">{a.title}</span>
          </div>
        ))}
      </div>

      {/* All achievements modal */}
      {showAll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAll(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} /> Todos los Logros
              </h3>
              <button onClick={() => setShowAll(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {achievements.map(a => (
                <div
                  key={a.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    a.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{a.unlocked ? a.icon : '🔒'}</span>
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                  {a.unlocked && <span className="ml-auto text-green-600 text-xs">✓ Desbloqueado</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
