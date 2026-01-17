export type SystemStatus = "active" | "paused" | "completed" | "available";

export interface System {
  id: string;
  type: string;
  name: string;
  description: string;
  playerName: string;
  playerPhone: string | undefined;
  startTime: Date;
  controllerCount: number;
  status: SystemStatus;
  totalAmount: number;
  duration: number;
  lastPausedTime?: Date;
  pausedDuration: number;
  ratePerSecond: number;
  hourlyRate: number;
  maxControllers: number;
}

export interface SystemStatusProps {
  system: System;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onEnd?: (id: string) => void;
  onCancel?: (id: string) => void;
  onEdit?: (system: System) => void;
  onDelete?: (id: string) => void;
}
