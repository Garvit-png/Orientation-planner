import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSessionByPill, PillType } from '@/data/sessions'
import styles from './PortalPage.module.css'

const PortalPage = () => {
  const { pill } = useParams<{ pill: string }>()
  const navigate = useNavigate()
  const [entered, setEntered] = useState(false)
  const pillType = (pill === 'blue' || pill === 'red' ? pill : null) as PillType | null
  const session = pillType ? getSessionByPill(pillType) : null

  useEffect(() => {
    // Trigger entry animation
    const t = setTimeout(() => setEntered(true), 80)
    return () => clearTimeout(t)
  }, [])

  if (!pillType || !session) {
    return (
      <div className={styles.notFound}>
        <p>Portal not found.</p>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          ← Back
        </button>
      </div>
    )
  }

  const isBlue = pillType === 'blue'
  const accentClass = isBlue ? styles.blue : styles.red

  return (
    <div className={`${styles.page} ${accentClass} ${entered ? styles.entered : ''}`}>
      {/* Portal glow background */}
      <div className={`${styles.portalGlow} ${accentClass}`} aria-hidden="true" />

      {/* Back button */}
      <button
        className={`${styles.backBtn} ${accentClass}`}
        onClick={() => navigate('/')}
        aria-label="Go back to home"
      >
        ← Back
      </button>

      {/* Portal Header */}
      <div className={styles.header}>
        <div className={`${styles.portalRing} ${accentClass}`}>
          <span className={styles.portalEmoji}>{isBlue ? '🔵' : '🔴'}</span>
        </div>
        <h1 className={styles.portalTitle}>
          {isBlue ? 'Blue' : 'Red'} Portal
        </h1>
        <p className={styles.portalSub}>You have chosen your path</p>
      </div>

      {/* Session Detail Card */}
      <div className={`${styles.card} ${accentClass}`}>
        <div className={styles.cardTop}>
          <span className={`${styles.badge} ${accentClass}`}>
            {isBlue ? '🔵' : '🔴'} {session.pill.toUpperCase()} PORTAL SESSION
          </span>
          <span className={styles.duration}>{session.duration}</span>
        </div>

        <h2 className={styles.sessionTitle}>{session.title}</h2>
        <p className={styles.sessionSub}>{session.subtitle}</p>
        <p className={styles.description}>{session.description}</p>

        {/* Time & Venue */}
        <div className={styles.metaGrid}>
          <div className={styles.metaBox}>
            <span className={styles.metaIcon}>🕐</span>
            <div>
              <div className={styles.metaLabel}>Time</div>
              <div className={styles.metaValue}>{session.time}</div>
            </div>
          </div>
          <div className={styles.metaBox}>
            <span className={styles.metaIcon}>📅</span>
            <div>
              <div className={styles.metaLabel}>Date</div>
              <div className={styles.metaValue}>
                {new Date(session.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
          <div className={styles.metaBox}>
            <span className={styles.metaIcon}>📍</span>
            <div>
              <div className={styles.metaLabel}>Venue</div>
              <div className={styles.metaValue}>{session.venue}</div>
            </div>
          </div>
          <div className={styles.metaBox}>
            <span className={styles.metaIcon}>⏱️</span>
            <div>
              <div className={styles.metaLabel}>Duration</div>
              <div className={styles.metaValue}>{session.duration}</div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* People */}
        <div className={styles.people}>
          {/* Mentor */}
          <div className={styles.personCard}>
            <div className={`${styles.avatar} ${accentClass}`}>
              {session.mentor.avatar}
            </div>
            <div>
              <div className={styles.personLabel}>Mentor</div>
              <div className={styles.personName}>{session.mentor.name}</div>
              <div className={styles.personRole}>{session.mentor.role}</div>
            </div>
          </div>
          {/* Faculty */}
          <div className={styles.personCard}>
            <div className={`${styles.avatar} ${accentClass}`}>
              {session.faculty.avatar}
            </div>
            <div>
              <div className={styles.personLabel}>Faculty</div>
              <div className={styles.personName}>{session.faculty.name}</div>
              <div className={styles.personRole}>{session.faculty.role}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {session.tags.map((tag) => (
            <span key={tag} className={`${styles.tag} ${accentClass}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PortalPage
