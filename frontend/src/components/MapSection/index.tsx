import styles from './index.module.scss';

const MapSection = () => {
  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapContent}>
            <div className={styles.mapIcon}>🗺️</div>
            <h2 className={styles.mapTitle}>Карта добрых дел</h2>
            <p className={styles.mapDescription}>
              Интерактивная карта благотворительных организаций городов Росатома
            </p>
            <div className={styles.mapStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>32</span>
                <span className={styles.statLabel}>города</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>150+</span>
                <span className={styles.statLabel}>организаций</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>волонтёров</span>
              </div>
            </div>
            <button className={styles.exploreBtn}>
              Исследовать карту
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;