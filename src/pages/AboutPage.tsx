import styles from './AboutPage.module.css'

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>About Orientation Planner</h1>
      <p className={styles.lead}>
        We help teams run smooth, engaging orientations — from day one through onboarding completion.
      </p>
      <div className={styles.content}>
        <section>
          <h2>Our Mission</h2>
          <p>
            Orientation Planner was built to remove the chaos from planning large-scale orientation
            programs. Whether you're onboarding 10 people or 10,000, our tools scale with you.
          </p>
        </section>
        <section>
          <h2>Built With</h2>
          <ul className={styles.techList}>
            <li>React 18 + TypeScript</li>
            <li>React Router v6</li>
            <li>Vite for blazing fast dev experience</li>
            <li>CSS Modules for scoped styles</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
