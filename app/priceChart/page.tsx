"use client";
import React, { useRef, useState, useCallback, memo, useMemo } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// ============ TYPES & INTERFACES ============
interface Pricing {
  "30m": number;
  "60m": number;
  "90m": number;
  "120m": number;
}

interface GamingSetup {
  id: string;
  name: string;
  size: string;
  pricing: Pricing;
}

interface ExtraCharge {
  system: string;
  charge: number;
}

interface PDFOptions {
  scale: number;
  useCORS: boolean;
  logging: boolean;
  backgroundColor: string;
}

// ============ CONSTANTS & CONFIG ============
const GAMING_SETUPS: GamingSetup[] = [
  {
    id: "setup-24",
    name: "PC Setup",
    size: "24\"",
    pricing: { "30m": 50, "60m": 80, "90m": 120, "120m": 150 }
  },
  {
    id: "setup-32",
    name: "PS Setup",
    size: "32\"",
    pricing: { "30m": 60, "60m": 100, "90m": 150, "120m": 180 }
  },
  {
    id: "setup-55",
    name: "PS Setup",
    size: "55\"",
    pricing: { "30m": 70, "60m": 120, "90m": 180, "120m": 220 }
  }
];

const EXTRA_CHARGES: ExtraCharge[] = [
  { system: '24" System', charge: 40 },
  { system: '32" System', charge: 50 },
  { system: '55" System', charge: 60 }
];

const DURATIONS = ["30m", "60m", "90m", "120m"] as const;
type Duration = typeof DURATIONS[number];

const DURATION_LABELS: Record<Duration, string> = {
  "30m": "30 Minutes",
  "60m": "60 Minutes",
  "90m": "90 Minutes",
  "120m": "120 Minutes"
};

// ============ STYLES ============
const STYLES = {
  colors: {
    primary: "#00ff88",
    secondary: "#00ccff",
    accent: "#ff0080",
    accent2: "#ff8c00",
    background: "#0f0c29",
    cardBg: "rgba(20, 20, 40, 0.8)",
    text: {
      light: "#ffffff",
      muted: "#aaaaaa",
      dark: "#333333"
    }
  },
  gradients: {
    main: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    header: "linear-gradient(90deg, #00ff88 0%, #00ccff 100%)",
    button: "linear-gradient(90deg, #ff0080 0%, #ff8c00 100%)",
    promo1: "linear-gradient(90deg, #ff0080 0%, #ff8c00 100%)",
    promo2: "linear-gradient(90deg, #00ccff 0%, #00ff88 100%)",
    tableHeader: "linear-gradient(90deg, #302b63 0%, #0f0c29 100%)"
  },
  shadows: {
    card: "0 10px 25px rgba(0, 0, 0, 0.3)",
    button: "0 4px 15px rgba(0, 0, 0, 0.2)",
    glow: "0 0 15px rgba(0, 255, 136, 0.5)"
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: { fontSize: "2.8rem", fontWeight: 700 },
    h2: { fontSize: "2.2rem", fontWeight: 600 },
    h3: { fontSize: "1.8rem", fontWeight: 600 },
    body: { fontSize: "1rem", lineHeight: 1.6 }
  },
  spacing: {
    xs: "5px",
    sm: "10px",
    md: "15px",
    lg: "20px",
    xl: "30px",
    xxl: "40px"
  },
  borderRadius: {
    sm: "8px",
    md: "10px",
    lg: "15px",
    xl: "20px"
  },
  breakpoints: {
    mobile: "768px",
    tablet: "1024px"
  }
} as const;

// ============ UTILITY FUNCTIONS ============
const formatCurrency = (amount: number): string => `₹${amount}`;
const getTodayDate = (): string => new Date().toISOString().split('T')[0];

