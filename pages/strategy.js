import Nav from '../components/Nav';

export default function Strategy() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', lineHeight: '1.6' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>📖 The Roci Betting System</h1>
        <p style={{ color: '#666' }}>Principles for systematic, disciplined sports betting</p>
      </header>

      <Nav />

      <div style={{ marginBottom: '40px' }}>
        <h2>🎯 Core Philosophy</h2>
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>The house always has an edge.</strong> Sportsbooks build in a 4-11% vigorish. 
            To be profitable long-term, you need to win 52.4% of -110 bets just to break even.
          </p>
          <p style={{ margin: 0 }}>
            This system is about <strong>disciplined bankroll management</strong> and 
            <strong> finding value</strong> — not guarantees. Most bettors lose. The goal is to 
            be in the minority that doesn't.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>💰 Bankroll Management (The #1 Rule)</h2>
        
        <h3>1. Define Your Unit</h3>
        <ul>
          <li><strong>1 unit = 1-2% of total bankroll</strong></li>
          <li>With $1,000 bankroll: 1 unit = $10-20</li>
          <li>Never bet more than 5 units on a single play</li>
          <li>Most bets should be 1-2 units</li>
        </ul>

        <h3>2. The Kelly Criterion (Fractional)</h3>
        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', margin: '15px 0' }}>
          <p style={{ margin: '0 0 10px 0' }}><strong>Formula:</strong> f = (bp - q) / b</p>
          <ul style={{ margin: 0 }}>
            <li><strong>b</strong> = odds received (decimal)</li>
            <li><strong>p</strong> = probability of winning (your estimate)</li>
            <li><strong>q</strong> = probability of losing (1 - p)</li>
            <li><strong>f</strong> = fraction of bankroll to bet</li>
          </ul>
        </div>
        <p>
          <strong>We use 25% Kelly</strong> — take the full Kelly result and bet 1/4 of it. 
          This reduces variance while still optimizing growth.
        </p>

        <h3>3. Bankroll Adjustments</h3>
        <ul>
          <li>Recalculate unit size weekly based on current bankroll</li>
          <li>If bankroll drops 50%, take a break and reassess</li>
          <li>Withdraw profits when bankroll doubles</li>
        </ul>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>🔍 Finding Value</h2>
        
        <h3>1. Line Shopping</h3>
        <p>
          Compare odds across multiple sportsbooks. A half-point difference on a spread 
          or 10 cents on a moneyline can be the difference between profit and loss over time.
        </p>

        <h3>2. Fade the Public</h3>
        <p>
          When 70%+ of bets are on one side, the line often moves to attract action on the other side. 
          This creates value on the less popular team. Look for:
        </p>
        <ul>
          <li>Popular teams (Cowboys, Yankees, Lakers) getting heavy action</li>
          <li>Primetime games with public-friendly matchups</li>
          <li>Lines that move opposite to the betting percentages</li>
        </ul>

        <h3>3. Specialize</h3>
        <p>
          The big markets (NFL spreads, NBA totals) are sharp. Consider:
        </p>
        <ul>
          <li><strong>Player props:</strong> Less efficient than game lines</li>
          <li><strong>Niche sports:</strong> KBO, WNBA, tennis can have softer lines</li>
          <li><strong>Live betting:</strong> Look for overreactions to early game events</li>
        </ul>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>🧠 Mental Game</h2>
        
        <h3>1. Track Everything</h3>
        <p>
          Log every bet — wins, losses, and pushes. You can't improve what you don't measure. 
          Use the <a href="/tracker" style={{ color: '#2196f3' }}>Tracker</a> to record:
        </p>
        <ul>
          <li>Sport and bet type</li>
          <li>Odds and stake</li>
          <li>Your reasoning before placing the bet</li>
          <li>Outcome and lessons learned</li>
        </ul>

        <h3>2. Avoid These Traps</h3>
        <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px' }}>
          <ul style={{ margin: 0 }}>
            <li><strong>Chasing losses:</strong> Never increase bet size to "make it back"</li>
            <li><strong>Betting while emotional:</strong> Anger, excitement, alcohol = bad decisions</li>
            <li><strong>Parlays:</strong> The house edge compounds. Avoid or use sparingly</li>
            <li><strong>Too many bets:</strong> Quality over quantity. 0-3 plays per day max</li>
          </ul>
        </div>

        <h3>3. The Stop-Loss</h3>
        <p>
          Set a daily/weekly loss limit. If you hit it, <strong>stop betting</strong>. 
          Discipline separates professionals from degenerates.
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>📊 How Roci Generates Picks</h2>
        
        <p>Each morning, I evaluate games using:</p>
        
        <ol>
          <li><strong>Market analysis:</strong> Current lines vs. opening lines</li>
          <li><strong>Public betting %:</strong> Where is the money going?</li>
          <li><strong>My probability estimate:</strong> Based on form, matchups, situational spots</li>
          <li><strong>EV calculation:</strong> Does the bet have positive expected value?</li>
          <li><strong>Kelly sizing:</strong> How confident am I? (1-3 units)</li>
        </ol>

        <p style={{ marginTop: '20px' }}>
          <strong>Confidence levels:</strong>
        </p>
        <ul>
          <li><strong>High (3 units):</strong> Clear edge, strong conviction</li>
          <li><strong>Medium (2 units):</strong> Solid value, good spot</li>
          <li><strong>Low (1 unit):</strong> Slight edge, worth a small play</li>
        </ul>
      </div>

      <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
        <h2 style={{ marginTop: 0 }}>⚠️ Responsible Betting Checklist</h2>
        <ul style={{ margin: 0 }}>
          <li>Only bet money you can afford to lose completely</li>
          <li>Set a budget and stick to it</li>
          <li>Never borrow money to gamble</li>
          <li>Don't let betting affect relationships or work</li>
          <li>Take breaks regularly</li>
          <li>If you're not having fun, stop</li>
          <li>Seek help if you feel you can't stop: 1-800-522-4700 (NCPG)</li>
        </ul>
      </div>

      <footer style={{ borderTop: '1px solid #ccc', paddingTop: '20px', color: '#666', fontSize: '14px', textAlign: 'center' }}>
        <p>🚀 The Roci Betting System • Discipline over emotion</p>
        <p style={{ fontSize: '12px' }}>This is for educational purposes. Gambling involves risk. Please bet responsibly.</p>
      </footer>
    </div>
  );
}
