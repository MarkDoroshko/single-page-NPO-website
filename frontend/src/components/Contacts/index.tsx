import styles from './index.module.scss'

const Contacts = () => {
  return (
    <section id="contacts" className={styles.contacts}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Контакты</h2>
          <p className={styles.subtitle}>Свяжитесь с нами для сотрудничества или получения информации</p>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📧</div>
              <div className={styles.contactDetails}>
                <h4>Электронная почта</h4>
                <p>dobro@rosatom.ru</p>
                <span className={styles.contactNote}>Отвечаем в течение 24 часов</span>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📞</div>
              <div className={styles.contactDetails}>
                <h4>Телефон</h4>
                <p>+7 (495) 123-45-67</p>
                <span className={styles.contactNote}>Пн-Пт с 9:00 до 18:00</span>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>🏢</div>
              <div className={styles.contactDetails}>
                <h4>Адрес</h4>
                <p>г. Москва, ул. Примерная, д. 1</p>
                <span className={styles.contactNote}>Центральный офис</span>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>🌐</div>
              <div className={styles.contactDetails}>
                <h4>Социальные сети</h4>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.socialLink}>
                    VK
                  </a>
                  <a href="#" className={styles.socialLink}>
                    Telegram
                  </a>
                  <a href="#" className={styles.socialLink}>
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.form}>
            <h3 className={styles.formTitle}>Остались вопросы?</h3>
            <form className={styles.contactForm}>
              <div className={styles.formGroup}>
                <input type="text" placeholder="Ваше имя" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <input type="email" placeholder="Электронная почта" className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <textarea placeholder="Ваше сообщение" rows={5} className={styles.formTextarea}></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contacts
