import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  
  const navStyle = {
    display: 'flex',
    gap: '10px',
    padding: '10px 0',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    flexWrap: 'wrap',
  };
  
  const linkStyle = (active) => ({
    color: active ? '#2196f3' : '#666',
    textDecoration: 'none',
    fontWeight: active ? '600' : '400',
    padding: '10px 20px',
    borderRadius: '8px',
    background: active ? '#e3f2fd' : 'transparent',
    fontSize: '15px',
    transition: 'all 0.2s',
  });

  return (
    <nav style={navStyle}>
      <Link href="/" style={linkStyle(router.pathname === '/')}>
        📋 Daily Picks
      </Link>
      <Link href="/tracker" style={linkStyle(router.pathname === '/tracker')}>
        📊 Tracker
      </Link>
      <Link href="/strategy" style={linkStyle(router.pathname === '/strategy')}>
        📖 Strategy
      </Link>
    </nav>
  );
}
