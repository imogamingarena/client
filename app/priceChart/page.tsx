"use client";
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const IMOGamingArena: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  const downloadAsPDF = async () => {
    if (!pageRef.current) return;

    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#0f0c29",
      } as any);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `IMO_Gaming_Arena_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Download Buttons */}
      <div
        style={{
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
          border: "2px solid #00ff88",
        }}
      >
        <button
          onClick={downloadAsPDF}
          style={{
            background: "linear-gradient(to right, #ff0080, #ff8c00)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "transform 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          📄 Download PDF
        </button>
      </div>

      {/* Main Content */}
      <div ref={pageRef} className="download-container">
        <div
          style={{
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            color: "#fff",
            minHeight: "100vh",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "20px",
            }}
          >
            {/* Top Contact Bar */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                padding: "12px 0",
                borderRadius: "10px 10px 0 0",
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                flexWrap: "wrap",
                fontSize: "1rem",
                borderBottom: "2px solid #00ff88",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: "#00ccff" }}>📍</span>
                <span>Mahalunge Gurudata A5 Baner (411045)</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: "#00ccff" }}>📞</span>
                <span>MOB: 8095240976</span>
              </div>
            </div>

            {/* Header */}
            <header
              style={{
                textAlign: "center",
                padding: "30px 0",
                background: "rgba(0, 0, 0, 0.7)",
                borderRadius: "0 0 15px 15px",
                marginBottom: "40px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  color: "#00ff88",
                  textShadow: "0 0 15px #00ff88",
                  marginBottom: "10px",
                }}
              >
                🎮
              </div>
              <h1
                style={{
                  fontSize: "2.8rem",
                  marginBottom: "10px",
                  background: "linear-gradient(to right, #00ff88, #00ccff)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                IMO GAMING ARENA
              </h1>
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "#aaa",
                  marginBottom: "20px",
                }}
              >
                Ultimate Gaming Experience with Premium Setups
              </div>

              {/* Promo Banners */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  margin: "20px auto",
                  maxWidth: "900px",
                }}
              >
                <div
                  style={{
                    padding: "15px",
                    borderRadius: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background: "linear-gradient(to right, #ff0080, #ff8c00)",
                    animation: "pulse 2s infinite",
                  }}
                >
                  <span>🎁</span>
                  <span>
                    SPECIAL OFFER: After 120 minutes, get next 30 minutes FREE!
                  </span>
                </div>
                <div
                  style={{
                    padding: "15px",
                    borderRadius: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background: "linear-gradient(to right, #00ccff, #00ff88)",
                  }}
                >
                  <span>👥</span>
                  <span>
                    REFER A FRIEND: Bring a new customer & get 30 mins FREE on
                    same system!
                  </span>
                </div>
              </div>
            </header>

            {/* Pricing Section */}
            <section
              style={{
                background: "rgba(20, 20, 40, 0.8)",
                borderRadius: "15px",
                padding: "30px",
                marginBottom: "40px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "2.2rem",
                  marginBottom: "30px",
                  color: "#00ccff",
                  position: "relative",
                }}
              >
                GAMING PRICE CHART (in ₹)
                <div
                  style={{
                    content: '""',
                    display: "block",
                    width: "100px",
                    height: "3px",
                    background: "#00ff88",
                    margin: "10px auto",
                  }}
                ></div>
              </h2>

              {/* Price Table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  margin: "20px 0",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        background:
                          "linear-gradient(to right, #302b63, #0f0c29)",
                        padding: "18px",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        border: "1px solid #444",
                      }}
                    >
                      System / Duration
                    </th>
                    <th
                      style={{
                        background:
                          "linear-gradient(to right, #302b63, #0f0c29)",
                        padding: "18px",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        border: "1px solid #444",
                      }}
                    >
                      30 Minutes
                    </th>
                    <th
                      style={{
                        background:
                          "linear-gradient(to right, #302b63, #0f0c29)",
                        padding: "18px",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        border: "1px solid #444",
                      }}
                    >
                      60 Minutes
                    </th>
                    <th
                      style={{
                        background:
                          "linear-gradient(to right, #302b63, #0f0c29)",
                        padding: "18px",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        border: "1px solid #444",
                      }}
                    >
                      90 Minutes
                    </th>
                    <th
                      style={{
                        background:
                          "linear-gradient(to right, #302b63, #0f0c29)",
                        padding: "18px",
                        textAlign: "center",
                        fontSize: "1.2rem",
                        border: "1px solid #444",
                      }}
                    >
                      120 Minutes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={
                      {
                        ":nth-child(even)": {
                          background: "rgba(40, 40, 70, 0.5)",
                        },
                        ":hover": {
                          background: "rgba(0, 255, 136, 0.1)",
                          transform: "scale(1.01)",
                        },
                      } as any
                    }
                  >
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ccff",
                        fontSize: "1.3rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      27" Gaming Setup
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹60
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹80
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹130
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹160{" "}
                      <span
                        style={{
                          background: "#ff0080",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          marginLeft: "5px",
                        }}
                      >
                        +30 FREE
                      </span>
                    </td>
                  </tr>
                  <tr
                    style={
                      {
                        ":nth-child(even)": {
                          background: "rgba(40, 40, 70, 0.5)",
                        },
                        ":hover": {
                          background: "rgba(0, 255, 136, 0.1)",
                          transform: "scale(1.01)",
                        },
                      } as any
                    }
                  >
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ccff",
                        fontSize: "1.3rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      32" Premium Setup
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹70
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹100
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹150
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹200{" "}
                      <span
                        style={{
                          background: "#ff0080",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          marginLeft: "5px",
                        }}
                      >
                        +30 FREE
                      </span>
                    </td>
                  </tr>
                  <tr
                    style={
                      {
                        ":nth-child(even)": {
                          background: "rgba(40, 40, 70, 0.5)",
                        },
                        ":hover": {
                          background: "rgba(0, 255, 136, 0.1)",
                          transform: "scale(1.01)",
                        },
                      } as any
                    }
                  >
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ccff",
                        fontSize: "1.3rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      55" Ultimate Setup
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹80
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹120
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹180
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        color: "#00ff88",
                        fontSize: "1.4rem",
                        padding: "18px",
                        textAlign: "center",
                        border: "1px solid #444",
                      }}
                    >
                      ₹240{" "}
                      <span
                        style={{
                          background: "#ff0080",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          marginLeft: "5px",
                        }}
                      >
                        +30 FREE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Additional Charges Section */}
              <div
                style={{
                  marginTop: "40px",
                  padding: "25px",
                  background: "rgba(30, 30, 60, 0.6)",
                  borderRadius: "12px",
                  border: "2px solid #ffcc00",
                }}
              >
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "1.8rem",
                    color: "#ffcc00",
                    marginBottom: "20px",
                  }}
                >
                  EXTRA REMOTE/CONTROLLER CHARGES
                </h3>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          background:
                            "linear-gradient(to right, #ff8c00, #ff0080)",
                          padding: "15px",
                          textAlign: "center",
                          fontSize: "1.2rem",
                          border: "1px solid #444",
                        }}
                      >
                        System Type
                      </th>
                      <th
                        style={{
                          background:
                            "linear-gradient(to right, #ff8c00, #ff0080)",
                          padding: "15px",
                          textAlign: "center",
                          fontSize: "1.2rem",
                          border: "1px solid #444",
                        }}
                      >
                        27" System
                      </th>
                      <th
                        style={{
                          background:
                            "linear-gradient(to right, #ff8c00, #ff0080)",
                          padding: "15px",
                          textAlign: "center",
                          fontSize: "1.2rem",
                          border: "1px solid #444",
                        }}
                      >
                        32" System
                      </th>
                      <th
                        style={{
                          background:
                            "linear-gradient(to right, #ff8c00, #ff0080)",
                          padding: "15px",
                          textAlign: "center",
                          fontSize: "1.2rem",
                          border: "1px solid #444",
                        }}
                      >
                        55" System
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={
                        {
                          ":nth-child(even)": {
                            background: "rgba(50, 50, 80, 0.5)",
                          },
                        } as any
                      }
                    >
                      <td
                        style={{
                          fontWeight: "bold",
                          color: "#00ccff",
                          padding: "15px",
                          textAlign: "center",
                          border: "1px solid #444",
                        }}
                      >
                        Each extra remote/controller
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: "#00ff88",
                          fontSize: "1.4rem",
                          padding: "15px",
                          textAlign: "center",
                          border: "1px solid #444",
                        }}
                      >
                        ₹40
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: "#00ff88",
                          fontSize: "1.4rem",
                          padding: "15px",
                          textAlign: "center",
                          border: "1px solid #444",
                        }}
                      >
                        ₹50
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: "#00ff88",
                          fontSize: "1.4rem",
                          padding: "15px",
                          textAlign: "center",
                          border: "1px solid #444",
                        }}
                      >
                        ₹60
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    padding: "15px",
                    background: "rgba(255, 0, 128, 0.1)",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ color: "#00ccff", marginRight: "8px" }}>
                    ℹ️
                  </span>
                  <span style={{ color: "#aaa", fontSize: "0.95rem" }}>
                    <strong>Note:</strong> One remote/controller is included
                    with each system. Additional controllers available for
                    multiplayer games.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 0, 128, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 0, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 0, 128, 0); }
        }
        
        @media (max-width: 768px) {
          .contact-item {
            flex-direction: column;
            gap: 5px;
          }
          
          table th, table td {
            padding: 12px 5px !important;
            font-size: 0.9rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          .logo {
            font-size: 2.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 1.8rem !important;
          }
          
          .promo-banner {
            flex-direction: column;
            gap: 8px;
            font-size: 1rem !important;
          }
        }
        
        tr {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default IMOGamingArena;
