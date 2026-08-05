import { Session } from '@/data/sessions'
import styles from './SessionCard.module.css'

interface SessionCardProps {
  session: Session
  onClick?: () => void
}

const Avatar = ({ initials, pill }: { initials: string; pill: 'blue' | 'red' }) => (
  <div className={`${styles.avatar} ${pill === 'blue' ? styles.avatarBlue : styles.avatarRed}`}>
    {initials}
  </div>
)

const SessionCard = ({ session, onClick }: SessionCardProps) => {
  const isBlue = session.pill === 'blue'
  const accentClass = isBlue ? styles.blue : styles.red

  return (
    <div
      className={`${styles.card} ${accentClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Open ${session.pill} portal for ${session.title}`}
    >
      {/* Top bar */}
      <div className={styles.topBar}>
        <span className={`${styles.pillBadge} ${accentClass}`}>
          {isBlue ? '🔵' : '🔴'} {session.pill.toUpperCase()} PORTAL
        </span>
        <span className={styles.duration}>{session.duration}</span>
      </div>

      {/* Title */}
      <h3 className={styles.title}>{session.title}</h3>
      <p className={styles.subtitle}>{session.subtitle}</p>

      {/* Time & Venue */}
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>🕐</span>
          <span>{session.time}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>📍</span>
          <span>{session.venue}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Mentor & Faculty */}
      <div className={styles.people}>
        <div className={styles.person}>
          <Avatar initials={session.mentor.avatar} pill={session.pill} />
          <div className={styles.personInfo}>
            <span className={styles.personLabel}>Mentor</span>
            <span className={styles.personName}>{session.mentor.name}</span>
            <span className={styles.personRole}>{session.mentor.role}</span>
          </div>
        </div>
        <div className={styles.person}>
          <Avatar initials={session.faculty.avatar} pill={session.pill} />
          <div className={styles.personInfo}>
            <span className={styles.personLabel}>Faculty</span>
            <span className={styles.personName}>{session.faculty.name}</span>
            <span className={styles.personRole}>{session.faculty.role}</span>
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

      {/* CTA */}
      <div className={`${styles.cta} ${accentClass}`}>
        Enter {isBlue ? 'Blue' : 'Red'} Portal →
      </div>
    </div>
  )
}

export default SessionCard
