import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import EventSchedule from './components/EventSchedule';

function Home() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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
    if (isAuthenticating) return;
    
    setSelectedColor(color);
    setIsAuthenticating(true);
    
    setTimeout(() => {
      navigate(`/${color.toLowerCase()}`);
    }, 1200); // Increased wait time slightly to show the animation
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
        color: 'rgba(0, 0, 0, 0.9)',
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
          disabled={isAuthenticating}
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
            cursor: isAuthenticating ? 'not-allowed' : 'pointer',
            boxShadow: selectedColor === 'Red' 
              ? '0 0 20px rgba(230, 57, 70, 0.6)' 
              : 'none',
            transform: selectedColor === 'Red' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease',
            outline: 'none',
            backdropFilter: 'blur(4px)',
            width: '100%',
            opacity: isAuthenticating && selectedColor !== 'Red' ? 0.3 : 1
          }}
        >
          Red
        </button>

        <button
          onClick={() => handleSelect('Blue')}
          disabled={isAuthenticating}
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
            cursor: isAuthenticating ? 'not-allowed' : 'pointer',
            boxShadow: selectedColor === 'Blue' 
              ? '0 0 20px rgba(29, 53, 87, 0.6)' 
              : 'none',
            transform: selectedColor === 'Blue' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease',
            outline: 'none',
            backdropFilter: 'blur(4px)',
            width: '100%',
            opacity: isAuthenticating && selectedColor !== 'Blue' ? 0.3 : 1
          }}
        >
          Blue
        </button>
      </div>

      <div style={{ height: '20px', marginTop: '-1rem' }}>
        {isAuthenticating && (
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            fontWeight: '400',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: selectedColor === 'Red' ? '#ff8787' : '#74c0fc',
            animation: 'blink-fast 0.8s infinite ease-in-out'
          }}>
            Establishing Connection...
          </p>
        )}
      </div>
    </div>
  );
}

function BandPage({ color, isDarkMode }: { color: 'red' | 'blue', isDarkMode?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 600);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const isRed = color === 'red';
  const isBlue = color === 'blue';
  
  const tintColor = isRed ? '#ff3333' : isBlue ? '#3388ff' : '#ffffff';
  const bandType = isRed ? 'Red' : 'Blue';

  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      padding: isMobile ? '0' : '0 3rem',
      width: '100vw',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.6s ease',
      height: '100%',
      boxSizing: 'border-box'
    }}>

      {/* Schedule UI */}
      <div style={{ flex: 1, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <EventSchedule band={bandType} tintColor={tintColor} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bgColor = isDarkMode ? '#121212' : '#FFF8E7';
  const textColor = isDarkMode ? '#f8fafc' : '#1a1a1a';
  const navBgColor = isDarkMode ? '#1e1e1e' : '#FBE6D0';
  const secondaryTextColor = isDarkMode ? '#94a3b8' : '#666';
  const buttonBgColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

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
        boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
        zIndex: 50,
        transition: 'background-color 0.3s ease'
      }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/new_logo.png" 
            alt="Logo" 
            style={{ width: '26px', height: 'auto', filter: isDarkMode ? 'brightness(0.9)' : 'none' }} 
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

          {/* Toggle Button */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ background: buttonBgColor, color: textColor, border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem', transition: 'background-color 0.2s ease' }}
          >
            {isDarkMode ? '☀' : '☾'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/red" element={<BandPage color="red" isDarkMode={isDarkMode} />} />
        <Route path="/blue" element={<BandPage color="blue" isDarkMode={isDarkMode} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
