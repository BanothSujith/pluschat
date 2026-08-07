import React from 'react';
import { Link } from 'react-router-dom';

function Not() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      
      {/* Glowing Stars Background */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping opacity-30" />
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-20" />
        <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-white rounded-full animate-ping opacity-25" />
      </div>

      {/* Animated Character / Creator Illustration */}
      <div className="z-10 mb-6">
        <div className="w-40 h-40 relative animate-bounce">
          <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-5xl font-bold">
            👨‍💻
          </div>
        </div>
      </div>

      {/* Glitch 404 Text */}
      <h1 className="text-[100px] font-extrabold text-center relative glitch z-10" data-text="404">
        404
      </h1>
      <p className="text-lg mt-2 z-10 text-center max-w-md">Oops! The page you're looking for doesn't exist or is under construction.</p>

      {/* Home Button */}
      <Link
        to="/"
        className="mt-6 px-6 py-3 z-10 bg-pink-600 rounded-lg text-white font-semibold shadow-lg hover:bg-cyan-400 hover:text-black transition-all duration-300"
      >
        Return Home
      </Link>

      {/* Custom Glitch Effect */}
      <style>{`
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          width: 100%;
          overflow: hidden;
        }

        .glitch::before {
          animation: glitchTop 2s infinite linear;
          color: #ff00c8;
          top: -2px;
        }

        .glitch::after {
          animation: glitchBottom 2s infinite linear;
          color: #00fff7;
          top: 2px;
        }

        @keyframes glitchTop {
          0% { clip: rect(0, 9999px, 0, 0); }
          10% { clip: rect(0, 9999px, 30px, 0); transform: translate(-2px, -2px); }
          20% { clip: rect(30px, 9999px, 60px, 0); transform: translate(2px, 2px); }
          30%, 100% { clip: rect(0, 9999px, 0, 0); transform: none; }
        }

        @keyframes glitchBottom {
          0% { clip: rect(0, 9999px, 0, 0); }
          10% { clip: rect(60px, 9999px, 90px, 0); transform: translate(2px, 2px); }
          20% { clip: rect(10px, 9999px, 40px, 0); transform: translate(-2px, -2px); }
          30%, 100% { clip: rect(0, 9999px, 0, 0); transform: none; }
        }
      `}</style>
    </div>
  );
}

export default Not;