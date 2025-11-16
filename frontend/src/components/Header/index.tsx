import { useState } from 'react'
import styles from './index.module.scss'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img 
                src="/logo.png" 
                alt="Росатом" 
                className={styles.logoImage}
              />
            </div>
            <div className={styles.divider}></div>
            <h1 className={styles.title}>Карта добрых дел</h1>
          </div>

          <nav className={styles.nav}>
            <a href="#organizations" className={styles.navLink}>
              Организации
            </a>
            <a href="#about" className={styles.navLink}>
              О проекте
            </a>
            <a href="#contacts" className={styles.navLink}>
              Контакты
            </a>
          </nav>

          <div className={styles.authSection}>
            <button className={styles.loginBtn}>Войти</button>
          </div>

          <button className={styles.burger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#organizations" className={styles.mobileNavLink}>
              Организации
            </a>
            <a href="#about" className={styles.mobileNavLink}>
              О проекте
            </a>
            <a href="#contacts" className={styles.mobileNavLink}>
              Контакты
            </a>
            <button className={styles.mobileLoginBtn}>Войти</button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
