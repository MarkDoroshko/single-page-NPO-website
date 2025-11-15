import React from 'react';
import styles from './index.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          {/* Логотип Росатома - пока заглушка */}
          <div className={styles.logoPlaceholder}>Лого Росатома</div>
        </div>
        <div className={styles.disclaimer}>
          Информационная платформа для волонтеров и НКО
        </div>
        <div className={styles.copyright}>
          © 2025 «Карта добрых дел»
        </div>
      </div>
    </footer>
  );
};

export default Footer;