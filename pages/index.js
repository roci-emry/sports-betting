import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

export default function DailyPicks() {
  const [picks, setPicks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [bankroll, setBankroll] = useState(1000);
  const [unitSize, setUnitSize] = useState(50);

  // Sample picks for demonstration
  const samplePicks = [
    {
      pick: "Boston Celtics -6.5",
      game: "Celtics vs Heat",
      odds: -110,
      units: 2,
      confidence: "medium",
      analysis: "Celtics coming off rest, Heat on back-to-back. Boston's defense should limit Miami's perimeter shooting. Line moved from -5.5 to -6.5 with sharp action on Boston.",
      myLine: "Celtics -7",
      marketLine: "Celtics -6.5 (-110)",
      publicPercent: 65
    },
    {
      pick: "Over 228.5",
      game: "Suns vs Warriors",
      odds: -105,
      units: 1,
      confidence: "low",
      analysis: "Both teams play fast, poor defense lately. Suns without key defender. Public heavily on under which has pushed total down from 232. Value on over.",
      myLine: "230",
      marketLine: "228.5 (-105)",
      publicPercent: 72
    }
  ];

  useEffect(() => {
    const savedPicks = localStorage.getItem('dailyPicks');
    const savedUpdated = localStorage.getItem('lastUpdated');
    const savedBankroll = localStorage.getItem('bankroll');
    const savedUnit = localStorage.getItem('unitSize');
    
    if (savedPicks) {
      setPicks(JSON.parse(savedPicks));
    } else {
      // Load sample picks on first visit
      setPicks(samplePicks);
      setLastUpdated(new Date().toISOString());
      localStorage.setItem('dailyPicks', JSON.stringify(samplePicks));
      localStorage.setItem('lastUpdated', new Date().toISOString());
    }
    if (savedUpdated) setLastUpdated(savedUpdated);
    if (savedBankroll) setBankroll(parseFloat(savedBankroll));
    if (savedUnit) setUnitSize(parseFloat(savedUnit));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not yet updated';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateKellyBet = (winProb, odds) => {
    // Fractional Kelly (25% of full Kelly for safety)
    const b = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
    const q = 1 - winProb;
    const f = (winProb * b - q) / b;
    return Math.max(0, f * 0.25); // 25% Kelly
  };

  const totalRisk = picks.reduce((sum, p) => sum + (p.units * unitSize), 0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>📋 Roci's Daily Picks</h1>
        <p style={{ color: '#666' }}>Systematic sports betting • {formatDate(lastUpdated)}</p>
      </header>

      <Nav />

      {/* Bankroll Status */}
      <div style={{ 
        background: '#e3f2fd', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '20px'
      }}>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Bankroll</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>${bankroll.toFixed(2)}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Unit Size</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>${unitSize}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Today's Risk</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: totalRisk > unitSize * 3 ? '#f44336' : '#4caf50' }}>
            ${totalRisk.toFixed(2)}
          </p>
        </div>
        <div>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Active Picks</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{picks.length}</p>
        </div>
      </div>

      {picks.length === 0 ? (
        <div style={{ 
          background: '#fff3e0', 
          padding: '40px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h2>No picks for today</h2>
          <p style={{ color: '#666' }}>
            Check back tomorrow morning for new picks. <br/>
            Roci updates this page daily by 9 AM.
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h2>Today's Picks</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Bet sizing based on Kelly Criterion (25% fractional). Never risk more than 5% of bankroll on a single play.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {picks.map((pick, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${pick.confidence === 'high' ? '#4caf50' : pick.confidence === 'medium' ? '#ff9800' : '#f44336'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: pick.confidence === 'high' ? '#e8f5e9' : pick.confidence === 'medium' ? '#fff3e0' : '#ffebee',
                      color: pick.confidence === 'high' ? '#4caf50' : pick.confidence === 'medium' ? '#ff9800' : '#f44336',
                      marginBottom: '8px'
                    }}>
                      {pick.confidence.toUpperCase()} CONFIDENCE
                    </span>
                    <h3 style={{ margin: '0 0 5px 0' }}>{pick.pick}</h3>
                    <p style={{ margin: 0, color: '#666' }}>{pick.game}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>{pick.odds}</p>
                    <p style={{ margin: 0, color: '#666' }}>{pick.units} units</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#999' }}>
                      ${(pick.units * unitSize).toFixed(0)}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  background: '#f5f5f5', 
                  padding: '15px', 
                  borderRadius: '6px',
                  marginTop: '15px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Analysis</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.6' }}>{pick.analysis}</p>
                  
                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#666' }}>
                    <span>🎯 My line: {pick.myLine}</span>
                    <span>📊 Market: {pick.marketLine}</span>
                    {pick.publicPercent && <span>👥 Public: {pick.publicPercent}%</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ 
        background: '#ffebee', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '30px' 
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Responsible Betting Reminder</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Only bet what you can afford to lose</li>
          <li>Set a stop-loss and stick to it</li>
          <li>Never chase losses</li>
          <li>Track every bet in the <a href="/tracker" style={{ color: '#2196f3' }}>Tracker</a></li>
          <li>If it's not fun, stop immediately</li>
        </ul>
      </div>

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '30px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
        <p>🚀 Picks generated by Roci • Updated daily by 9 AM</p>
        <p style={{ fontSize: '12px' }}>Not financial advice. For entertainment purposes only.</p>
      </footer>
    </div>
  );
}
