import styles from './index.module.scss'

const About = () => {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <h2 className={styles.title}>О проекте</h2>
            <p className={styles.description}>
              «Карта добрых дел» — это уникальная платформа, объединяющая благотворительные организации и волонтёров в
              городах присутствия Росатома.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎯</div>
                <div className={styles.featureText}>
                  <h4>Цель проекта</h4>
                  <p>Создание единого пространства для развития волонтёрства и благотворительности</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🤝</div>
                <div className={styles.featureText}>
                  <h4>Для кого</h4>
                  <p>Для всех, кто хочет помогать: волонтёров, организаций и просто неравнодушных людей</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🌍</div>
                <div className={styles.featureText}>
                  <h4>Масштаб</h4>
                  <p>32 города России, более 150 организаций и тысячи волонтёров</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.imageSection}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.imageContent}>
                <span className={styles.imageText}>Карта добрых дел</span>
                <span className={styles.imageSubtext}>Росатом</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
