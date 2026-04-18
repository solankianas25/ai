'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero';
import SubmitTab from '@/components/submit-tab';
import TrackTab from '@/components/track-tab';
import StatsTab from '@/components/stats-tab';
import Footer from '@/components/footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div>
      <Navbar />
      <div className="main-area">
        <div className="wrap">
          {/* Hero Section */}
          <HeroSection onTabChange={setActiveTab} />

          {/* City Development Highlights */}
          <div className="section-label">City development highlights</div>
          <div className="dev-grid">
            <div className="dev-card">
              <div className="dev-icon" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>🛣️</div>
              <div className="dev-title">Smart roads project</div>
              <div className="dev-body">340 km resurfaced under Smart City Mission 2023–24. GPS-tagged pothole detection now active citywide.</div>
            </div>
            <div className="dev-card">
              <div className="dev-icon" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>💧</div>
              <div className="dev-title">24×7 water supply</div>
              <div className="dev-body">Continuous supply to 18 of 19 zones. 19th zone upgrade underway under AMRUT 2.0 with ₹240 crore investment.</div>
            </div>
            <div className="dev-card">
              <div className="dev-icon" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>☀️</div>
              <div className="dev-title">Solar street lights</div>
              <div className="dev-body">12,000+ solar LED street lights installed citywide, delivering 40% reduction in electricity expenditure.</div>
            </div>
            <div className="dev-card">
              <div className="dev-icon" style={{ background: '#EEEDFE', color: '#534AB7' }}>💻</div>
              <div className="dev-title">Digital governance</div>
              <div className="dev-body">700+ citizen services available on eVadodara portal. 98% of property tax collection is now fully digital.</div>
            </div>
            <div className="dev-card">
              <div className="dev-icon" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>🏆</div>
              <div className="dev-title">Swachh Bharat rank</div>
              <div className="dev-body">Ranked among top 10 cleanest cities in Gujarat. ODF++ certified with Green Star municipal rating achieved.</div>
            </div>
            <div className="dev-card">
              <div className="dev-icon" style={{ background: '#FAECE7', color: '#993C1D' }}>🏛️</div>
              <div className="dev-title">Heritage conservation</div>
              <div className="dev-body">Laxmi Vilas Palace, Kirti Mandir, Sayaji Baug and 40+ heritage structures actively restored and maintained.</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'submit' ? 'active' : ''}`}
              onClick={() => setActiveTab('submit')}
            >
              Submit complaint
            </div>
            <div 
              className={`tab ${activeTab === 'track' ? 'active' : ''}`}
              onClick={() => setActiveTab('track')}
            >
              Track complaint
            </div>
            <div 
              className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Public statistics
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'submit' && <SubmitTab />}
          {activeTab === 'track' && <TrackTab />}
          {activeTab === 'stats' && <StatsTab />}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        .main-area {
          padding: 24px 0 0;
        }

        .wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 12px;
        }

        .dev-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }

        .dev-card {
          background: white;
          border: 0.5px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px;
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .dev-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .dev-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .dev-title {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .dev-body {
          font-size: 12px;
          color: var(--text2);
          line-height: 1.6;
        }

        .tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid var(--off2);
          margin-bottom: 0;
        }

        .tab {
          padding: 10px 18px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: var(--text3);
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: all 0.15s;
        }

        .tab.active {
          color: var(--navy);
          border-bottom-color: var(--saffron);
        }

        .tab:hover:not(.active) {
          color: var(--text);
        }

        @media (max-width: 900px) {
          .dev-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .dev-grid {
            grid-template-columns: 1fr;
          }
          .tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
