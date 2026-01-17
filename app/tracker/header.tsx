"use client";
import React from "react";

const Header: React.FC = () => {
  const totalSystem = 7;
  const busySystem = 4;
  const availableSystem = totalSystem - busySystem;
  const vistedSofar = 20;

  return (
    <header className="relative bg-gradient-to-b from-gray-900 to-black border-b border-cyan-900/30 mb-8 overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,255,255,0.1)_1px,transparent_0)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Scan line effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent animate-scan"></div>

      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left section: Branding */}
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Animated gaming icon */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-green-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-cyan-500/30 flex items-center justify-center shadow-2xl">
                    <span className="text-2xl sm:text-3xl md:text-4xl">🎮</span>
                    {/* Pixel corners */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500"></div>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500"></div>
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-bold px-2 py-1 bg-gradient-to-r from-cyan-900 to-green-900 rounded border border-cyan-700/50">
                      🏆 PREMIUM
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                      IMO GAMING ARENA
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 mt-1 sm:mt-2 font-mono">
                    <span className="text-cyan-400">&gt;</span> Real-Time
                    Management System
                  </p>
                </div>
              </div>
            </div>

            {/* Right section: Status */}
            <div className="w-full md:w-auto">
              <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 sm:p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-ping"></div>
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-green-400 uppercase tracking-wider">
                      Live Tracker
                    </span>
                  </div>

                  {/* <div className="px-2 py-1 bg-gradient-to-r from-cyan-900 to-green-900 rounded border border-cyan-700/30">
                    <span className="text-xs font-mono text-cyan-300">
                      v2.1
                    </span>
                  </div> */}
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      Status
                    </div>
                    <div className="text-sm text-green-400 font-medium">
                      All Systems Operational
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation/Stats bar - Responsive */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              <StatItem
                label="Total Systems"
                value={totalSystem}
                color="blue"
              />
              <StatItem label="Live Sessions" value={busySystem} color="cyan" />
              <StatItem
                label="Available"
                value={availableSystem}
                color="green"
              />
              <StatItem
                label="Today's visitor"
                value={vistedSofar}
                color="yellow"
              />
              {/* <StatItem label="Today's Earnings" value="₹0.00" color="yellow" /> */}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease-in-out infinite;
          background-clip: text;
          -webkit-background-clip: text;
        }
      `}</style>
    </header>
  );
};

// Helper component for stats
const StatItem: React.FC<{
  label: string;
  value: number;
  color: "cyan" | "green" | "blue" | "purple" | "yellow";
}> = ({ label, value, color }) => {
  const colorClasses = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="text-center">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className={`text-sm sm:text-base md:text-lg font-bold ${colorClasses[color]}`}
      >
        {value}
      </div>
    </div>
  );
};

export default Header;
