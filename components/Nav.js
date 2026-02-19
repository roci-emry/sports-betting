import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  
  const navStyle = {
    display: 'flex',
    gap: '8px',
    padding: '12px 0',
    marginBottom: '40px',
    borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
    flexWrap: 'wrap',
  };
  
  const linkStyle = (active) => ({
    color: active ? '#00f3ff' : '#8892b0',
    textDecoration: 'none',
    fontWeight: active ? '600' : '400',
    padding: '12px 24px',
    borderRadius: '8px',
    background: active ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
    fontSize: '14px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    border: active ? '1px solid rgba(0, 243, 255, 0.3)' : '1px solid transparent',
    transition: 'all 0.3s ease',
    fontFamily: 'monospace',
  });

  return (
    <nav style={navStyle}>
      <Link href="/" style={linkStyle(router.pathname === '/')}>
        Daily Picks
      </Link>
      <Link href="/tracker" style={linkStyle(router.pathname === '/tracker')}>
        Tracker
      </Link>
      <Link href="/strategy" style={linkStyle(router.pathname === '/strategy')}>
        Strategy
      </Link>
    </nav>
  );
}
