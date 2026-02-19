import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { getTrackedSports } from '../lib/oddsApi';

export default function DailyPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [bankroll, setBankroll] = useState(100);
  const [unitSize, setUnitSize] = useState(5);
  const [sportsChecked, setSportsChecked] = useState([]);
  const [trackedSports, setTrackedSports] = useState([]);

  useEffect(() => {
    const savedBankroll = localStorage.getItem('bankroll');
    const savedUnit = localStorage.getItem('unitSize');
    if (savedBankroll) setBankroll(parseFloat(savedBankroll));
    if (savedUnit) setUnitSize(parseFloat(savedUnit));
    
    setTrackedSports(getTrackedSports());
    loadPicks();
  }, []);

  async function loadPicks() {
    setLoading(true);
    try {
      let response = await fetch('/data/picks.json');
      if (!response.ok) response = await fetch('./data/picks.json');
      
      if (response.ok) {
        const data = await response.json();
        setPicks(data.picks || []);
        setLastUpdated(data.timestamp);
        setSportsChecked(data.sportsChecked || []);
      } else {
        throw new Error('Failed to load data file');
      }
    } catch (e) {
      const cached = localStorage.getItem('cachedPicks');
      if (cached) {
        const data = JSON.parse(cached);
        setPicks(data.picks || []);
        setLastUpdated(data.timestamp);
        setSportsChecked(data.sportsChecked || []);
      } else {
        setPicks([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No data yet';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timeSince = (dateStr) => {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor(diff / 60000);
    if (mins < 5) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours/24)}d ago`;
  };

  const totalRisk = picks.reduce((sum, p) => sum + (p.units * unitSize), 0);

  const confidenceColor = (conf) => {
    if (conf === 'high') return '#00f3ff';
    if (conf === 'medium') return '#ff6b35';
    return '#e94560';
  };

  const addToTracker = (pick) => {
    const bet = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      sport: pick.sport,
      game: pick.game,
      pick: pick.pick,
      odds: pick.odds,
      betAmount: (pick.units * unitSize).toFixed(2),
      result: 'pending'
    };
    
    const existing = JSON.parse(localStorage.getItem('bets') || '[]');
    existing.unshift(bet);
    localStorage.setItem('bets', JSON.stringify(existing));
    
    alert(`Added to tracker: ${pick.pick} - $${bet.betAmount}`);
  };

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#0a0e27',
      minHeight: '100vh',
      color: '#ccd6f6'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
      <header style={{ 
        borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
        paddingBottom: '30px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f3ff 0%, #0066ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            ◈
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '32px',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #00f3ff, #0066ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              ROCi SPORTS
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#8892b0', fontSize: '14px', fontFamily: 'monospace' }}>
              AUTOMATED BETTING INTELLIGENCE
            </p>
          </div>
        </div>
        <p style={{ margin: '10px 0 0 0', color: '#8892b0', fontSize: '13px', fontFamily: 'monospace' }}>
          LAST UPDATE: {timeSince(lastUpdated).toUpperCase()} • NEXT: 10:00 & 17:00 ET
        </p>
      </header>

      <Nav />

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {[
          { label: 'BANKROLL', value: `$${bankroll.toFixed(2)}`, color: '#00f3ff' },
          { label: 'UNIT SIZE', value: `$${unitSize}`, color: '#64ffda' },
          { label: 'TODAY\'S RISK', value: `$${totalRisk.toFixed(2)}`, color: totalRisk > unitSize * 3 ? '#e94560' : '#00f3ff' },
          { label: 'ACTIVE PICKS', value: picks.length, color: '#bd34fe' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(10, 25, 47, 0.7)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${stat.color}, transparent)`
            }} />
            <p style={{ 
              margin: '0 0 10px 0', 
              color: '#8892b0', 
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '1px'
            }}>
              {stat.label}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: '700',
              color: stat.color,
              fontFamily: 'monospace'
            }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tracked Sports */}
      <div style={{
        background: 'rgba(10, 25, 47, 0.5)',
        padding: '20px 25px',
        borderRadius: '12px',
        border: '1px solid rgba(0, 243, 255, 0.1)',
        marginBottom: '30px'
      }}>
        <p style={{ margin: '0 0 10px 0', color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>
          TRACKING {trackedSports.length} SPORTS
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {trackedSports.map((sport, i) => (
            <span key={sport.key} style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: 'rgba(0, 243, 255, 0.1)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
              color: '#00f3ff',
              fontSize: '12px',
              fontFamily: 'monospace',
              fontWeight: '500'
            }}>
              {sport.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          background: 'rgba(10, 25, 47, 0.5)',
          borderRadius: '20px',
          border: '1px solid rgba(0, 243, 255, 0.1)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(0, 243, 255, 0.1)',
            borderTop: '3px solid #00f3ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#00f3ff', fontFamily: 'monospace' }}>ANALYZING MARKETS...</p>
          <p style={{ color: '#8892b0', fontSize: '13px' }}>Scanning {trackedSports.length} sports for +EV plays</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : picks.length === 0 ? (
        <div style={{ 
          background: 'rgba(10, 25, 47, 0.5)',
          padding: '50px',
          borderRadius: '20px',
          border: '1px solid rgba(0, 243, 255, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#00f3ff', fontSize: '18px', marginBottom: '10px' }}>NO PICKS AVAILABLE</p>
          <p style={{ color: '#8892b0', fontSize: '14px' }}>
            System updates at 10:00 & 17:00 ET daily
          </p>
        </div>
      ) : (
        <>
          <h2 style={{ 
            color: '#ccd6f6',
            fontSize: '14px',
            fontFamily: 'monospace',
            letterSpacing: '2px',
            marginBottom: '25px',
            textTransform: 'uppercase'
          }}>
            Top Value Opportunities
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            {picks.map((pick, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
                padding: '30px',
                borderRadius: '20px',
                border: `1px solid ${confidenceColor(pick.confidence)}40`,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Glow effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${confidenceColor(pick.confidence)}, transparent)`
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        background: `${confidenceColor(pick.confidence)}20`,
                        color: confidenceColor(pick.confidence),
                        border: `1px solid ${confidenceColor(pick.confidence)}40`,
                        letterSpacing: '1px'
                      }}>
                        {pick.confidence.toUpperCase()}
                      </span>
                      <span style={{ color: '#8892b0', fontSize: '12px', fontFamily: 'monospace' }}>
                        {pick.sport.toUpperCase()}
                      </span>
                    </div>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '24px',
                      color: '#ccd6f6',
                      fontWeight: '600'
                    }}>
                      {pick.pick}
                    </h3>
                    <p style={{ margin: 0, color: '#8892b0', fontSize: '14px' }}>
                      {pick.game}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '36px', 
                      fontWeight: '700',
                      color: '#00f3ff',
                      fontFamily: 'monospace'
                    }}>
                      {pick.odds > 0 ? '+' : ''}{pick.odds}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', color: '#8892b0', fontSize: '10px', fontFamily: 'monospace' }}>UNITS</p>
                        <p style={{ margin: 0, color: '#ccd6f6', fontSize: '16px', fontWeight: '600' }}>{pick.units}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', color: '#8892b0', fontSize: '10px', fontFamily: 'monospace' }}>STAKE</p>
                        <p style={{ margin: 0, color: '#00f3ff', fontSize: '16px', fontWeight: '600' }}>
                          ${(pick.units * unitSize).toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', color: '#8892b0', fontSize: '10px', fontFamily: 'monospace' }}>EV</p>
                        <p style={{ margin: 0, color: pick.ev > 0 ? '#00f3ff' : '#e94560', fontSize: '16px', fontWeight: '600' }}>
                          +{(pick.ev * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 243, 255, 0.1)',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.7', color: '#a8b2d1' }}>
                    {pick.analysis}
                  </p>
                </div>
                
                <button 
                  onClick={() => addToTracker(pick)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(90deg, #00f3ff, #0066ff)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0a0e27',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  + Add to Tracker (${(pick.units * unitSize).toFixed(0)})
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Warning */}
      <div style={{ 
        background: 'rgba(233, 69, 96, 0.1)',
        padding: '25px',
        borderRadius: '16px',
        border: '1px solid rgba(233, 69, 96, 0.3)',
        marginTop: '40px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#e94560', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '1px' }}>
          ⚠ RESPONSIBLE BETTING PROTOCOL
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '2', color: '#a8b2d1', fontSize: '14px' }}>
          <li>Only bet what you can afford to lose completely</li>
          <li>Set a stop-loss and stick to it</li>
          <li>Track every bet in the <a href="/tracker" style={{ color: '#00f3ff', textDecoration: 'none' }}>Tracker</a></li>
          <li>If it's not fun, stop immediately</li>
        </ul>
      </div>

      <footer style={{ 
        borderTop: '1px solid rgba(0, 243, 255, 0.1)',
        paddingTop: '30px',
        marginTop: '40px',
        color: '#8892b0',
        fontSize: '12px',
        fontFamily: 'monospace',
        textAlign: 'center',
        letterSpacing: '0.5px'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          ◈ ROCi SPORTS INTELLIGENCE ◈
        </p>
        <p style={{ margin: 0, opacity: 0.6 }}>
          Automated EV Analysis via The Odds API • Not Financial Advice
        </p>
      </footer>
      </div>
    </div>
  );
}
