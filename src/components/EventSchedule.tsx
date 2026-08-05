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
  const [selectedDate, setSelectedDate] = useState<string>('');
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

  const getStatus = useCallback((event: ScheduleEvent): 'LIVE' | 'UPCOMING' | 'PAST' => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    if (currentTime >= start && currentTime <= end) return 'LIVE';
    if (currentTime > end) return 'PAST';
    return 'UPCOMING';
  }, [currentTime]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatDateShort = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const pastEvents = useMemo(() => {
    return allEvents.filter(event => new Date(event.endTime) < currentTime);
  }, [allEvents, currentTime]);

  // Unique dates from active events
  const uniqueDates = useMemo(() => {
    const seen = new Set<string>();
    return activeEvents
      .map(e => formatDate(e.startTime))
      .filter(d => { if (seen.has(d)) return false; seen.add(d); return true; });
  }, [activeEvents]);

  // Auto-select first available date
  useEffect(() => {
    if (selectedDate !== 'PAST' && uniqueDates.length > 0 && (!selectedDate || !uniqueDates.includes(selectedDate))) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  const filteredEvents = useMemo(() => {
    if (selectedDate === 'PAST') return pastEvents;
    return activeEvents.filter(e => formatDate(e.startTime) === selectedDate);
  }, [activeEvents, pastEvents, selectedDate]);

  // Find the currently active or next upcoming event across all dates for the reminder bar
  const mainEvent = activeEvents.length > 0 ? activeEvents[0] : null;

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
          fontSize: '0.8rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#e2e8f0',
          fontWeight: '500'
        }}>
          {todayDateStr}
        </div>
        <div style={{
          fontSize: '0.8rem',
          letterSpacing: '1px',
          color: '#e2e8f0',
          fontWeight: '400',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {liveTimeStr}
        </div>
      </div>

      {/* Navigation - Back Button + Date Tabs */}
      <div style={{ padding: '12px 16px 0 16px', flexShrink: 0, maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Link to="/" style={{
          fontSize: '0.7rem',
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

        {/* Date Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '14px',
          flexWrap: 'wrap'
        }}>
          {uniqueDates.map(date => {
            const isActive = date === selectedDate;
            // Get short label from first event of that date
            const firstEvent = allEvents.find(e => formatDate(e.startTime) === date);
            const label = firstEvent ? formatDateShort(firstEvent.startTime) : date;
            return (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: isActive ? tintColor : 'transparent',
                  border: `1px solid ${isActive ? tintColor : `${tintColor}50`}`,
                  borderRadius: '20px',
                  padding: '5px 14px',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  color: isActive ? '#000' : '#94a3b8',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
              >
                {label}
              </button>
            );
          })}
          
          {/* Past Tab */}
          {pastEvents.length > 0 && (
            <button
              onClick={() => {
                setSelectedDate('PAST');
                scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: selectedDate === 'PAST' ? tintColor : 'transparent',
                border: `1px solid ${selectedDate === 'PAST' ? tintColor : `${tintColor}50`}`,
                borderRadius: '20px',
                padding: '5px 14px',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                color: selectedDate === 'PAST' ? '#000' : '#94a3b8',
                fontWeight: selectedDate === 'PAST' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }}
            >
              Past Sessions
            </button>
          )}
        </div>
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
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingTop: '8px' }}>

        {/* ── UNIFIED TIMELINE ── */}
        {filteredEvents.map((event, index) => {
          const status = getStatus(event);
          const isMainEvent = event.id === mainEvent?.id;

          return (
            <React.Fragment key={event.id}>
              <div style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '0',
                marginBottom: '0',
                opacity: !isMainEvent ? 0.6 : 1
              }}>
                {/* LEFT: Time sidebar */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  minWidth: '7.5rem',
                  paddingRight: '0.75rem',
                  paddingTop: '1.125rem'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    color: !isMainEvent ? '#94a3b8' : '#ffffff',
                    fontWeight: '400',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.4
                  }}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                </div>

                {/* CENTER: Vertical line + dot */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '1.75rem',
                  flexShrink: 0
                }}>
                  {/* Connector line from previous */}
                  <div style={{
                    width: '1px',
                    height: index === 0 ? '0.375rem' : '1.125rem',
                    background: index === 0 ? 'transparent' : (!isMainEvent ? '#475569' : `${tintColor}40`),
                    flexShrink: 0
                  }} />
                  {/* Dot */}
                  <div style={{
                    width: '0.5625rem',
                    height: '0.5625rem',
                    borderRadius: '50%',
                    background: status === 'LIVE' ? '#6ee7b7' : (!isMainEvent ? '#64748b' : tintColor),
                    animation: status === 'LIVE' ? 'pulse-dot 1.5s infinite' : 'none',
                    flexShrink: 0,
                    zIndex: 2,
                    position: 'relative'
                  }} />
                  {/* Connector line to next */}
                  <div style={{
                    width: '1px',
                    flex: 1,
                    minHeight: '1rem',
                    background: index === filteredEvents.length - 1 ? 'transparent' : (!isMainEvent ? '#475569' : `${tintColor}40`),
                    marginTop: '0.375rem'
                  }} />
                </div>

                {/* RIGHT: Event card */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  padding: '0.75rem 0.75rem 1.25rem 1rem'
                }}>
                  {/* Status badge */}
                  <div style={{
                    fontSize: '0.65rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: status === 'LIVE' ? '#6ee7b7' : (!isMainEvent ? '#64748b' : tintColor),
                    fontWeight: '600',
                    marginBottom: '0.375rem'
                  }}>
                    {status}
                  </div>
                  {/* Event name */}
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    color: !isMainEvent ? '#94a3b8' : '#e2e8f0',
                    letterSpacing: '0.3px',
                    marginBottom: '0.25rem',
                    lineHeight: 1.3
                  }}>
                    {event.title}
                  </div>
                  {/* Location */}
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#64748b',
                    fontWeight: '300'
                  }}>
                    {event.location}
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
      `}</style>
    </div>
  );
}
