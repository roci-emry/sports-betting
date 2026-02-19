import Nav from '../components/Nav';

export default function Strategy() {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#0a0e27',
      minHeight: '100vh',
      color: '#ccd6f6'
    }}>
      <div style={{
        maxWidth: '800px',
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
                SYSTEM PROTOCOLS
              </p>
            </div>
          </div>
        </header>

        <Nav />

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#00f3ff', fontSize: '18px', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>
            CORE PHILOSOPHY
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)'
          }}>
            <p style={{ margin: '0 0 15px 0', color: '#a8b2d1', lineHeight: '1.7' }}>
              <strong style={{ color: '#e94560' }}>The house always has an edge.</strong> Sportsbooks build in a 4-11% vigorish. 
              To be profitable long-term, you need to win 52.4% of -110 bets just to break even.
            </p>
            <p style={{ margin: 0, color: '#a8b2d1', lineHeight: '1.7' }}>
              This system is about <strong style={{ color: '#00f3ff' }}>disciplined bankroll management</strong> and 
              <strong style={{ color: '#00f3ff' }}> finding value</strong> — not guarantees.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#00f3ff', fontSize: '18px', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>
            BANKROLL MANAGEMENT
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#64ffda', fontSize: '14px', marginBottom: '15px', fontFamily: 'monospace' }}>DEFINE YOUR UNIT</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#a8b2d1', lineHeight: '2' }}>
              <li><strong style={{ color: '#00f3ff' }}>1 unit = 1-2% of total bankroll</strong></li>
              <li>With $1,000 bankroll: 1 unit = $10-20</li>
              <li>Never bet more than 5 units on a single play</li>
              <li>Most bets should be 1-2 units</li>
            </ul>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#64ffda', fontSize: '14px', marginBottom: '15px', fontFamily: 'monospace' }}>KELLY CRITERION (25%)</h3>
            <p style={{ margin: '0 0 15px 0', color: '#a8b2d1' }}>
              <strong style={{ color: '#00f3ff' }}>Formula:</strong> f = (bp - q) / b
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#a8b2d1', lineHeight: '2' }}>
              <li><strong>b</strong> = odds received (decimal)</li>
              <li><strong>p</strong> = probability of winning (your estimate)</li>
              <li><strong>q</strong> = probability of losing (1 - p)</li>
              <li><strong>f</strong> = fraction of bankroll to bet</li>
            </ul>
            <p style={{ margin: '15px 0 0 0', color: '#a8b2d1' }}>
              We use <strong style={{ color: '#00f3ff' }}>25% Kelly</strong> — take the full Kelly result and bet 1/4 of it.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)'
          }}>
            <h3 style={{ color: '#64ffda', fontSize: '14px', marginBottom: '15px', fontFamily: 'monospace' }}>ADJUSTMENTS</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#a8b2d1', lineHeight: '2' }}>
              <li>Recalculate unit size weekly based on current bankroll</li>
              <li>If bankroll drops 50%, take a break and reassess</li>
              <li>Withdraw profits when bankroll doubles</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#00f3ff', fontSize: '18px', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>
            FINDING VALUE
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#64ffda', fontSize: '14px', marginBottom: '15px', fontFamily: 'monospace' }}>FADE THE PUBLIC</h3>
            <p style={{ margin: '0 0 15px 0', color: '#a8b2d1' }}>
              When 70%+ of bets are on one side, the line often moves to attract action on the other side.
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#a8b2d1', lineHeight: '2' }}>
              <li>Popular teams getting heavy action</li>
              <li>Primetime games with public-friendly matchups</li>
              <li>Lines that move opposite to betting percentages</li>
            </ul>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)'
          }}>
            <h3 style={{ color: '#64ffda', fontSize: '14px', marginBottom: '15px', fontFamily: 'monospace' }}>SPECIALIZE</h3>
            <p style={{ margin: '0 0 15px 0', color: '#a8b2d1' }}>
              The big markets (NFL spreads, NBA totals) are sharp. Consider:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#a8b2d1', lineHeight: '2' }}>
              <li><strong style={{ color: '#00f3ff' }}>Player props:</strong> Less efficient than game lines</li>
              <li><strong style={{ color: '#00f3ff' }}>Niche sports:</strong> KBO, WNBA, tennis can have softer lines</li>
              <li><strong style={{ color: '#00f3ff' }}>Live betting:</strong> Look for overreactions</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#00f3ff', fontSize: '18px', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>
            ROCi PICK GENERATION
          </h2>
          <div style={{
            background: 'linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(17, 34, 64, 0.9) 100%)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 243, 255, 0.2)'
          }}>
            <p style={{ margin: '0 0 15px 0', color: '#a8b2d1' }}>Each morning, the system evaluates games using:</p>
            <ol style={{ margin: 0, paddingLeft: '20px', color: '#a8b2d1', lineHeight: '2' }}>
              <li><strong style={{ color: '#00f3ff' }}>Market analysis:</strong> Current lines vs. opening lines</li>
              <li><strong style={{ color: '#00f3ff' }}>Public betting %:</strong> Where is the money going?</li>
              <li><strong style={{ color: '#00f3ff' }}>Probability estimate:</strong> Based on form, matchups, situational spots</li>
              <li><strong style={{ color: '#00f3ff' }}>EV calculation:</strong> Does the bet have positive expected value?</li>
              <li><strong style={{ color: '#00f3ff' }}>Kelly sizing:</strong> How confident? (1-3 units)</li>
            </ol>
          </div>
        </div>

        <div style={{
          background: 'rgba(233, 69, 96, 0.1)',
          padding: '25px',
          borderRadius: '16px',
          border: '1px solid rgba(233, 69, 96, 0.3)',
          marginBottom: '40px'
        }}>
          <h2 style={{ color: '#e94560', fontSize: '16px', marginBottom: '15px', fontFamily: 'monospace', letterSpacing: '1px' }}>
            ⚠ RESPONSIBLE BETTING CHECKLIST
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#a8b2d1', lineHeight: '2' }}>
            <li>Only bet money you can afford to lose completely</li>
            <li>Set a budget and stick to it</li>
            <li>Never borrow money to gamble</li>
            <li>Don't let betting affect relationships or work</li>
            <li>Take breaks regularly</li>
            <li>If you're not having fun, stop</li>
          </ul>
        </div>

        <footer style={{ 
          borderTop: '1px solid rgba(0, 243, 255, 0.1)',
          paddingTop: '30px',
          color: '#8892b0',
          fontSize: '12px',
          fontFamily: 'monospace',
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>◈ ROCi SPORTS INTELLIGENCE ◈</p>
          <p style={{ margin: 0, opacity: 0.6 }}>Discipline over emotion</p>
        </footer>
      </div>
    </div>
  );
}
