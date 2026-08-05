import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import styles from './NotFoundPage.module.css'

const NotFoundPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page Not Found</h2>
      <p className={styles.desc}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
