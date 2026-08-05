import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import styles from './Layout.module.css'

const Layout = () => {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
