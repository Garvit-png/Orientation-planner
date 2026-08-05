import { useNavigate } from 'react-router-dom'
import SessionCard from '@/components/ui/SessionCard'
import { getUpcomingSessions } from '@/data/sessions'
import styles from './HomePage.module.css'

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const HomePage = () => {
  const navigate = useNavigate()
  const upcomingSessions = getUpcomingSessions()
  const today = formatDate(new Date())

  return (
    <div className={styles.page}>
      {/* Date Banner */}
      <div className={styles.dateBanner}>
        <span className={styles.dateIcon}>📅</span>
        <span className={styles.dateText}>{today}</span>
      </div>

      {/* Pill Image Section */}
      <section className={styles.pillSection}>
        <h1 className={styles.heading}>Choose Your Path</h1>
        <p className={styles.subheading}>
          Click on a hand to enter your orientation portal
        </p>

        <div className={styles.pillWrapper}>
          <img
            src="/red-blue-pill.jpg"
            alt="Choose your pill"
            className={styles.pillImage}
            draggable={false}
          />

          {/* Blue Hand Hotspot — left side */}
          <button
            className={`${styles.hotspot} ${styles.blueHotspot}`}
            onClick={() => navigate('/portal/blue')}
            aria-label="Enter Blue Portal"
          >
            <span className={styles.hotspotRipple} />
            <span className={styles.hotspotLabel}>Blue Portal</span>
          </button>

          {/* Red Hand Hotspot — right side */}
          <button
            className={`${styles.hotspot} ${styles.redHotspot}`}
            onClick={() => navigate('/portal/red')}
            aria-label="Enter Red Portal"
          >
            <span className={styles.hotspotRipple} />
            <span className={styles.hotspotLabel}>Red Portal</span>
          </button>
        </div>

        <p className={styles.hint}>
          <span className={styles.blueText}>Blue</span> — Stay grounded &nbsp;|&nbsp;{' '}
          <span className={styles.redText}>Red</span> — Explore beyond
        </p>
      </section>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <section className={styles.sessionsSection}>
          <h2 className={styles.sectionTitle}>
            {upcomingSessions.length === 1 ? 'Current Session' : 'Upcoming Sessions'}
          </h2>
          <div className={styles.sessionGrid}>
            {upcomingSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => navigate(`/portal/${session.pill}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
