import { useEffect, useState } from 'react'
import styles from './index.module.scss'

// Тип для НКО из нашей БД
interface NKO {
  id: number
  name: string
  category: string
  description: string
  target_audience: string
  plan_description: string
  city_name: string
  status: string
}

// Функция для обрезки текста
const truncateDescription = (text: string, wordLimit: number = 25) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

const Organizations = () => {
  const [organizations, setOrganizations] = useState<NKO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrg, setSelectedOrg] = useState<NKO | null>(null)

  // Загружаем данные из нашего API
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('http://localhost:8000/nko')
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных')
        }
        const data = await response.json()
        setOrganizations(data.nko)
      } catch (err) {
        setError('Не удалось загрузить организации')
        console.error('Ошибка:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrganizations()
  }, [])

  // Обработчик для кнопки "Подробнее"
  const handleDetailsClick = (org: NKO) => {
    console.log('Клик по кнопке Подробнее:', org.name)
    setSelectedOrg(org)
  }

  // Обработчик для кнопки "Стать волонтёром"
  const handleVolunteerClick = (org: NKO) => {
    alert(`Чтобы стать волонтёром в ${org.name}, свяжитесь с организацией по контактам из раздела "Подробнее"`)
  }

  // Закрыть модальное окно
  const closeModal = () => {
    setSelectedOrg(null)
  }

  if (loading) {
    return (
      <section id="organizations" className={styles.organizations}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Благотворительные организации</h2>
            <p className={styles.subtitle}>Загрузка данных...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="organizations" className={styles.organizations}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Благотворительные организации</h2>
            <p className={styles.subtitle} style={{color: 'red'}}>{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="organizations" className={styles.organizations}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Благотворительные организации</h2>
          <p className={styles.subtitle}>
            {organizations.length} организаций в городах Росатома ждут вашей помощи
          </p>
        </div>

        <div className={styles.grid}>
          {organizations.map((org) => (
            <div key={org.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.logo}>🏢</div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.orgName}>{org.name}</h3>
                  <span className={styles.city}>{org.city_name}</span>
                </div>
              </div>

              <div className={styles.category}>{org.category}</div>

              <p className={styles.description}>{truncateDescription(org.description)}</p>

              <div className={styles.cardActions}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => handleDetailsClick(org)}
                >
                  Подробнее
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => handleVolunteerClick(org)}
                >
                  Стать волонтёром
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Модальное окно */}
        {selectedOrg && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={closeModal}>×</button>

                  <h2>{selectedOrg.name}</h2>
                  <p>Город: {selectedOrg.city_name}</p>
                  <p>Категория: {selectedOrg.category}</p>
                  <p>Описание: {selectedOrg.description}</p>
                  <p>Целевая аудитория: {selectedOrg.target_audience}</p>
                  <p style={{whiteSpace: 'pre-line'}}>План мероприятий на год: {selectedOrg.plan_description}</p>
                  {selectedOrg.social_links && (
                      <p>
                        Ссылка:{" "}
                        <a href={selectedOrg.social_links} target="_blank" rel="noopener noreferrer"
                           style={{color: '#00A651', textDecoration: 'underline'}}>
                          {selectedOrg.social_links}
                        </a>
                      </p>
                    )}
              <button className={styles.primaryBtn} onClick={closeModal}>
                Закрыть
              </button>
            </div>
          </div>
        )}

        <div className={styles.cta}>
          <button className={styles.ctaBtn}>Показать все организации</button>
        </div>
      </div>
    </section>
  )
}

export default Organizations