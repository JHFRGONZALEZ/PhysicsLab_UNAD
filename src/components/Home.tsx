import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Practice {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  topics: string[];
  status: 'available' | 'coming-soon';
}

const practices: Practice[] = [
  {
    id: 'mru',
    title: 'Práctica 1',
    subtitle: 'Movimiento Rectilíneo Uniforme (MRU)',
    description: 'Experimenta con el movimiento a velocidad constante. Aprende a interpretar gráficas posición-tiempo y velocidad-tiempo.',
    icon: '🚗',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    topics: ['Velocidad constante', 'Gráficas x-t y v-t', 'Pendiente como velocidad', 'Análisis de datos'],
    status: 'available'
  },
  {
    id: 'mruv',
    title: 'Práctica 2',
    subtitle: 'Movimiento Rectilíneo Uniformemente Variado (MRUV)',
    description: 'Explora el movimiento con aceleración constante. Descubre cómo cambian la velocidad y la posición con el tiempo.',
    icon: '🚀',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    topics: ['Aceleración constante', 'Velocidad variable', 'Gráficas x-t, v-t y a-t', 'Ecuaciones cinemáticas'],
    status: 'available'
  },
  {
    id: 'caida-libre',
    title: 'Práctica 3',
    subtitle: 'Caída Libre',
    description: 'Estudia el movimiento de objetos bajo la influencia de la gravedad. Mide el tiempo de caída y calcula g.',
    icon: '🍎',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    topics: ['Gravedad', 'Tiempo de caída', 'Cálculo de g', 'Gravedad planetaria'],
    status: 'available'
  },
  {
    id: 'tiro-parabolico',
    title: 'Práctica 4',
    subtitle: 'Tiro Parabólico',
    description: 'Analiza el movimiento de proyectiles. Combina movimiento horizontal y vertical para predecir trayectorias.',
    icon: '🎯',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    topics: ['Componentes del movimiento', 'Alcance máximo', 'Altura máxima', 'Ángulo óptimo'],
    status: 'available'
  },
  {
    id: 'pendulo',
    title: 'Práctica 5',
    subtitle: 'Péndulo Simple',
    description: 'Investiga el movimiento oscilatorio. Mide el período para diferentes longitudes y calcula g experimentalmente.',
    icon: '⏰',
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-500',
    topics: ['Cálculo de g', 'Período vs longitud', 'T² = (4π²/g)·L', 'Regresión lineal'],
    status: 'available'
  },
  {
    id: 'newton',
    title: 'Práctica 6',
    subtitle: 'Leyes de Newton',
    description: 'Experimenta con fuerzas y aceleración. Verifica experimentalmente que F = m·a.',
    icon: '⚖️',
    color: 'red',
    gradient: 'from-red-500 to-rose-500',
    topics: ['F=ma', 'Fuerza neta', 'Masa y aceleración', 'Fricción'],
    status: 'available'
  }
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto">
                <span className="text-white text-4xl">⚛️</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Laboratorio Virtual de Física
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explora los conceptos fundamentales de la física mediante simulaciones interactivas. 
              Experimenta, mide, analiza y aprende.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md text-center"
          >
            <div className="text-3xl font-bold text-blue-600">6</div>
            <div className="text-sm text-gray-600">Prácticas</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-md text-center"
          >
            <div className="text-3xl font-bold text-green-600">6</div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-md text-center"
          >
            <div className="text-3xl font-bold text-purple-600">60</div>
            <div className="text-sm text-gray-600">FPS</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-md text-center"
          >
            <div className="text-3xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-gray-600">Interactivo</div>
          </motion.div>
        </div>
      </div>

      {/* Practices Grid */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {practices.map((practice, index) => (
            <motion.div
              key={practice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {practice.status === 'available' ? (
                <Link to={
                  practice.id === 'mru' ? '/practica/mru' :
                  practice.id === 'mruv' ? '/practica/mruv' :
                  practice.id === 'caida-libre' ? '/practica/caida-libre' :
                  practice.id === 'tiro-parabolico' ? '/practica/tiro-parabolico' :
                  practice.id === 'pendulo' ? '/practica/pendulo' :
                  practice.id === 'newton' ? '/practica/newton' :
                  `/practica/${practice.id}`
                }>
                  <PracticeCard practice={practice} />
                </Link>
              ) : (
                <PracticeCard practice={practice} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Laboratorio Virtual de Física General</p>
          <p className="mt-1 text-xs">Diseñado para aprendizaje activo • Simulaciones interactivas</p>
        </div>
      </footer>
    </div>
  );
};

interface PracticeCardProps {
  practice: Practice;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ practice }) => {
  const isAvailable = practice.status === 'available';

  return (
    <motion.div
      whileHover={isAvailable ? { scale: 1.05, y: -5 } : {}}
      whileTap={isAvailable ? { scale: 0.98 } : {}}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
        isAvailable ? 'cursor-pointer hover:shadow-2xl' : 'opacity-75 cursor-not-allowed'
      }`}
    >
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${practice.gradient} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 text-8xl opacity-20 transform translate-x-4 -translate-y-4">
          {practice.icon}
        </div>
        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-90">
            {practice.title}
          </div>
          <h3 className="text-xl font-bold mb-2">{practice.subtitle}</h3>
          {!isAvailable && (
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              Próximamente
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4">{practice.description}</p>

        {/* Topics */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Temas:
          </div>
          <div className="flex flex-wrap gap-2">
            {practice.topics.map((topic, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isAvailable
                    ? `bg-${practice.color}-100 text-${practice.color}-700`
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Action button */}
        {isAvailable && (
          <div className={`flex items-center justify-between pt-4 border-t border-gray-100`}>
            <span className={`text-sm font-medium text-${practice.color}-600`}>
              Iniciar práctica
            </span>
            <div className={`w-8 h-8 rounded-full bg-${practice.color}-100 flex items-center justify-center`}>
              <svg
                className={`w-4 h-4 text-${practice.color}-600`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
