import styles from './index.module.scss'

const organizations = [
  {
    id: 1,
    name: "Фонд помощи детям 'Надежда'",
    category: 'Помощь детям',
    description: 'Оказываем поддержку детям из малообеспеченных семей и детям-сиротам.',
    volunteerWork: 'Проведение мероприятий, сбор средств, образовательная поддержка',
    city: 'Москва',
    logo: '👶',
    rating: 4.8,
  },
  {
    id: 2,
    name: "Экологический центр 'Зелёный мир'",
    category: 'Экология',
    description: 'Занимаемся охраной окружающей среды и экологическим просвещением.',
    volunteerWork: 'Уборка территорий, посадка деревьев, эко-просвещение',
    city: 'Санкт-Петербург',
    logo: '🌿',
    rating: 4.9,
  },
  {
    id: 3,
    name: "Приют для животных 'Добрые руки'",
    category: 'Помощь животным',
    description: 'Спасение и устройство бездомных животных в любящие семьи.',
    volunteerWork: 'Уход за животными, помощь ветеринарам, организация акций',
    city: 'Нижний Новгород',
    logo: '🐕',
    rating: 4.7,
  },
  {
    id: 4,
    name: "Культурный фонд 'Наследие'",
    category: 'Культура',
    description: 'Сохранение и популяризация культурного наследия России.',
    volunteerWork: 'Организация выставок, экскурсий, культурных мероприятий',
    city: 'Екатеринбург',
    logo: '🎭',
    rating: 4.6,
  },
]

const Organizations = () => {
  return (
    <section id="organizations" className={styles.organizations}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Благотворительные организации</h2>
          <p className={styles.subtitle}>Более 150 организаций по всей России ждут вашей помощи</p>
        </div>

        <div className={styles.grid}>
          {organizations.map((org) => (
            <div key={org.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.logo}>{org.logo}</div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.orgName}>{org.name}</h3>
                  <span className={styles.city}>{org.city}</span>
                </div>
                <div className={styles.rating}>⭐ {org.rating}</div>
              </div>

              <div className={styles.category}>{org.category}</div>

              <p className={styles.description}>{org.description}</p>

              <div className={styles.volunteerWork}>
                <strong>Волонтёрство:</strong> {org.volunteerWork}
              </div>

              <div className={styles.cardActions}>
                <button className={styles.primaryBtn}>Подробнее</button>
                <button className={styles.secondaryBtn}>Стать волонтёром</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <button className={styles.ctaBtn}>Показать все организации</button>
        </div>
      </div>
    </section>
  )
}

export default Organizations
