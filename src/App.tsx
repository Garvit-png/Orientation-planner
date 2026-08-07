import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import EventSchedule from './components/EventSchedule';

function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelect = (color: string) => {
    navigate(`/${color.toLowerCase()}`);
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3rem',
      padding: '0 1rem',
      width: '100%',
      maxWidth: '500px'
    }}>
      <style>{`
        @keyframes blink-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <h1 style={{ 
        fontSize: isMobile ? '1.5rem' : '2.5rem', 
        fontWeight: '300', 
        letterSpacing: isMobile ? '2px' : '8px',
        textTransform: 'uppercase',
        color: '#FFFFFF',
        margin: 0,
        whiteSpace: 'nowrap'
      }}>
        Choose Your Band
      </h1>
      
      <div style={{
        display: 'flex',
        gap: isMobile ? '1.5rem' : '2.5rem',
        justifyContent: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%'
      }}>
        <button
          onClick={() => handleSelect('Red')}
          style={{
            padding: '12px 40px',
            fontSize: '1rem',
            fontWeight: '400',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#fff',
            backgroundColor: 'rgba(230, 57, 70, 0.8)',
            border: '1px solid rgba(230, 57, 70, 0.5)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            backdropFilter: 'blur(4px)',
            width: '100%'
          }}
        >
          Red
        </button>

        <button
          onClick={() => handleSelect('Blue')}
          style={{
            padding: '12px 40px',
            fontSize: '1rem',
            fontWeight: '400',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#fff',
            backgroundColor: 'rgba(29, 53, 87, 0.8)',
            border: '1px solid rgba(29, 53, 87, 0.5)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            backdropFilter: 'blur(4px)',
            width: '100%'
          }}
        >
          Blue
        </button>
      </div>
    </div>
  );
}

function BandPage({ color }: { color: 'red' | 'blue' }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate loading on the new page
    setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const tintColor = color === 'red' ? '#ef4444' : '#3b82f6';
  const bandType = color === 'red' ? 'Red' : 'Blue';

  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${tintColor}30`,
          borderTop: `3px solid ${tintColor}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{
          color: tintColor,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          fontSize: '0.85rem',
          animation: 'pulse 1.5s infinite'
        }}>
          Loading...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      padding: isMobile ? '0' : '0 3rem',
      width: '100vw',
      height: '100%',
      boxSizing: 'border-box'
    }}>

      {/* Schedule UI */}
      <div style={{ flex: 1, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <EventSchedule band={bandType} tintColor={tintColor} />
      </div>
    </div>
  );
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bgColor = '#121212';
  const textColor = '#f8fafc';
  const navBgColor = '#1e1e1e';
  const secondaryTextColor = '#94a3b8';
  const buttonBgColor = 'rgba(255,255,255,0.1)';

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: bgColor,
      color: textColor,
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Navbar */}
      <div style={{
        width: '100%',
        backgroundColor: navBgColor,
        padding: '6px 16px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 50,
        transition: 'background-color 0.3s ease'
      }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/new_logo.png" 
            alt="Logo" 
            style={{ width: '26px', height: 'auto', filter: 'brightness(0.9)' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '600', fontSize: '0.7rem', color: textColor }}>RU Orientation Portal</span>
            <span style={{ fontSize: '0.55rem', color: secondaryTextColor }}>#ApproachingRishihood</span>
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Time Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: buttonBgColor, padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', color: textColor, fontWeight: '500' }}>
            <div style={{ width: '4px', height: '4px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/red" element={<BandPage color="red" />} />
        <Route path="/blue" element={<BandPage color="blue" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
