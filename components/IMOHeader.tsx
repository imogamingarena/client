"use client";
// IMOHeader.tsx
import React, { useState } from "react";
import "./HeaderCSS.css";
import { NavItem, EventItem, SocialLink } from "@/types/header.types";

const IMOHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>("home");
  const [isTickerPaused, setIsTickerPaused] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { id: "home", label: "Home" },
    { id: "events", label: "Events & Tournaments" },
    { id: "facilities", label: "Facilities" },
    { id: "membership", label: "Membership" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const upcomingEvents: EventItem[] = [
    {
      id: 1,
      game: "VALORANT",
      title: "Open Tournament",
      date: "APR 27",
      prize: "$5,000",
    },
    {
      id: 2,
      game: "CS2",
      title: "Pro League",
      date: "MAY 12",
      prize: "$10,000",
    },
    {
      id: 3,
      game: "League of Legends",
      title: "Champions Cup",
      date: "MAY 25",
      prize: "$15,000",
    },
  ];

  const socialLinks: SocialLink[] = [
    { platform: "discord", icon: "🎮", url: "https://discord.gg/imogaming" },
    { platform: "twitch", icon: "🔴", url: "https://twitch.tv/imogaming" },
    { platform: "twitter", icon: "𝕏", url: "https://twitter.com/imogaming" },
    {
      platform: "instagram",
      icon: "📷",
      url: "https://instagram.com/imogaming",
    },
  ];

  const handleNavClick = (id: string): void => {
    setActiveNav(id);
    setIsMenuOpen(false);
    // In a real app, you would handle navigation here
    console.log(`Navigating to: ${id}`);
  };

  const handleCTAClick = (action: string): void => {
    console.log(`CTA clicked: ${action}`);
    // Handle booking/viewing events
  };

  const handleMobileMenuClose = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="imo-header">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div
          className="event-ticker"
          onMouseEnter={() => setIsTickerPaused(true)}
          onMouseLeave={() => setIsTickerPaused(false)}
          onTouchStart={() => setIsTickerPaused(true)}
          onTouchEnd={() => setIsTickerPaused(false)}
        >
          <span className="ticker-label">NEXT EVENT:</span>
          <div className={`ticker-content ${isTickerPaused ? "paused" : ""}`}>
            {[...upcomingEvents, ...upcomingEvents].map((event, index) => (
              <div key={`${event.id}-${index}`} className="ticker-item">
                <span className="event-game">{event.game}</span>
                <span className="event-title">{event.title}</span>
                <span className="event-date">{event.date}</span>
                <span className="event-prize">Prize: {event.prize}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Social Icons */}
        <div className="mobile-social-links">
          {socialLinks.slice(0, 2).map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label={link.platform}
            >
              <span className="social-icon">{link.icon}</span>
            </a>
          ))}
        </div>

        <div className="desktop-social-links">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label={link.platform}
            >
              <span className="social-icon">{link.icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-icon">
              <div className="trophy-base"></div>
              <div className="trophy-cup"></div>
              <div className="trophy-handles"></div>
            </div>
            <div className="logo-text">
              <h1 className="logo-main">IMO GAMING</h1>
              <h2 className="logo-sub">ARENA</h2>
              <p className="tagline">Where Champions Compete</p>
            </div>

            {/* Mobile Book Now Button */}
            <button
              className="mobile-book-btn"
              onClick={() => handleCTAClick("bookStation")}
              aria-label="Book a station"
            >
              🎮 Book
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
          {/* Mobile Navigation Header */}
          <div className="mobile-nav-header">
            <div className="mobile-logo">IMO</div>
            <button
              className="mobile-close-btn"
              onClick={handleMobileMenuClose}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="nav-items">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
                {activeNav === item.id && (
                  <span className="nav-indicator"></span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile CTA Buttons */}
          <div className="mobile-cta-buttons">
            <button
              className="cta-btn cta-primary"
              onClick={() => handleCTAClick("viewSchedule")}
            >
              View Event Schedule
            </button>
            <button
              className="cta-btn cta-secondary"
              onClick={() => handleCTAClick("bookStation")}
            >
              Book a Station
            </button>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="desktop-cta-buttons">
            <button
              className="cta-btn cta-primary"
              onClick={() => handleCTAClick("viewSchedule")}
            >
              View Event Schedule
            </button>
            <button
              className="cta-btn cta-secondary"
              onClick={() => handleCTAClick("bookStation")}
            >
              Book a Station
            </button>
          </div>

          {/* Mobile Social Links in Menu */}
          <div className="mobile-menu-social-links">
            <p>Follow us:</p>
            <div className="social-links-grid">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={link.platform}
                >
                  <span className="social-icon">{link.icon}</span>
                  <span className="social-label">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
        </button>

        {/* Mobile View Schedule Button */}
        <button
          className="mobile-schedule-btn"
          onClick={() => handleCTAClick("viewSchedule")}
          aria-label="View event schedule"
        >
          📅
        </button>
      </div>

      {/* Quick Access Bar */}
      <div className="quick-access">
        <div className="access-items">
          <span className="access-item">
            <span className="access-icon">🎯</span>
            <span className="access-text">Tournaments</span>
          </span>
          <span className="access-item">
            <span className="access-icon">💪</span>
            <span className="access-text">Training</span>
          </span>
          <span className="access-item">
            <span className="access-icon">👥</span>
            <span className="access-text">Community</span>
          </span>
        </div>

        {/* Mobile Quick Actions */}
        <div className="mobile-quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => handleCTAClick("bookStation")}
          >
            <span>🎮</span>
            <span>Book Now</span>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleNavClick("events")}
          >
            <span>🏆</span>
            <span>Events</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="mobile-nav-dots">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-dot ${activeNav === item.id ? "active" : ""}`}
            onClick={() => handleNavClick(item.id)}
            aria-label={`Go to ${item.label}`}
          />
        ))}
      </div>
    </header>
  );
};

export default IMOHeader;
