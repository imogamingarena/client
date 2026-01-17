"use client";
import React, { useState, useEffect } from "react";
import { format } from "../../utils/formatters";

interface SystemStatusProps {
  system: {
    id: string;
    type: string;
    name: string;
    playerName: string;
    playerPhone: string | undefined;
    startTime: Date;
    controllerCount: number;
    status: "active" | "paused" | "completed" | "available";
    totalAmount: number;
    duration: number; // in seconds
    lastPausedTime?: Date;
    pausedDuration: number; // in seconds
  };
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onEnd?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  system,
  onPause,
  onResume,
  onEnd,
  onCancel,
}) => {
  const [currentDuration, setCurrentDuration] = useState(system.duration);
  const [currentAmount, setCurrentAmount] = useState(system.totalAmount);
  const [isPulsing, setIsPulsing] = useState(false);

  // Calculate live duration and amount
  useEffect(() => {
    if (system.status === "active") {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = Math.floor(
          (now.getTime() - system.startTime.getTime()) / 1000,
        );
        const actualDuration = elapsedSeconds - system.pausedDuration;
        setCurrentDuration(actualDuration);

        // Simulate amount calculation (replace with your actual pricing logic)
        const newAmount = Math.max(system.totalAmount, actualDuration * 0.5);
        setCurrentAmount(newAmount);

        // Pulsing effect for active systems
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 500);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [
    system.status,
    system.startTime,
    system.pausedDuration,
    system.totalAmount,
  ]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    switch (system.status) {
      case "active":
        return "bg-green-500/20 border-green-500/40";
      case "paused":
        return "bg-yellow-500/20 border-yellow-500/40";
      case "completed":
        return "bg-blue-500/20 border-blue-500/40";
      default:
        return "bg-gray-500/20 border-gray-500/40";
    }
  };

  const getStatusText = () => {
    switch (system.status) {
      case "active":
        return "ACTIVE";
      case "paused":
        return "PAUSED";
      case "completed":
        return "COMPLETED";
      default:
        return "AVAILABLE";
    }
  };

  const getStatusIcon = () => {
    switch (system.status) {
      case "active":
        return "▶️";
      case "paused":
        return "⏸️";
      case "completed":
        return "✅";
      default:
        return "🔄";
    }
  };

  const getSystemIcon = (type: string) => {
    switch (type) {
      case '27"':
        return "🖥️";
      case '32"':
        return "📺";
      case '55"':
        return "🎬";
      default:
        return "🎮";
    }
  };

  return (
    <div className="relative group">
      {/* Glow effect for active systems */}
      {system.status === "active" && (
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl blur opacity-20 ${isPulsing ? "animate-pulse" : ""}`}
        ></div>
      )}

      <div
        className={`relative p-4 sm:p-6 rounded-2xl border-2 backdrop-blur-sm ${getStatusColor()} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
      >
        {/* System header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700">
                <span className="text-xl sm:text-2xl">
                  {getSystemIcon(system.type)}
                </span>
              </div>
              {system.status === "active" && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-ping"></div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {system.type} - {system.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                    system.status === "active"
                      ? "bg-green-500/30 text-green-400"
                      : system.status === "paused"
                        ? "bg-yellow-500/30 text-yellow-400"
                        : system.status === "completed"
                          ? "bg-blue-500/30 text-blue-400"
                          : "bg-gray-500/30 text-gray-400"
                  }`}
                >
                  {getStatusText()}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">ID: {system.id}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {system.status === "available"
                ? "FREE"
                : formatCurrency(currentAmount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {system.status === "available" ? "Ready to play" : "Live amount"}
            </div>
          </div>
        </div>

        {/* Player info (only when occupied) */}
        {system.status !== "available" && (
          <div className="mb-5 p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">
                      {system.playerName}
                    </h4>
                    {system.playerPhone && (
                      <p className="text-xs text-gray-400">
                        📱 {system.playerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Started at</div>
                <div className="text-sm font-mono text-cyan-400">
                  {format(system.startTime, "hh:mm a")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {/* Duration */}
          <div className="p-3 rounded-lg bg-gray-900/40">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Duration
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white">
              {formatDuration(currentDuration)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Live time</div>
          </div>

          {/* Controllers */}
          <div className="p-3 rounded-lg bg-gray-900/40">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Controllers
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xl sm:text-2xl font-bold text-white">
                {system.controllerCount}
              </div>
              <div className="text-2xl">🎮</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {system.controllerCount > 1 ? "Controllers" : "Controller"}
            </div>
          </div>

          {/* Rate */}
          <div className="p-3 rounded-lg bg-gray-900/40">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Rate
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-400">
              ₹0.5/s
            </div>
            <div className="text-xs text-gray-400 mt-1">Per second</div>
          </div>

          {/* Status */}
          <div className="p-3 rounded-lg bg-gray-900/40">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Status
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStatusIcon()}</span>
              <div className="text-lg font-bold text-white">
                {getStatusText()}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {system.status === "active"
                ? "Running"
                : system.status === "paused"
                  ? "On hold"
                  : "Ended"}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {system.status === "active" && onPause && (
            <button
              onClick={() => onPause(system.id)}
              className="flex-1 min-w-[120px] px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="text-xl">⏸️</span>
              <span>Pause</span>
            </button>
          )}

          {system.status === "paused" && onResume && (
            <button
              onClick={() => onResume(system.id)}
              className="flex-1 min-w-[120px] px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="text-xl">▶️</span>
              <span>Resume</span>
            </button>
          )}

          {(system.status === "active" || system.status === "paused") &&
            onEnd && (
              <button
                onClick={() => onEnd(system.id)}
                className="flex-1 min-w-[120px] px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span className="text-xl">✅</span>
                <span>End Session</span>
              </button>
            )}

          {system.status !== "available" && onCancel && (
            <button
              onClick={() => onCancel(system.id)}
              className="flex-1 min-w-[120px] px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="text-xl">❌</span>
              <span>Cancel</span>
            </button>
          )}

          {system.status === "available" && (
            <button className="flex-1 min-w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95">
              <span className="text-xl">🎮</span>
              <span>Start New Session</span>
            </button>
          )}
        </div>

        {/* Live timer indicator for active sessions */}
        {system.status === "active" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Live timer running</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Updating in real-time</span>
              </div>
            </div>
            <div className="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full animate-progress"
                style={{
                  width: `${Math.min(((currentDuration % 60) / 60) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-progress {
          animation: progress 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(2)}`;
};

// Example usage component
const SystemStatusDashboard: React.FC = () => {
  const [systems, setSystems] = useState<
    Array<{
      id: string;
      type: string;
      name: string;
      playerName: string;
      playerPhone: string | undefined;
      startTime: Date;
      controllerCount: number;
      status: "active" | "paused" | "completed" | "available";
      totalAmount: number;
      duration: number;
      pausedDuration: number;
    }>
  >([
    {
      id: "SYS001",
      type: '27"',
      name: "Standard Gaming",
      playerName: "John Doe",
      playerPhone: "+91 9876543210",
      startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      controllerCount: 2,
      status: "active" as const,
      totalAmount: 135.5,
      duration: 45 * 60, // 45 minutes in seconds
      pausedDuration: 0,
    },
    {
      id: "SYS002",
      type: '32"',
      name: "Premium Gaming",
      playerName: "Jane Smith",
      playerPhone: "+91 9876543211",
      startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      controllerCount: 4,
      status: "paused" as const,
      totalAmount: 220.0,
      duration: 30 * 60, // 30 minutes in seconds
      pausedDuration: 5 * 60, // 5 minutes paused
    },
    {
      id: "SYS003",
      type: '55"',
      name: "Ultimate Gaming",
      playerName: "Bob Wilson",
      playerPhone: "+91 9876543212",
      startTime: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
      controllerCount: 3,
      status: "completed" as const,
      totalAmount: 450.0,
      duration: 90 * 60, // 90 minutes in seconds
      pausedDuration: 0,
    },
    {
      id: "SYS004",
      type: '27"',
      name: "Standard Gaming",
      playerName: "",
      playerPhone: undefined,
      startTime: new Date(),
      controllerCount: 1,
      status: "available" as const,
      totalAmount: 0,
      duration: 0,
      pausedDuration: 0,
    },
  ]);

  const handlePause = (id: string) => {
    console.log(`Pause system ${id}`);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id ? { ...sys, status: "paused" as const } : sys,
      ),
    );
  };

  const handleResume = (id: string) => {
    console.log(`Resume system ${id}`);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id ? { ...sys, status: "active" as const } : sys,
      ),
    );
  };

  const handleEnd = (id: string) => {
    console.log(`End session on system ${id}`);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id ? { ...sys, status: "completed" as const } : sys,
      ),
    );
  };

  const handleCancel = (id: string) => {
    console.log(`Cancel session on system ${id}`);
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id
          ? {
              ...sys,
              status: "available" as const,
              playerName: "",
              totalAmount: 0,
              duration: 0,
            }
          : sys,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Gaming Systems Dashboard
            </span>
          </h1>
          <p className="text-gray-400">
            Real-time status of all gaming systems
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {systems.map((system) => (
            <SystemStatus
              key={system.id}
              system={system}
              onPause={handlePause}
              onResume={handleResume}
              onEnd={handleEnd}
              onCancel={handleCancel}
            />
          ))}
        </div>

        {/* Stats summary */}
        <div className="mt-8 p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {systems.filter((s) => s.status === "active").length}
              </div>
              <div className="text-sm text-gray-400">Active Systems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {systems.filter((s) => s.status === "paused").length}
              </div>
              <div className="text-sm text-gray-400">Paused</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {systems.filter((s) => s.status === "available").length}
              </div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                ₹
                {systems
                  .reduce((sum, sys) => sum + sys.totalAmount, 0)
                  .toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SystemStatus, SystemStatusDashboard };
