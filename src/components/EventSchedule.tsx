import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ScheduleEvent, Band } from '../types/schedule';
import { MOCK_SCHEDULE } from '../data/scheduleData';

interface EventScheduleProps {
  band: Band;
  tintColor: string;
}

export default function EventSchedule({ band, tintColor }: EventScheduleProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showReminder, setShowReminder] = useState(false);
  const mainEventRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update every second for the live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveTimeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  const todayDateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  const allEvents = useMemo(() => {
    return MOCK_SCHEDULE
      .filter(event => event.band === band || event.band === 'Both')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [band]);

  const activeEvents = useMemo(() => {
    return allEvents.filter(event => new Date(event.endTime) >= currentTime);
  }, [allEvents, currentTime]);

  const getStatus = useCallback((event: ScheduleEvent): 'LIVE' | 'UPCOMING' => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    if (currentTime >= start && currentTime <= end) return 'LIVE';
    return 'UPCOMING';
  }, [currentTime]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const mainEvent = activeEvents.length > 0 ? activeEvents[0] : null;
  const restEvents = activeEvents.slice(1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!mainEventRef.current) return;
      const rect = mainEventRef.current.getBoundingClientRect();
      setShowReminder(rect.bottom < 80);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeEvents.length === 0) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: '#888', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '1rem' }}>
        No upcoming events
      </div>
    );
  }

  const mainStatus = mainEvent ? getStatus(mainEvent) : 'UPCOMING';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* ── STICKY TOP BAR: Date + Live Clock ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px',
        borderBottom: `1px solid ${tintColor}40`,
        backdropFilter: 'blur(12px)',
        background: 'rgba(0,0,0,0.4)',
        flexShrink: 0
      }}>
        <div style={{
          fontSize: '0.95rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#e2e8f0',
          fontWeight: '500'
        }}>
          {todayDateStr}
        </div>
        <div style={{
          fontSize: '0.95rem',
          letterSpacing: '1px',
          color: '#e2e8f0',
          fontWeight: '400',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {liveTimeStr}
        </div>
      </div>

      {/* Navigation - Back Button */}
      <div style={{ padding: '16px 16px 0 16px', flexShrink: 0, maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Link to="/" style={{
          fontSize: '0.75rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          color: '#64748b',
          transition: 'color 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          ← Back
        </Link>
      </div>

      {/* Sticky reminder bar (appears when main event scrolls away) */}
      <div
        onClick={scrollToTop}
        style={{
          position: 'sticky',
          top: '48px',
          zIndex: 25,
          background: mainStatus === 'LIVE' ? 'rgba(16, 185, 129, 0.12)' : `${tintColor}10`,
          borderBottom: `1px solid ${mainStatus === 'LIVE' ? 'rgba(16, 185, 129, 0.4)' : `${tintColor}40`}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: mainStatus === 'LIVE' ? '#6ee7b7' : '#cbd5e1',
          opacity: showReminder ? 1 : 0,
          maxHeight: showReminder ? '50px' : '0',
          padding: showReminder ? '10px 16px' : '0 16px',
          overflow: 'hidden',
          pointerEvents: showReminder ? 'auto' : 'none',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
          fontWeight: '500'
        }}
      >
        <span style={{ animation: mainStatus === 'LIVE' ? 'pulse-dot 1.5s infinite' : 'none', width: '7px', height: '7px', borderRadius: '50%', background: mainStatus === 'LIVE' ? '#6ee7b7' : '#cbd5e1', display: 'inline-block' }} />
        {mainEvent?.title} — {mainStatus === 'LIVE' ? 'Happening now' : 'Up next'}
        <span style={{ opacity: 0.5 }}>↑</span>
      </div>

      <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '0 16px', scrollBehavior: 'smooth' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

        {/* ── MAIN EVENT ── */}
        {mainEvent && (
          <div ref={mainEventRef} style={{ 
            minHeight: '85vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: '2rem 0'
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              border: `1px solid ${tintColor}40`,
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 32px 0 rgba(0,0,0,0.3)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>


            {/* Status - BIGGER */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1.2rem',
              fontSize: '1.1rem',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: mainStatus === 'LIVE' ? '#6ee7b7' : tintColor,
              fontWeight: '700'
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: mainStatus === 'LIVE' ? '#6ee7b7' : tintColor,
                animation: mainStatus === 'LIVE' ? 'pulse-dot 1.5s infinite' : 'none'
              }} />
              {mainStatus}
            </div>

            {/* Event Name */}
            <h2 style={{
              margin: '0 0 1rem 0',
              fontSize: '2.5rem',
              fontWeight: '500',
              letterSpacing: '1px',
              color: '#ffffff',
              lineHeight: 1.2
            }}>
              {mainEvent.title}
            </h2>

            {/* Time & Location */}
            <div style={{
              fontSize: '1.1rem',
              color: '#cbd5e1',
              lineHeight: 2,
              fontWeight: '300'
            }}>
              <div>{formatTime(mainEvent.startTime)} — {formatTime(mainEvent.endTime)}</div>
              <div>{mainEvent.location}</div>
            </div>

            {mainEvent.description && (
              <p style={{
                margin: '1.5rem 0 0 0',
                fontSize: '1rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                fontWeight: '300',
                maxWidth: '550px'
              }}>
                {mainEvent.description}
              </p>
            )}
            </div>

            {/* Scroll hint at bottom */}
            {restEvents.length > 0 && (
              <div style={{
                marginTop: 'auto',
                paddingTop: '2rem',
                textAlign: 'center',
                fontSize: '0.7rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#475569',
                animation: 'bounce 2s infinite'
              }}>
                ↓ Scroll for more
              </div>
            )}
          </div>
        )}

        {/* ── SEPARATOR ── */}
        {restEvents.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 2rem 0' }}>
            <div style={{ height: '1px', flex: 1, background: `${tintColor}40` }} />
            <span style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', color: tintColor, fontWeight: '500' }}>
              Next
            </span>
            <div style={{ height: '1px', flex: 1, background: `${tintColor}40` }} />
          </div>
        )}

        {/* ── REST OF THE TIMELINE ── */}
        {restEvents.map((event, index) => {
          const status = getStatus(event);
          const isNewDate = index === 0 || formatDate(event.startTime) !== formatDate(restEvents[index - 1].startTime);

          return (
            <React.Fragment key={event.id}>
              {isNewDate && (
                <div style={{
                  fontSize: '0.75rem',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  margin: index === 0 ? '0 0 1.25rem 0' : '2rem 0 1.25rem 0'
                }}>
                  {formatDate(event.startTime)}
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '16px',
                marginBottom: '1rem'
              }}>
                {/* Timeline dot & vertical line */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '20px'
                }}>
                  <div style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: status === 'LIVE' ? '#6ee7b7' : tintColor,
                    animation: status === 'LIVE' ? 'pulse-dot 1.5s infinite' : 'none',
                    marginTop: '28px',
                    position: 'relative',
                    zIndex: 2
                  }} />
                  {index !== restEvents.length - 1 && (
                    <div style={{
                      width: '1px',
                      flex: 1,
                      background: `${tintColor}30`,
                      marginTop: '8px',
                      marginBottom: '-16px' // reach the next item
                    }} />
                  )}
                </div>

                {/* Event Card */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  gap: '12px',
                  padding: '1.25rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: `1px solid ${tintColor}30`,
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.2)'
                }}>
                  {/* Status badge */}
                  <div style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: status === 'LIVE' ? '#6ee7b7' : '#64748b',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {status}
                  </div>

                  {/* Event info */}
                  <div>
                    <div style={{
                      fontSize: '1.15rem',
                      fontWeight: '400',
                      color: '#e2e8f0',
                      marginBottom: '6px',
                      letterSpacing: '0.5px'
                    }}>
                      {event.title}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#94a3b8',
                      fontWeight: '300'
                    }}>
                      {formatTime(event.startTime)} — {formatTime(event.endTime)}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#94a3b8',
                      fontWeight: '300',
                      marginTop: '4px'
                    }}>
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Bottom padding */}
        <div style={{ height: '4rem' }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
