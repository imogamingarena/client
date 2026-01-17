import { SystemStatus } from "./types/interface";

export const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const getStatusColor = (status: SystemStatus) => {
  switch (status) {
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

export const getStatusText = (status: SystemStatus) => {
  switch (status) {
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

export const getStatusIcon = (status: SystemStatus) => {
  switch (status) {
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

export const getSystemIcon = (type: string) => {
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

export const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(2)}`;
};
