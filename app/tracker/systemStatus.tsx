"use client";
import React, { useState, useEffect } from "react";
import { format } from "../../utils/formatters";
import {
  formatCurrency,
  formatDuration,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  getSystemIcon,
} from "@/helperFunction";
import { System, SystemStatusProps } from "@/types/interface";
import { systemsDesc } from "./systemDetails";

// Type assertion to ensure systemsDesc matches System[]

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

        // Calculate amount based on rate
        const newAmount = Math.max(
          system.totalAmount,
          actualDuration * system.ratePerSecond,
        );
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
    system.ratePerSecond,
  ]);

  return (
    <div className="relative group">
      {/* Glow effect for active systems */}
      {system.status === "active" && (
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl blur opacity-20 ${isPulsing ? "animate-pulse" : ""}`}
        ></div>
      )}

      <div
        className={`relative p-4 sm:p-6 rounded-2xl border-2 backdrop-blur-sm ${getStatusColor(system.status)} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
      >
        {/* System header with actions */}
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

            <div className="flex-1">
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
                  {getStatusText(system.status)}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{system.description}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {system.id}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1"></div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                {system.status === "available"
                  ? "FREE"
                  : formatCurrency(currentAmount)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {system.status === "available"
                  ? "Ready to play"
                  : "Live amount"}
              </div>
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
                {system.controllerCount}/{system.maxControllers}
              </div>
              <div className="text-2xl">🎮</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Max: {system.maxControllers}
            </div>
          </div>

          {/* Rate */}
          <div className="p-3 rounded-lg bg-gray-900/40">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Rate
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-400">
              ₹{system.ratePerSecond}/s
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ₹{system.hourlyRate}/hr
            </div>
          </div>

          {/* Status */}
          <div className="p-3 rounded-lg bg-gray-900/40">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Status
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStatusIcon(system.status)}</span>
              <div className="text-lg font-bold text-white">
                {getStatusText(system.status)}
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

// Main Dashboard Component
const DynamicSystemStatusDashboard: React.FC = () => {
  const [systems, setSystems] = useState<System[]>(systemsDesc);
  const [playerName, setPlayerName] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [controllerCount, setControllerCount] = useState(1);

  const handleStartSession = (systemId: string) => {
    if (!playerName.trim()) {
      alert("Please enter player name");
      return;
    }

    setSystems(
      systems.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              playerName,
              playerPhone: playerPhone || undefined,
              startTime: new Date(),
              status: "active",
              controllerCount,
              totalAmount: 0,
              duration: 0,
              pausedDuration: 0,
            }
          : sys,
      ),
    );

    setPlayerName("");
    setPlayerPhone("");
    setSelectedSystem(null);
    setControllerCount(1);
  };

  const handlePause = (id: string) => {
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id
          ? {
              ...sys,
              status: "paused",
              lastPausedTime: new Date(),
            }
          : sys,
      ),
    );
  };

  const handleResume = (id: string) => {
    const system = systems.find((s) => s.id === id);
    if (!system || !system.lastPausedTime) return;

    const pauseDuration = Math.floor(
      (new Date().getTime() - system.lastPausedTime.getTime()) / 1000,
    );

    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id
          ? {
              ...sys,
              status: "active",
              pausedDuration: sys.pausedDuration + pauseDuration,
              lastPausedTime: undefined,
            }
          : sys,
      ),
    );
  };

  const handleEnd = (id: string) => {
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id
          ? {
              ...sys,
              status: "completed",
              endTime: new Date(),
            }
          : sys,
      ),
    );
  };

  const handleCancel = (id: string) => {
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === id
          ? {
              ...sys,
              playerName: "",
              playerPhone: undefined,
              status: "available",
              totalAmount: 0,
              duration: 0,
              pausedDuration: 0,
              controllerCount: 1,
            }
          : sys,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Manage Gaming Systems
              </span>
            </h1>
            <p className="text-gray-400">
              Manage {systems.length} gaming systems dynamically
            </p>
          </div>
        </div>
        {/* Systems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
      </div>
    </div>
  );
};

export { SystemStatus, DynamicSystemStatusDashboard };
