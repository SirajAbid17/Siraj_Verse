import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FloatingElement = ({ type }) => {
  const style = {
    left: `${Math.random() * 100}vw`,
    animationDuration: `${15 + Math.random() * 20}s`,
    animationDelay: `${Math.random() * 5}s`,
    fontSize: `${type === 'balloon' ? 30 + Math.random() * 30 : 10 + Math.random() * 15}px`,
    opacity: type === 'balloon' ? 0.9 : 0.7 + Math.random() * 0.3,
    bottom: type === 'balloon' ? '-50px' : 'auto',
    top: type === 'balloon' ? 'auto' : `${Math.random() * 50}vh`,
  };

  const elements = {
    balloon: ['🎈', '🎈', '🎈', '🎈', '🎏', '🪀', '🪅'],
    particle: ['🌸', '✨', '⚡', '❄️', '💫', '🌠', '🌟']
  };

  return (
    <div
      className={`absolute ${type === 'balloon' ? 'animate-float-up' : 'animate-float'} pointer-events-none`}
      style={style}
    >
      {elements[type][Math.floor(Math.random() * elements[type].length)]}
    </div>
  );
};

export default function Refresh() {
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);

  useEffect(() => {
  
    const balloonInterval = setInterval(() => {
      if (elements.filter(e => e.type === 'balloon').length < 15) {
        setElements([...elements, { id: Date.now(), type: 'balloon' }]);
      }
    }, 800);

   
    const particleInterval = setInterval(() => {
      if (elements.filter(e => e.type === 'particle').length < 30) {
        setElements([...elements, { id: Date.now() + 1, type: 'particle' }]);
      }
    }, 300);

    return () => {
      clearInterval(balloonInterval);
      clearInterval(particleInterval);
    };
  }, [elements]);

  const handleRefresh = () => {
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-pink-100 via-purple-50 to-blue-50">
      
      {elements.map((element) => (
        <FloatingElement key={element.id} type={element.type} />
      ))}

     
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300 rounded-full filter blur-3xl opacity-20 mix-blend-multiply animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-20 mix-blend-multiply animate-pulse-slower"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-20 mix-blend-multiply animate-pulse-slow"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="w-full max-w-md rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm z-10 overflow-hidden border border-white/20"
      >
        <div className="p-8 text-center relative">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
          
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Welcome to <span className="text-blue-600">Sirajverse</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-700 mb-6 leading-relaxed"
          >
            Your journey into tech starts here. <br />
            Share updates, connect with developers, build your personal brand, and chat with our smart AI assistant.
            <br /><span className="text-purple-600 font-medium italic">Explore, learn, and grow with us every day.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRefresh}
              className="w-full px-6 py-3 bg-white  text-black border border-gray-500 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:bg-black hover:text-white"
            >
              <span className="relative z-10">Start Your Journey</span>
           
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-float-up {
          animation: float-up linear forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}