// ============ COMPONENTS ============
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button = memo<ButtonProps>(({ 
  children, 
  isLoading, 
  variant = 'primary',
  disabled,
  style,
  ...props 
}) => {
  const baseStyle: React.CSSProperties = {
    background: variant === 'primary' ? STYLES.gradients.button : STYLES.gradients.promo2,
    color: STYLES.colors.text.light,
    border: 'none',
    padding: `${STYLES.spacing.md} ${STYLES.spacing.xl}`,
    borderRadius: STYLES.borderRadius.sm,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: STYLES.spacing.sm,
    opacity: disabled ? 0.6 : 1,
    ...style
  };

  return (
    <button
      style={baseStyle}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = STYLES.shadows.button;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      {...props}
    >
      {isLoading ? '⏳ Generating...' : children}
    </button>
  );
});
Button.displayName = 'Button';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card = memo<CardProps>(({ children, style }) => (
  <div style={{
    background: STYLES.colors.cardBg,
    borderRadius: STYLES.borderRadius.lg,
    padding: STYLES.spacing.xl,
    marginBottom: STYLES.spacing.xxl,
    boxShadow: STYLES.shadows.card,
    ...style
  }}>
    {children}
  </div>
));
Card.displayName = 'Card';

const ContactBar = memo(() => (
  <div style={{
    background: "rgba(0, 0, 0, 0.8)",
    padding: `${STYLES.spacing.sm} 0`,
    borderRadius: `${STYLES.borderRadius.md} ${STYLES.borderRadius.md} 0 0`,
    display: "flex",
    justifyContent: "center",
    gap: STYLES.spacing.xl,
    flexWrap: "wrap",
    fontSize: "1rem",
    borderBottom: `2px solid ${STYLES.colors.primary}`
  }}>
    {[
      { icon: "📍", text: "Mahalunge Gurudata A5 Baner (411045)" },
      { icon: "📞", text: "MOB: 8095240976" }
    ].map((item, index) => (
      <div key={index} style={{ display: "flex", alignItems: "center", gap: STYLES.spacing.sm }}>
        <span style={{ color: STYLES.colors.secondary }}>{item.icon}</span>
        <span>{item.text}</span>
      </div>
    ))}
  </div>
));
ContactBar.displayName = 'ContactBar';

interface PromoBannerProps {
  icon: string;
  text: string;
  gradient: string;
}

const PromoBanner = memo<PromoBannerProps>(({ icon, text, gradient }) => (
  <div style={{
    padding: STYLES.spacing.lg,
    borderRadius: STYLES.borderRadius.md,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: STYLES.spacing.sm,
    background: gradient,
    animation: gradient === STYLES.gradients.promo1 ? "pulse 2s infinite" : "none"
  }}>
    <span>{icon}</span>
    <span>{text}</span>
  </div>
));
PromoBanner.displayName = 'PromoBanner';

interface PriceTableRowProps {
  setup: GamingSetup;
}

const PriceTableRow = memo<PriceTableRowProps>(({ setup }) => (
  <tr className="price-table-row">
    <td style={{
      fontWeight: "bold",
      color: STYLES.colors.secondary,
      fontSize: "1.3rem",
      padding: "18px",
      textAlign: "center",
      border: "1px solid #444",
      whiteSpace: "nowrap"
    }}>
      {setup.name}  &#40;{ setup.size}&#41;
    </td>
    {DURATIONS.map((duration) => (
      <td key={duration} style={{
        fontWeight: "bold",
        color: STYLES.colors.primary,
        fontSize: "1.4rem",
        padding: "18px",
        textAlign: "center",
        border: "1px solid #444",
        position: "relative"
      }}>
        {formatCurrency(setup.pricing[duration])}
        {/* {duration === "120m" && (
          <span style={{
            background: STYLES.colors.accent,
            color: STYLES.colors.text.light,
            padding: "4px 8px",
            borderRadius: "20px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            marginLeft: "8px",
            display: "inline-block"
          }}>
            +30 FREE
          </span>
        )} */}
      </td>
    ))}
  </tr>
));
PriceTableRow.displayName = 'PriceTableRow';

