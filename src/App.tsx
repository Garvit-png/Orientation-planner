import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import FaultyTerminal from './components/FaultyTerminal';
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
        fontSize: isMobile ? '2rem' : '2.5rem', 
        fontWeight: '300', 
        letterSpacing: isMobile ? '4px' : '8px',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.9)',
        margin: 0
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

function BandPage({ color }: { color: 'red' | 'blue' }) {
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
      padding: isMobile ? '1rem' : '2rem 3rem',
      width: '100%',
      maxWidth: '700px',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.6s ease',
      height: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Tiny back link */}
      <div style={{ flexShrink: 0, paddingTop: isMobile ? '0.5rem' : '0', marginBottom: '0.5rem' }}>
        <Link to="/" style={{
          fontSize: '0.7rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: '#475569',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
        >
          ← Back
        </Link>
      </div>

      {/* Schedule UI */}
      <div style={{ flex: 1, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <EventSchedule band={bandType} tintColor={tintColor} />
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const path = location.pathname.toLowerCase();
  const isRed = path === '/red';
  const isBlue = path === '/blue';
  
  const tintColor = isRed ? '#ff3333' : isBlue ? '#3388ff' : '#ffffff';
  const brightness = isRed || isBlue ? 0.3 : 0.25;

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <FaultyTerminal
        scale={isMobile ? 1 : 1.5}
        gridMul={isMobile ? [1, 1] : [2, 1]}
        digitSize={isMobile ? 1 : 1.2}
        timeScale={0.2}
        pause={false}
        scanlineIntensity={isMobile ? 0 : 0.5}
        glitchAmount={isMobile ? 0 : 1}
        flickerAmount={isMobile ? 0 : 1}
        noiseAmp={isMobile ? 0 : 1}
        chromaticAberration={0}
        dither={0}
        curvature={isMobile ? 0 : 0.5}
        tint={tintColor}
        mouseReact={!isMobile}
        mouseStrength={0.5}
        pageLoadAnimation={!isMobile}
        brightness={brightness}
        dpr={isMobile ? 0.75 : window.devicePixelRatio || 1}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/red" element={<BandPage color="red" />} />
        <Route path="/blue" element={<BandPage color="blue" />} />
      </Routes>
    </div>
  );
}

export default App;
