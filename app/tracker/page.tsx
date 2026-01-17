"use client";
import React, { useState, useEffect, useRef } from "react";

// ============ UTILITY FUNCTIONS ============
const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

const differenceInSeconds = (dateLeft: Date, dateRight: Date): number => {
  return Math.floor((dateLeft.getTime() - dateRight.getTime()) / 1000);
};

const differenceInMinutes = (dateLeft: Date, dateRight: Date): number => {
  return Math.floor((dateLeft.getTime() - dateRight.getTime()) / 60000);
};

const format = (date: Date, pattern: string): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const yyyy = date.getFullYear().toString();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh24 = date.getHours();
  const hh = pad(((hh24 + 11) % 12) + 1);
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const ampm = hh24 >= 12 ? 'PM' : 'AM';

  switch (pattern) {
    case 'yyyy-MM-dd': return `${yyyy}-${MM}-${dd}`;
    case 'hh:mm a': return `${hh}:${mm} ${ampm.toLowerCase()}`;
    case 'hh:mm:ss a': return `${hh}:${mm}:${ss} ${ampm.toLowerCase()}`;
    case 'dd MMM yyyy': return `${dd} ${months[date.getMonth()]} ${yyyy}`;
    default: return date.toISOString();
  }
};

// ============ TYPES & INTERFACES ============
interface Player {
  id: string;
  name: string;
  phone?: string;
  system: '27"' | '32"' | '55"';
  controllerCount: number;
  startTime: Date;
  endTime?: Date;
  duration: number;
  totalCost: number;
  status: 'active' | 'completed' | 'paused';
  lastPausedTime?: Date;
  pausedDuration: number;
  notes?: string;
  realTime: {
    currentDuration: string;
    currentCost: number;
  };
}

interface SystemPricing {
  '30m': number;
  '60m': number;
  '90m': number;
  '120m': number;
}

interface GamingSystem {
  type: '27"' | '32"' | '55"';
  name: string;
  pricing: SystemPricing;
  extraControllerCharge: number;
  status: 'available' | 'occupied';
  currentPlayerId?: string;
}

interface DailySummary {
  date: string;
  totalEarnings: number;
  totalPlayers: number;
  totalHours: number;
  systemBreakdown: Record<string, { count: number; earnings: number }>;
}

interface DurationOption {
  label: string;
  value: number;
}

interface NewPlayerForm {
  name: string;
  phone: string;
  system: '27"' | '32"' | '55"';
  controllerCount: number;
  customMinutes: number;
  selectedDuration: number;
  notes: string;
}