const PricingTable = memo(() => {
  const tableHeaderStyle: React.CSSProperties = {
    background: STYLES.gradients.tableHeader,
    padding: "18px",
    textAlign: "center",
    fontSize: "1.2rem",
    border: "1px solid #444"
  };

  return (
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      margin: `${STYLES.spacing.xl} 0`
    }}>
      <thead>
        <tr>
          <th style={tableHeaderStyle}>System / Duration</th>
          {DURATIONS.map((duration) => (
            <th key={duration} style={tableHeaderStyle}>
              {DURATION_LABELS[duration]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {GAMING_SETUPS.map((setup) => (
          <PriceTableRow key={setup.id} setup={setup} />
        ))}
      </tbody>
    </table>
  );
});
PricingTable.displayName = 'PricingTable';

const ExtraChargesSection = memo(() => (
  <div style={{
    marginTop: STYLES.spacing.xxl,
    padding: "25px",
    background: "rgba(30, 30, 60, 0.6)",
    borderRadius: "12px",
    border: "2px solid #ffcc00"
  }}>
    <h3 style={{
      textAlign: "center",
      fontSize: "1.8rem",
      color: "#ffcc00",
      marginBottom: "20px"
    }}>
      EXTRA REMOTE/CONTROLLER CHARGES
    </h3>

    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      margin: "20px 0"
    }}>
      <thead>
        <tr>
          <th style={{
            background: "linear-gradient(to right, #ff8c00, #ff0080)",
            padding: "15px",
            textAlign: "center",
            fontSize: "1.2rem",
            border: "1px solid #444"
          }}>
            System Type
          </th>
          {EXTRA_CHARGES.map((item) => (
            <th key={item.system} style={{
              background: "linear-gradient(to right, #ff8c00, #ff0080)",
              padding: "15px",
              textAlign: "center",
              fontSize: "1.2rem",
              border: "1px solid #444"
            }}>
              {item.system}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{
            fontWeight: "bold",
            color: STYLES.colors.secondary,
            padding: "15px",
            textAlign: "center",
            border: "1px solid #444"
          }}>
            Each extra remote/controller
          </td>
          {EXTRA_CHARGES.map((item) => (
            <td key={item.system} style={{
              fontWeight: "bold",
              color: STYLES.colors.primary,
              fontSize: "1.4rem",
              padding: "15px",
              textAlign: "center",
              border: "1px solid #444"
            }}>
              {formatCurrency(item.charge)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>

    <div style={{
      textAlign: "center",
      marginTop: "20px",
      padding: "15px",
      background: "rgba(255, 0, 128, 0.1)",
      borderRadius: "10px"
    }}>
      <span style={{ color: STYLES.colors.secondary, marginRight: "8px" }}>ℹ️</span>
      <span style={{ color: STYLES.colors.text.muted, fontSize: "0.95rem" }}>
        <strong>Note:</strong> One remote/controller is included with each system. 
        Additional controllers available for multiplayer games.
      </span>
    </div>
  </div>
));
ExtraChargesSection.displayName = 'ExtraChargesSection';

interface DownloadButtonContainerProps {
  onDownload: () => void;
  isLoading: boolean;
}

const DownloadButtonContainer = memo<DownloadButtonContainerProps>(({ onDownload, isLoading }) => (
  <div style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
    display: "flex",
    gap: "10px",
    background: "rgba(20, 20, 40, 0.9)",
    padding: "10px 15px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    border: `2px solid ${STYLES.colors.primary}`,
    backdropFilter: "blur(10px)"
  }}>
    <Button
      onClick={onDownload}
      isLoading={isLoading}
      aria-label={isLoading ? "Generating PDF document" : "Download PDF document"}
    >
      📄 Download PDF
    </Button>
  </div>
));
DownloadButtonContainer.displayName = 'DownloadButtonContainer';

// ============ MAIN COMPONENT ============
const IMOGamingArena: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  const generatePDF = useCallback(async () => {
    if (!pageRef.current || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      const options: PDFOptions = {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: STYLES.colors.background
      };

      const canvas = await html2canvas(pageRef.current, options);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Add additional pages if needed
      let heightLeft = imgHeight;
      let position = 0;

      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(`IMO_Gaming_Arena_${getTodayDate()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [isGeneratingPDF]);

  const memoizedPromoBanners = useMemo(() => [
    {
      icon: "🎁",
      text: "SPECIAL OFFER: After 180 minutes, get next 30 minutes FREE!",
      gradient: STYLES.gradients.promo1
    },
    // {
    //   icon: "👥",
    //   text: "REFER A FRIEND: Bring a new customer & get 30 mins FREE on same system!",
    //   gradient: STYLES.gradients.promo2
    // }
  ], []);

  return (
    <div style={{ fontFamily: STYLES.typography.fontFamily }}>
      <DownloadButtonContainer 
        onDownload={generatePDF} 
        isLoading={isGeneratingPDF} 
      />

      {/* Main Content for PDF */}
      <div ref={pageRef} style={{ WebkitPrintColorAdjust: "exact" }}>
        <div style={{
          background: STYLES.gradients.main,
          color: STYLES.colors.text.light,
          minHeight: "100vh",
          padding: STYLES.spacing.xl
        }}>
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: STYLES.spacing.xl
          }}>
            <ContactBar />

            {/* Header Section */}
            <header style={{
              textAlign: "center",
              padding: `${STYLES.spacing.xl} 0`,
              background: "rgba(0, 0, 0, 0.7)",
              borderRadius: `0 0 ${STYLES.borderRadius.lg} ${STYLES.borderRadius.lg}`,
              marginBottom: STYLES.spacing.xxl,
              boxShadow: STYLES.shadows.card
            }}>
              <div style={{
                fontSize: "3.5rem",
                color: STYLES.colors.primary,
                textShadow: STYLES.shadows.glow,
                marginBottom: STYLES.spacing.sm
              }}>
                🎮
              </div>
              <h1 style={{
                fontSize: STYLES.typography.h1.fontSize,
                fontWeight: STYLES.typography.h1.fontWeight,
                marginBottom: STYLES.spacing.sm,
                background: STYLES.gradients.header,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                IMO GAMING ARENA
              </h1>
              <div style={{
                fontSize: "1.2rem",
                color: STYLES.colors.text.muted,
                marginBottom: STYLES.spacing.xl
              }}>
                Ultimate Gaming Experience with Premium Setups
              </div>

              {/* Promo Banners */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: STYLES.spacing.lg,
                margin: `${STYLES.spacing.xl} auto`,
                maxWidth: "900px"
              }}>
                {memoizedPromoBanners.map((banner, index) => (
                  <PromoBanner key={index} {...banner} />
                ))}
              </div>
            </header>

            {/* Pricing Section */}
            <Card>
              <h2 style={{
                textAlign: "center",
                fontSize: STYLES.typography.h2.fontSize,
                fontWeight: STYLES.typography.h2.fontWeight,
                marginBottom: STYLES.spacing.xl,
                color: STYLES.colors.secondary,
                position: "relative"
              }}>
                GAMING PRICE CHART (in ₹)
                <div style={{
                  width: "100px",
                  height: "3px",
                  background: STYLES.colors.primary,
                  margin: `${STYLES.spacing.sm} auto`,
                  borderRadius: "2px"
                }}></div>
              </h2>

              <PricingTable />
              <ExtraChargesSection />
            </Card>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% { 
            box-shadow: 0 0 0 0 rgba(255, 0, 128, 0.7); 
          }
          70% { 
            box-shadow: 0 0 0 15px rgba(255, 0, 128, 0); 
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(255, 0, 128, 0); 
          }
        }

        .price-table-row {
          transition: all 0.3s ease;
        }

        .price-table-row:nth-child(even) {
          background: rgba(40, 40, 70, 0.5);
        }

        .price-table-row:hover {
          background: rgba(0, 255, 136, 0.15);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          table th, 
          table td {
            padding: 12px 8px !important;
            font-size: 0.9rem !important;
          }

          h1 {
            font-size: 2rem !important;
          }

          .download-button-container {
            bottom: 10px;
            right: 10px;
            left: 10px;
            justify-content: center;
          }

          .promo-banner {
            font-size: 1rem !important;
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.6rem !important;
          }

          h2 {
            font-size: 1.4rem !important;
          }

          h3 {
            font-size: 1.2rem !important;
          }

          .contact-bar {
            flex-direction: column;
            gap: 10px !important;
          }
        }

        /* Print styles */
        @media print {
          .download-button-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default IMOGamingArena;