interface BreakpointStyles {
  mobile: React.CSSProperties;
  tablet: React.CSSProperties;
  desktop: React.CSSProperties;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';
type PlayerStatus = Player['status'];
type SystemType = GamingSystem['type'];

// ============ CONSTANTS ============
const SYSTEMS: GamingSystem[] = [
  {
    type: '27"',
    name: '27" Gaming Setup',
    pricing: { '30m': 40, '60m': 60, '90m': 100, '120m': 120 },
    extraControllerCharge: 40,
    status: 'available'
  },
  {
    type: '32"',
    name: '32" Premium Setup',
    pricing: { '30m': 50, '60m': 80, '90m': 130, '120m': 160 },
    extraControllerCharge: 50,
    status: 'available'
  },
  {
    type: '55"',
    name: '55" Ultimate Setup',
    pricing: { '30m': 60, '60m': 100, '90m': 160, '120m': 200 },
    extraControllerCharge: 60,
    status: 'available'
  }
];

const DURATION_OPTIONS: DurationOption[] = [
  { label: '30 mins', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: 'Custom', value: 0 }
];

// ============ UTILITY FUNCTIONS WITH TYPES ============
const calculateCost = (system: GamingSystem, minutes: number, controllerCount: number): number => {
  let baseCost = 0;
  const totalMinutes = Math.ceil(minutes);
  
  // Calculate base time cost
  if (totalMinutes <= 30) baseCost = system.pricing['30m'];
  else if (totalMinutes <= 60) baseCost = system.pricing['60m'];
  else if (totalMinutes <= 90) baseCost = system.pricing['90m'];
  else if (totalMinutes <= 120) baseCost = system.pricing['120m'];
  else {
    const minutesBeyond120 = totalMinutes - 120;
    if (minutesBeyond120 <= 30) {
      baseCost = system.pricing['120m'];
    } else {
      const chargedMinutes = minutesBeyond120 - 30;
      const halfHourBlocks = Math.ceil(chargedMinutes / 30);
      baseCost = system.pricing['120m'] + (halfHourBlocks * system.pricing['30m']);
    }
  }
  
  const extraControllers = Math.max(0, controllerCount - 1);
  const controllerCost = extraControllers * system.extraControllerCharge;
  
  return baseCost + controllerCost;
};

const secondsToHMS = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const secondsToReadable = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

const formatCurrency = (amount: number): string => `₹${amount.toFixed(2)}`;

const generatePlayerId = (): string => `PL${Date.now().toString().slice(-6)}`;

// ============ RESPONSIVE STYLES WITH TYPES ============
const STYLES = {
  container: {
    mobile: { padding: '12px' },
    tablet: { padding: '16px' },
    desktop: { padding: '20px' }
  } as BreakpointStyles,
  
  grid: {
    main: {
      mobile: { gridTemplateColumns: '1fr', gap: '20px' },
      tablet: { gridTemplateColumns: '1fr 2fr', gap: '25px' },
      desktop: { gridTemplateColumns: '1fr 2fr', gap: '30px' }
    } as BreakpointStyles,
    stats: {
      mobile: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
      tablet: { gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' },
      desktop: { gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }
    } as BreakpointStyles,
    summary: {
      mobile: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
      tablet: { gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' },
      desktop: { gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }
    } as BreakpointStyles
  },
  
  typography: {
    h1: {
      mobile: { fontSize: '1.8rem', lineHeight: '1.2' },
      tablet: { fontSize: '2.5rem', lineHeight: '1.3' },
      desktop: { fontSize: '3rem', lineHeight: '1.3' }
    } as BreakpointStyles,
    h2: {
      mobile: { fontSize: '1.3rem', lineHeight: '1.3' },
      tablet: { fontSize: '1.6rem', lineHeight: '1.4' },
      desktop: { fontSize: '2.2rem', lineHeight: '1.4' }
    } as BreakpointStyles,
    h3: {
      mobile: { fontSize: '1.1rem', lineHeight: '1.3' },
      tablet: { fontSize: '1.3rem', lineHeight: '1.4' },
      desktop: { fontSize: '1.5rem', lineHeight: '1.4' }
    } as BreakpointStyles,
    body: {
      mobile: { fontSize: '0.9rem' },
      tablet: { fontSize: '1rem' },
      desktop: { fontSize: '1rem' }
    } as BreakpointStyles,
    small: {
      mobile: { fontSize: '0.75rem' },
      tablet: { fontSize: '0.85rem' },
      desktop: { fontSize: '0.9rem' }
    } as BreakpointStyles
  },
  
  spacing: {
    xs: { mobile: '4px', tablet: '5px', desktop: '5px' },
    sm: { mobile: '8px', tablet: '10px', desktop: '10px' },
    md: { mobile: '12px', tablet: '15px', desktop: '15px' },
    lg: { mobile: '16px', tablet: '20px', desktop: '20px' },
    xl: { mobile: '20px', tablet: '25px', desktop: '30px' },
    xxl: { mobile: '24px', tablet: '30px', desktop: '40px' }
  } as Record<string, Record<Breakpoint, string>>,
  
  borderRadius: {
    sm: { mobile: '6px', tablet: '7px', desktop: '8px' },
    md: { mobile: '8px', tablet: '10px', desktop: '10px' },
    lg: { mobile: '12px', tablet: '14px', desktop: '15px' },
    xl: { mobile: '16px', tablet: '18px', desktop: '20px' }
  } as Record<string, Record<Breakpoint, string>>
};

// ============ COMPONENT PROPS INTERFACES ============
interface AddPlayerFormProps {
  newPlayer: NewPlayerForm;
  systems: GamingSystem[];
  onNewPlayerChange: (updates: Partial<NewPlayerForm>) => void;
  onAddPlayer: () => void;
  mobile?: boolean;
  onCloseDrawer?: () => void;
}

interface SystemsStatusProps {
  systems: GamingSystem[];
  players: Player[];
  breakpoint: Breakpoint;
}

interface PlayerListTableProps {
  players: Player[];
  onPause: (id: string) => void;
  onEnd: (id: string) => void;
  onResume: (id: string) => void;
  onRemove: (id: string) => void;
  breakpoint: Breakpoint;
}

interface PlayerCardProps {
  player: Player;
  onPause: (id: string) => void;
  onEnd: (id: string) => void;
  onResume: (id: string) => void;
  onRemove: (id: string) => void;
}

interface StatsDashboardProps {
  dailySummary: DailySummary | null;
  activePlayersCount: number;
  totalEarnings: number;
  availableSystemsCount: number;
  totalSystemsCount: number;
  breakpoint: Breakpoint;
}

interface DailySummaryProps {
  dailySummary: DailySummary;
  breakpoint: Breakpoint;
}

// ============ COMPONENTS ============
const AddPlayerForm: React.FC<AddPlayerFormProps> = ({
  newPlayer,
  systems,
  onNewPlayerChange,
  onAddPlayer,
  mobile = false,
  onCloseDrawer
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer();
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'grid',
      gap: STYLES.spacing.md[mobile ? 'mobile' : 'desktop']
    }}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
          Player Name *
        </label>
        <input
          type="text"
          value={newPlayer.name}
          onChange={(e) => onNewPlayerChange({ name: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #00ff88',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          placeholder="Enter player name"
          required
        />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          value={newPlayer.phone}
          onChange={(e) => onNewPlayerChange({ phone: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #00ff88',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          placeholder="Enter phone number"
        />
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: STYLES.spacing.md[mobile ? 'mobile' : 'desktop'] 
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
            System Type
          </label>
          <select
            value={newPlayer.system}
            onChange={(e) => onNewPlayerChange({ system: e.target.value as SystemType })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #00ff88',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          >
            {systems.map(sys => (
              <option key={sys.type} value={sys.type}>
                {sys.type} ({sys.status})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
            Controllers
          </label>
          <select
            value={newPlayer.controllerCount}
            onChange={(e) => onNewPlayerChange({ controllerCount: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #00ff88',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>
                {num} Controller{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
          Duration (Optional)
        </label>
        <select
          value={newPlayer.selectedDuration}
          onChange={(e) => onNewPlayerChange({ selectedDuration: parseInt(e.target.value) })}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            borderRadius: '8px',
            border: '2px solid #00ff88',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        >
          {DURATION_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {newPlayer.selectedDuration === 0 && (
          <input
            type="number"
            value={newPlayer.customMinutes}
            onChange={(e) => onNewPlayerChange({ customMinutes: parseInt(e.target.value) || 0 })}
            min="1"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #00ff88',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter minutes"
          />
        )}
        <div style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
          Pricing is calculated in real-time based on actual play time
        </div>
      </div>
      
      {!mobile && (
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
            Notes (Optional)
          </label>
          <textarea
            value={newPlayer.notes}
            onChange={(e) => onNewPlayerChange({ notes: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #00ff88',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              fontSize: '16px',
              minHeight: '80px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            placeholder="Any special notes..."
          />
        </div>
      )}
      
      <button
        type="submit"
        style={{
          background: 'linear-gradient(to right, #00ff88, #00ccff)',
          color: '#0f0c29',
          border: 'none',
          padding: '15px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          transition: 'transform 0.3s ease',
          marginTop: '10px',
          width: '100%'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🎮 Start Gaming Session
      </button>
    </form>
  );
};

const SystemsStatus: React.FC<SystemsStatusProps> = ({ systems, players, breakpoint }) => (
  <div style={{
    background: 'rgba(20, 20, 40, 0.8)',
    padding: STYLES.spacing.xl[breakpoint],
    borderRadius: STYLES.borderRadius.lg[breakpoint],
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
  }}>
    <h2 style={{
      color: '#00ccff',
      marginBottom: STYLES.spacing.lg[breakpoint],
      borderBottom: '2px solid #00ff88',
      paddingBottom: STYLES.spacing.sm[breakpoint],
      ...STYLES.typography.h2[breakpoint]
    }}>
      Systems Status
    </h2>
    
    <div style={{ display: 'grid', gap: STYLES.spacing.md[breakpoint] }}>
      {systems.map(sys => {
        const currentPlayer = players.find(p => p.id === sys.currentPlayerId);
        return (
          <div
            key={sys.type}
            style={{
              padding: STYLES.spacing.md[breakpoint],
              borderRadius: STYLES.borderRadius.md[breakpoint],
              background: sys.status === 'available' 
                ? 'rgba(0, 255, 136, 0.1)' 
                : 'rgba(255, 0, 128, 0.1)',
              border: `2px solid ${sys.status === 'available' ? '#00ff88' : '#ff0080'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h4 style={{ 
                margin: '0 0 5px 0', 
                color: 'white',
                ...STYLES.typography.h3[breakpoint]
              }}>
                {sys.type}
              </h4>
              <p style={{ 
                margin: '0', 
                color: '#aaa', 
                ...STYLES.typography.small[breakpoint] 
              }}>
                {sys.status === 'available' ? 'Available' : `Occupied by ${currentPlayer?.name}`}
              </p>
            </div>
            <div style={{
              padding: '5px 12px',
              borderRadius: '20px',
              background: sys.status === 'available' ? '#00ff88' : '#ff0080',
              color: '#0f0c29',
              fontWeight: 'bold',
              ...STYLES.typography.small[breakpoint]
            }}>
              {sys.status === 'available' ? 'FREE' : 'BUSY'}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PlayerListTable: React.FC<PlayerListTableProps> = ({ 
  players, 
  onPause, 
  onEnd, 
  onResume, 
  onRemove,
  breakpoint 
}) => {
  if (players.length === 0) {
    return (
      <div style={{
        padding: '50px 20px',
        textAlign: 'center',
        color: '#aaa'
      }}>
        No players found. Start by adding a new player!
      </div>
    );
  }

  const getTableStyle = (): React.CSSProperties => ({
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: breakpoint === 'tablet' ? '800px' : '1000px'
  });

  const getHeaderStyle = (): React.CSSProperties => ({
    padding: breakpoint === 'tablet' ? '12px 8px' : '15px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #00ff88',
    ...STYLES.typography.body[breakpoint]
  });

  const getCellStyle = (): React.CSSProperties => ({
    padding: breakpoint === 'tablet' ? '12px 8px' : '15px'
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={getTableStyle()}>
        <thead>
          <tr style={{
            background: 'linear-gradient(90deg, #302b63, #0f0c29)'
          }}>
            {['Player', 'System', 'Start Time', 'Live Duration', 'Live Cost', 'Status', 'Actions'].map((header, i) => (
              <th key={i} style={getHeaderStyle()}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const system = SYSTEMS.find(s => s.type === player.system);
            if (!system) return null;
            
            const currentCost = player.status === 'active' 
              ? calculateCost(system, player.duration / 60, player.controllerCount)
              : player.totalCost;
            
            return (
              <tr
                key={player.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 136, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <td style={getCellStyle()}>
                  <div>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: 'white',
                      ...STYLES.typography.body[breakpoint]
                    }}>
                      {player.name}
                    </div>
                    {player.phone && (
                      <div style={{ 
                        color: '#aaa', 
                        ...STYLES.typography.small[breakpoint]
                      }}>
                        {player.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td style={getCellStyle()}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '5px',
                    background: player.system === '27"' 
                      ? 'rgba(0, 255, 136, 0.2)' 
                      : player.system === '32"'
                        ? 'rgba(0, 204, 255, 0.2)'
                        : 'rgba(255, 0, 128, 0.2)',
                    color: 'white',
                    ...STYLES.typography.small[breakpoint]
                  }}>
                    {player.system}
                  </div>
                  <div style={{ 
                    ...STYLES.typography.small[breakpoint], 
                    color: '#aaa', 
                    marginTop: '3px' 
                  }}>
                    {player.controllerCount} controller{player.controllerCount > 1 ? 's' : ''}
                  </div>
                </td>
                <td style={{ 
                  ...getCellStyle(), 
                  color: '#aaa',
                  ...STYLES.typography.small[breakpoint]
                }}>
                  {format(new Date(player.startTime), 'hh:mm a')}
                </td>
                <td style={getCellStyle()}>
                  <div style={{ 
                    color: player.status === 'active' ? '#00ff88' : 'white',
                    fontFamily: 'monospace',
                    ...STYLES.typography.body[breakpoint],
                    fontWeight: 'bold'
                  }}>
                    {player.realTime.currentDuration || secondsToHMS(player.duration)}
                  </div>
                  {player.status === 'active' && (
                    <div style={{ 
                      ...STYLES.typography.small[breakpoint], 
                      color: '#aaa' 
                    }}>
                      {secondsToReadable(player.duration)}
                    </div>
                  )}
                </td>
                <td style={getCellStyle()}>
                  <div style={{ 
                    color: player.status === 'active' ? '#00ff88' : '#00ccff', 
                    fontWeight: 'bold',
                    fontSize: breakpoint === 'tablet' ? '1rem' : '1.1rem'
                  }}>
                    {formatCurrency(currentCost)}
                  </div>
                </td>
                <td style={getCellStyle()}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: player.status === 'active'
                      ? 'rgba(0, 255, 136, 0.2)'
                      : player.status === 'paused'
                        ? 'rgba(255, 204, 0, 0.2)'
                        : 'rgba(255, 0, 128, 0.2)',
                    color: player.status === 'active'
                      ? '#00ff88'
                      : player.status === 'paused'
                        ? '#ffcc00'
                        : '#ff0080',
                    fontWeight: 'bold',
                    ...STYLES.typography.small[breakpoint]
                  }}>
                    {player.status.toUpperCase()}
                  </div>
                </td>
                <td style={getCellStyle()}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '6px',
                    flexWrap: 'wrap' as const
                  }}>
                    {player.status === 'active' && (
                      <>
                        <button
                          onClick={() => onPause(player.id)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '5px',
                            border: 'none',
                            background: 'rgba(255, 204, 0, 0.2)',
                            color: '#ffcc00',
                            cursor: 'pointer',
                            ...STYLES.typography.small[breakpoint]
                          }}
                        >
                          ⏸️
                        </button>
                        <button
                          onClick={() => onEnd(player.id)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '5px',
                            border: 'none',
                            background: 'rgba(255, 0, 128, 0.2)',
                            color: '#ff0080',
                            cursor: 'pointer',
                            ...STYLES.typography.small[breakpoint]
                          }}
                        >
                          ✅
                        </button>
                      </>
                    )}
                    {player.status === 'paused' && (
                      <button
                        onClick={() => onResume(player.id)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: 'none',
                          background: 'rgba(0, 255, 136, 0.2)',
                          color: '#00ff88',
                          cursor: 'pointer',
                          ...STYLES.typography.small[breakpoint]
                        }}
                      >
                        ▶️
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to remove this player?')) {
                          onRemove(player.id);
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '5px',
                        border: 'none',
                        background: 'rgba(255, 0, 0, 0.2)',
                        color: '#ff6666',
                        cursor: 'pointer',
                        ...STYLES.typography.small[breakpoint]
                      }}
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onPause, onEnd, onResume, onRemove }) => {
  const system = SYSTEMS.find(s => s.type === player.system);
  if (!system) return null;
  
  const currentCost = player.status === 'active' 
    ? calculateCost(system, player.duration / 60, player.controllerCount)
    : player.totalCost;

  return (
    <div style={{
      background: 'rgba(20, 20, 40, 0.8)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      borderLeft: `4px solid ${
        player.system === '27"' ? '#00ff88' : 
        player.system === '32"' ? '#00ccff' : '#ff0080'
      }`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            color: 'white',
            fontSize: '1.1rem',
            marginBottom: '4px'
          }}>
            {player.name}
          </div>
          {player.phone && (
            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
              📱 {player.phone}
            </div>
          )}
        </div>
        <div style={{
          padding: '4px 12px',
          borderRadius: '20px',
          background: player.status === 'active'
            ? 'rgba(0, 255, 136, 0.2)'
            : player.status === 'paused'
              ? 'rgba(255, 204, 0, 0.2)'
              : 'rgba(255, 0, 128, 0.2)',
          color: player.status === 'active'
            ? '#00ff88'
            : player.status === 'paused'
              ? '#ffcc00'
              : '#ff0080',
          fontWeight: 'bold',
          fontSize: '0.8rem'
        }}>
          {player.status.toUpperCase()}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <div style={{ color: '#00ccff', fontSize: '0.9rem' }}>System</div>
          <div style={{ fontWeight: 'bold', color: 'white' }}>
            {player.system} • {player.controllerCount} controller{player.controllerCount > 1 ? 's' : ''}
          </div>
        </div>
        <div>
          <div style={{ color: '#00ccff', fontSize: '0.9rem' }}>Started</div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
            {format(new Date(player.startTime), 'hh:mm a')}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '4px' }}>Duration</div>
          <div style={{ 
            color: player.status === 'active' ? '#00ff88' : 'white',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {player.realTime.currentDuration || secondsToHMS(player.duration)}
          </div>
        </div>
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '4px' }}>Cost</div>
          <div style={{ 
            color: player.status === 'active' ? '#00ff88' : '#00ccff',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {formatCurrency(currentCost)}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
      }}>
        {player.status === 'active' && (
          <>
            <button
              onClick={() => onPause(player.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 204, 0, 0.2)',
                color: '#ffcc00',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              ⏸️ Pause
            </button>
            <button
              onClick={() => onEnd(player.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 0, 128, 0.2)',
                color: '#ff0080',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              ✅ End
            </button>
          </>
        )}
        {player.status === 'paused' && (
          <button
            onClick={() => onResume(player.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(0, 255, 136, 0.2)',
              color: '#00ff88',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            ▶️ Resume
          </button>
        )}
        <button
          onClick={() => {
            if (confirm('Remove this player?')) {
              onRemove(player.id);
            }
          }}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(255, 0, 0, 0.2)',
            color: '#ff6666',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ❌
        </button>
      </div>
    </div>
  );
};

const StatsDashboard: React.FC<StatsDashboardProps> = ({
  dailySummary,
  activePlayersCount,
  totalEarnings,
  availableSystemsCount,
  totalSystemsCount,
  breakpoint
}) => {
  const stats = [
    { 
      title: 'Players Today', 
      value: dailySummary?.totalPlayers || 0,
      gradient: 'linear-gradient(135deg, #ff0080, #ff8c00)'
    },
    { 
      title: 'Active Now', 
      value: activePlayersCount,
      gradient: 'linear-gradient(135deg, #00ccff, #00ff88)'
    },
    { 
      title: 'Live Earnings', 
      value: formatCurrency(totalEarnings),
      gradient: 'linear-gradient(135deg, #302b63, #0f0c29)'
    },
    { 
      title: 'Systems Free', 
      value: `${availableSystemsCount}/${totalSystemsCount}`,
      gradient: 'linear-gradient(135deg, #ff8c00, #ff0080)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      ...STYLES.grid.stats[breakpoint],
      marginBottom: breakpoint === 'mobile' ? '20px' : '30px'
    }}>
      {stats.map((stat, index) => (
        <div key={index} style={{
          background: stat.gradient,
          padding: breakpoint === 'mobile' ? '15px' : '20px',
          borderRadius: STYLES.borderRadius.md[breakpoint],
          textAlign: 'center' as const
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            fontSize: breakpoint === 'mobile' ? '1rem' : '1.5rem',
            lineHeight: '1.3'
          }}>
            {stat.title}
          </h3>
          <p style={{ 
            fontSize: breakpoint === 'mobile' ? '1.8rem' : '2.5rem', 
            margin: '0', 
            fontWeight: 'bold',
            lineHeight: '1'
          }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const DailySummaryDisplay: React.FC<DailySummaryProps> = ({ dailySummary, breakpoint }) => (
  <div style={{
    background: 'rgba(20, 20, 40, 0.8)',
    padding: STYLES.spacing[breakpoint === 'mobile' ? 'lg' : 'xl'][breakpoint],
    borderRadius: STYLES.borderRadius.lg[breakpoint],
    marginTop: STYLES.spacing.xl[breakpoint],
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
  }}>
    <h2 style={{
      color: '#00ccff',
      marginBottom: STYLES.spacing.lg[breakpoint],
      borderBottom: '2px solid #00ff88',
      paddingBottom: STYLES.spacing.sm[breakpoint],
      ...STYLES.typography.h2[breakpoint]
    }}>
      📊 Today&apos;s Summary ({format(new Date(), 'dd MMM yyyy')})
    </h2>
    
    <div style={{
      display: 'grid',
      ...STYLES.grid.summary[breakpoint],
      marginBottom: STYLES.spacing.lg[breakpoint]
    }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ 
          ...STYLES.typography.small[breakpoint], 
          color: '#aaa', 
          marginBottom: '5px' 
        }}>
          Total Earnings
        </div>
        <div style={{ 
          fontSize: breakpoint === 'mobile' ? '1.5rem' : '2rem', 
          color: '#00ff88', 
          fontWeight: 'bold' 
        }}>
          {formatCurrency(dailySummary.totalEarnings)}
        </div>
      </div>
      
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ 
          ...STYLES.typography.small[breakpoint], 
          color: '#aaa', 
          marginBottom: '5px' 
        }}>
          Players Today
        </div>
        <div style={{ 
          fontSize: breakpoint === 'mobile' ? '1.5rem' : '2rem', 
          color: '#00ccff', 
          fontWeight: 'bold' 
        }}>
          {dailySummary.totalPlayers}
        </div>
      </div>
      
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ 
          ...STYLES.typography.small[breakpoint], 
          color: '#aaa', 
          marginBottom: '5px' 
        }}>
          Total Hours
        </div>
        <div style={{ 
          fontSize: breakpoint === 'mobile' ? '1.5rem' : '2rem', 
          color: '#ff0080', 
          fontWeight: 'bold' 
        }}>
          {dailySummary.totalHours}h
        </div>
      </div>
      
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ 
          ...STYLES.typography.small[breakpoint], 
          color: '#aaa', 
          marginBottom: '5px' 
        }}>
          Avg per Player
        </div>
        <div style={{ 
          fontSize: breakpoint === 'mobile' ? '1.5rem' : '2rem', 
          color: '#ff8c00', 
          fontWeight: 'bold' 
        }}>
          {formatCurrency(dailySummary.totalPlayers > 0 ? 
            Math.round(dailySummary.totalEarnings / dailySummary.totalPlayers) : 0)}
        </div>
      </div>
    </div>
    
    <div style={{ marginTop: STYLES.spacing.lg[breakpoint] }}>
      <h4 style={{ 
        color: '#aaa', 
        marginBottom: STYLES.spacing.md[breakpoint],
        ...STYLES.typography.h3[breakpoint]
      }}>
        System-wise Breakdown
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : 'repeat(3, 1fr)',
        gap: STYLES.spacing.md[breakpoint]
      }}>
        {SYSTEMS.map(sys => {
          const breakdown = dailySummary.systemBreakdown[sys.type] || { count: 0, earnings: 0 };
          return (
            <div
              key={sys.type}
              style={{
                padding: STYLES.spacing.md[breakpoint],
                borderRadius: STYLES.borderRadius.md[breakpoint],
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: 'white',
                  ...STYLES.typography.body[breakpoint]
                }}>
                  {sys.type}
                </div>
                <div style={{ 
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  ...STYLES.typography.small[breakpoint]
                }}>
                  {breakdown.count} players
                </div>
              </div>
              <div style={{ 
                marginTop: '10px',
                fontSize: breakpoint === 'mobile' ? '1.3rem' : '1.5rem',
                color: '#00ccff',
                fontWeight: 'bold'
              }}>
                {formatCurrency(breakdown.earnings)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ============ MAIN COMPONENT ============
const GamingShopTracker: React.FC = () => {
  // State
  const [players, setPlayers] = useState<Player[]>([]);
  const [systems, setSystems] = useState<GamingSystem[]>(SYSTEMS);
  const [newPlayer, setNewPlayer] = useState<NewPlayerForm>({
    name: '',
    phone: '',
    system: '27"',
    controllerCount: 1,
    customMinutes: 0,
    selectedDuration: 60,
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<PlayerStatus | 'all'>('all');
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('gamingPlayers');
    const savedSystems = localStorage.getItem('gamingSystems');
    
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers);
        const playersWithDates: Player[] = parsedPlayers.map((player: Omit<Player, 'startTime' | 'endTime' | 'lastPausedTime'> & {
          startTime: string;
          endTime?: string;
          lastPausedTime?: string;
        }) => ({
          ...player,
          startTime: new Date(player.startTime),
          endTime: player.endTime ? new Date(player.endTime) : undefined,
          lastPausedTime: player.lastPausedTime ? new Date(player.lastPausedTime) : undefined
        }));
        setPlayers(playersWithDates);
      } catch (error) {
        console.error('Error loading players:', error);
      }
    }
    
    if (savedSystems) {
      try {
        setSystems(JSON.parse(savedSystems));
      } catch (error) {
        console.error('Error loading systems:', error);
      }
    }
    
    calculateDailySummary();
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('gamingPlayers', JSON.stringify(players));
    localStorage.setItem('gamingSystems', JSON.stringify(systems));
    calculateDailySummary();
  }, [players, systems]);

  // Real-time update every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      setLastUpdate(now);
      
      setPlayers(prev => prev.map(player => {
        if (player.status === 'active') {
          const system = SYSTEMS.find(s => s.type === player.system);
          if (!system) return player;
          
          const currentTime = new Date();
          let effectiveStartTime = new Date(player.startTime);
          
          if (player.lastPausedTime) {
            effectiveStartTime = new Date(effectiveStartTime.getTime() + 
              (player.pausedDuration + differenceInSeconds(currentTime, player.lastPausedTime)) * 1000);
          } else if (player.pausedDuration > 0) {
            effectiveStartTime = new Date(effectiveStartTime.getTime() + player.pausedDuration * 1000);
          }
          
          const currentDurationSeconds = differenceInSeconds(currentTime, effectiveStartTime);
          const currentDurationMinutes = currentDurationSeconds / 60;
          const currentCost = calculateCost(system, currentDurationMinutes, player.controllerCount);
          
          return {
            ...player,
            duration: Math.floor(differenceInSeconds(currentTime, player.startTime) - player.pausedDuration),
            realTime: {
              currentDuration: secondsToHMS(currentDurationSeconds),
              currentCost: currentCost
            }
          };
        }
        return player;
      }));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function calculateDailySummary() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayPlayers = players.filter(p => 
      format(new Date(p.startTime), 'yyyy-MM-dd') === today
    );

    const summary: DailySummary = {
      date: today,
      totalEarnings: todayPlayers.reduce((sum, p) => {
        if (p.status === 'completed') return sum + p.totalCost;
        if (p.status === 'active') {
          const system = SYSTEMS.find(s => s.type === p.system);
          if (!system) return sum;
          const currentMinutes = p.duration / 60;
          return sum + calculateCost(system, currentMinutes, p.controllerCount);
        }
        return sum;
      }, 0),
      totalPlayers: todayPlayers.length,
      totalHours: Math.round(todayPlayers.reduce((sum, p) => sum + (p.duration || 0), 0) / 3600),
      systemBreakdown: {}
    };

    SYSTEMS.forEach(sys => {
      const sysPlayers = todayPlayers.filter(p => p.system === sys.type);
      const sysEarnings = sysPlayers.reduce((sum, p) => {
        if (p.status === 'completed') return sum + p.totalCost;
        if (p.status === 'active') {
          const currentMinutes = p.duration / 60;
          return sum + calculateCost(sys, currentMinutes, p.controllerCount);
        }
        return sum;
      }, 0);
      
      summary.systemBreakdown[sys.type] = {
        count: sysPlayers.length,
        earnings: sysEarnings
      };
    });

    setDailySummary(summary);
  }

  const handleNewPlayerChange = (updates: Partial<NewPlayerForm>) => {
    setNewPlayer(prev => ({ ...prev, ...updates }));
  };

  const addPlayer = () => {
    if (!newPlayer.name.trim()) {
      alert('Please enter player name');
      return;
    }

    const system = SYSTEMS.find(s => s.type === newPlayer.system);
    if (!system) {
      alert('Invalid system selected');
      return;
    }

    if (system.status === 'occupied') {
      alert('This system is already occupied!');
      return;
    }

    const minutes = newPlayer.selectedDuration === 0 ? newPlayer.customMinutes : newPlayer.selectedDuration;
    if (minutes <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    const startTime = new Date();
    const initialCost = calculateCost(system, minutes, newPlayer.controllerCount);

    const player: Player = {
      id: generatePlayerId(),
      name: newPlayer.name,
      phone: newPlayer.phone || undefined,
      system: newPlayer.system,
      controllerCount: newPlayer.controllerCount,
      startTime: startTime,
      duration: 0,
      totalCost: initialCost,
      status: 'active',
      pausedDuration: 0,
      notes: newPlayer.notes || undefined,
      realTime: {
        currentDuration: '00:00:00',
        currentCost: initialCost
      }
    };

    setPlayers(prev => [player, ...prev]);
    
    setSystems(prev => prev.map(sys => 
      sys.type === newPlayer.system 
        ? { ...sys, status: 'occupied', currentPlayerId: player.id }
        : sys
    ));

    setNewPlayer({
      name: '',
      phone: '',
      system: '27"',
      controllerCount: 1,
      customMinutes: 0,
      selectedDuration: 60,
      notes: ''
    });

    if (breakpoint === 'mobile') {
      setIsDrawerOpen(false);
    }
  };

  const endSession = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const endTime = new Date();
    const system = SYSTEMS.find(s => s.type === player.system);
    if (!system) return;

    const finalDurationMinutes = differenceInMinutes(endTime, player.startTime) - (player.pausedDuration / 60);
    const finalCost = calculateCost(system, finalDurationMinutes, player.controllerCount);

    setPlayers(prev => prev.map(p =>
      p.id === playerId
        ? {
            ...p,
            endTime,
            duration: Math.floor(differenceInSeconds(endTime, p.startTime) - p.pausedDuration),
            totalCost: finalCost,
            status: 'completed',
            realTime: {
              currentDuration: secondsToHMS(Math.floor(differenceInSeconds(endTime, p.startTime) - p.pausedDuration)),
              currentCost: finalCost
            }
          }
        : p
    ));

    setSystems(prev => prev.map(sys =>
      sys.currentPlayerId === playerId
        ? { ...sys, status: 'available', currentPlayerId: undefined }
        : sys
    ));
  };

  const pauseSession = (playerId: string) => {
    setPlayers(prev => prev.map(p =>
      p.id === playerId && p.status === 'active'
        ? { ...p, status: 'paused', lastPausedTime: new Date() }
        : p
    ));
  };

  const resumeSession = (playerId: string) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId && p.status === 'paused' && p.lastPausedTime) {
        const pauseDuration = differenceInSeconds(new Date(), p.lastPausedTime);
        return {
          ...p,
          status: 'active',
          pausedDuration: p.pausedDuration + pauseDuration,
          lastPausedTime: undefined
        };
      }
      return p;
    }));
  };

  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    
    setSystems(prev => prev.map(sys =>
      sys.currentPlayerId === playerId
        ? { ...sys, status: 'available', currentPlayerId: undefined }
        : sys
    ));
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.phone && player.phone.includes(searchTerm));
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && player.status === filter;
  });

  const activePlayersCount = players.filter(p => p.status === 'active').length;
  const totalEarnings = players.reduce((sum, p) => {
    if (p.status === 'completed') return sum + p.totalCost;
    if (p.status === 'active') {
      const system = SYSTEMS.find(s => s.type === p.system);
      if (!system) return sum;
      const currentMinutes = p.duration / 60;
      return sum + calculateCost(system, currentMinutes, p.controllerCount);
    }
    return sum;
  }, 0);

  const availableSystemsCount = systems.filter(s => s.status === 'available').length;
  const totalSystemsCount = systems.length;

  // Mobile Drawer Component
  const MobileDrawer = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      right: isDrawerOpen ? 0 : '-100%',
      width: '85%',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      zIndex: 2000,
      transition: 'right 0.3s ease',
      overflowY: 'auto',
      boxShadow: '-5px 0 20px rgba(0,0,0,0.5)',
      padding: STYLES.spacing.xl[breakpoint]
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: STYLES.spacing.lg[breakpoint]
      }}>
        <h2 style={{
          color: '#00ccff',
          margin: 0,
          ...STYLES.typography.h2[breakpoint]
        }}>
          Add Player
        </h2>
        <button
          onClick={() => setIsDrawerOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff0080',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ✕
        </button>
      </div>
      
      <AddPlayerForm 
        newPlayer={newPlayer}
        systems={systems}
        onNewPlayerChange={handleNewPlayerChange}
        onAddPlayer={addPlayer}
        mobile={true}
        onCloseDrawer={() => setIsDrawerOpen(false)}
      />
    </div>
  );

  // Mobile Floating Action Button
  const MobileFAB = () => (
    <button
      onClick={() => setIsDrawerOpen(true)}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00ff88, #00ccff)',
        color: '#0f0c29',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)',
        fontSize: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      +
    </button>
  );

  // Mobile Header Controls
  const MobileHeaderControls = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: STYLES.spacing.sm[breakpoint],
      marginTop: STYLES.spacing.md[breakpoint]
    }}>
      <div style={{
        display: 'flex',
        gap: STYLES.spacing.sm[breakpoint],
        width: '100%'
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search players..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #00ff88',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as PlayerStatus | 'all')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: '2px solid #00ff88',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '14px',
            minWidth: '100px'
          }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );

  // Desktop Header Controls
  const DesktopHeaderControls = () => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search players..."
        style={{
          padding: '10px 15px',
          borderRadius: '8px',
          border: '2px solid #00ff88',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          fontSize: '14px',
          width: '200px'
        }}
      />
      
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as PlayerStatus | 'all')}
        style={{
          padding: '10px 15px',
          borderRadius: '8px',
          border: '2px solid #00ff88',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          fontSize: '14px'
        }}
      >
        <option value="all">All Players</option>
        <option value="active">Active Only</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#0f0c29',
      color: 'white',
      minHeight: '100vh',
      ...STYLES.container[breakpoint]
    }}>
      {/* Mobile Drawer */}
      {breakpoint === 'mobile' && (
        <>
          <MobileDrawer />
          <MobileFAB />
        </>
      )}

      {/* Mobile overlay for drawer */}
      {isDrawerOpen && breakpoint === 'mobile' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1999,
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        paddingBottom: breakpoint === 'mobile' ? '80px' : '0'
      }}>
        {/* Header */}
        <header style={{
          textAlign: 'center',
          padding: breakpoint === 'mobile' ? '20px 0' : '30px 0',
          marginBottom: breakpoint === 'mobile' ? '20px' : '30px',
          background: 'linear-gradient(135deg, #302b63, #24243e)',
          borderRadius: STYLES.borderRadius.lg[breakpoint],
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}>
          <div style={{
            fontSize: breakpoint === 'mobile' ? '2.5rem' : '3.5rem',
            color: '#00ff88',
            textShadow: '0 0 15px #00ff88',
            marginBottom: '10px'
          }}>
            🎮
          </div>
          <h1 style={{
            ...STYLES.typography.h1[breakpoint],
            marginBottom: '10px',
            background: 'linear-gradient(to right, #00ff88, #00ccff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            padding: breakpoint === 'mobile' ? '0 10px' : '0'
          }}>
            {breakpoint === 'mobile' ? 'Gaming Tracker' : 'Real-Time Gaming Shop Tracker'}
          </h1>
          <p style={{ 
            color: '#aaa', 
            fontSize: breakpoint === 'mobile' ? '1rem' : '1.2rem',
            padding: breakpoint === 'mobile' ? '0 10px' : '0'
          }}>
            {breakpoint === 'mobile' ? 'Live tracking & billing' : 'Live tracking • Real-time billing • Multiple players'}
          </p>
          <div style={{ 
            marginTop: '15px', 
            color: '#00ff88', 
            fontSize: breakpoint === 'mobile' ? '0.8rem' : '0.9rem',
            padding: breakpoint === 'mobile' ? '0 10px' : '0'
          }}>
            Last updated: {format(lastUpdate, 'hh:mm:ss a')}
          </div>
        </header>

        {/* Stats Dashboard */}
        <StatsDashboard 
          dailySummary={dailySummary}
          activePlayersCount={activePlayersCount}
          totalEarnings={totalEarnings}
          availableSystemsCount={availableSystemsCount}
          totalSystemsCount={totalSystemsCount}
          breakpoint={breakpoint}
        />

        {/* Main Content Grid */}
        {breakpoint !== 'mobile' && (
          <div style={{
            display: 'grid',
            ...STYLES.grid.main[breakpoint],
            marginBottom: STYLES.spacing.xl[breakpoint]
          }}>
            {/* Left Column: Add Player & Systems */}
            <div>
              {/* Add New Player Form */}
              <div style={{
                background: 'rgba(20, 20, 40, 0.8)',
                padding: STYLES.spacing.xl[breakpoint],
                borderRadius: STYLES.borderRadius.lg[breakpoint],
                marginBottom: STYLES.spacing.xl[breakpoint],
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}>
                <h2 style={{
                  color: '#00ccff',
                  marginBottom: STYLES.spacing.lg[breakpoint],
                  borderBottom: '2px solid #00ff88',
                  paddingBottom: STYLES.spacing.sm[breakpoint],
                  ...STYLES.typography.h2[breakpoint]
                }}>
                  Add New Player
                </h2>
                <AddPlayerForm 
                  newPlayer={newPlayer}
                  systems={systems}
                  onNewPlayerChange={handleNewPlayerChange}
                  onAddPlayer={addPlayer}
                />
              </div>

              <SystemsStatus 
                systems={systems}
                players={players}
                breakpoint={breakpoint}
              />
            </div>

            {/* Right Column: Player List */}
            <div>
              {/* Player List Header */}
              <div style={{
                background: 'rgba(20, 20, 40, 0.8)',
                padding: STYLES.spacing.lg[breakpoint],
                borderRadius: `${STYLES.borderRadius.lg[breakpoint]} ${STYLES.borderRadius.lg[breakpoint]} 0 0`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <h2 style={{
                    color: '#00ccff',
                    margin: '0',
                    ...STYLES.typography.h2[breakpoint]
                  }}>
                    Player Sessions
                  </h2>
                  <p style={{ 
                    margin: '5px 0 0 0', 
                    color: '#aaa',
                    ...STYLES.typography.small[breakpoint]
                  }}>
                    Total: {players.length} players • Active: {activePlayersCount} • Live Updates
                  </p>
                </div>
                
                <DesktopHeaderControls />
              </div>

              {/* Player List Table */}
              <div style={{
                background: 'rgba(20, 20, 40, 0.6)',
                borderRadius: `0 0 ${STYLES.borderRadius.lg[breakpoint]} ${STYLES.borderRadius.lg[breakpoint]}`,
                overflow: 'hidden'
              }}>
                <PlayerListTable 
                  players={filteredPlayers} 
                  onPause={pauseSession}
                  onEnd={endSession}
                  onResume={resumeSession}
                  onRemove={removePlayer}
                  breakpoint={breakpoint}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Player List View */}
        {breakpoint === 'mobile' && (
          <div>
            <MobileHeaderControls />
            
            <div style={{
              marginTop: STYLES.spacing.lg[breakpoint],
              display: 'flex',
              flexDirection: 'column',
              gap: STYLES.spacing.md[breakpoint]
            }}>
              {filteredPlayers.length === 0 ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#aaa',
                  background: 'rgba(20, 20, 40, 0.8)',
                  borderRadius: STYLES.borderRadius.lg[breakpoint]
                }}>
                  No players found. Tap + to add a new player!
                </div>
              ) : (
                filteredPlayers.map(player => (
                  <PlayerCard 
                    key={player.id}
                    player={player}
                    onPause={pauseSession}
                    onEnd={endSession}
                    onResume={resumeSession}
                    onRemove={removePlayer}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Daily Summary */}
        {dailySummary && (
          <DailySummaryDisplay 
            dailySummary={dailySummary}
            breakpoint={breakpoint}
          />
        )}

        {/* Footer */}
        <footer style={{
          marginTop: STYLES.spacing.xl[breakpoint],
          padding: STYLES.spacing.lg[breakpoint],
          textAlign: 'center',
          color: '#aaa',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          ...STYLES.typography.small[breakpoint]
        }}>
          <p>IMO Gaming Arena • Real-Time Player Tracking System</p>
          <p style={{ marginTop: '5px' }}>
            All data saved automatically • Live updates every second
          </p>
        </footer>
      </div>
    </div>
  );
};

export default GamingShopTracker;