import { useEffect, useState } from 'react'
import styles from './index.module.scss'

// Тип для НКО из нашей БД
interface NKO {
  id: number
  name: string
  category: string
  description: string
  volunteer_work: string
  city_name: string
  status: string
}

const Organizations = () => {
  const [organizations, setOrganizations] = useState<NKO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
                <div className={styles.logo}>🏢</div> {/* Заглушка для лого */}
                <div className={styles.cardInfo}>
                  <h3 className={styles.orgName}>{org.name}</h3>
                  <span className={styles.city}>{org.city_name}</span>
                </div>
              </div>

              <div className={styles.category}>{org.category}</div>

              <p className={styles.description}>{org.description}</p>

              <div className={styles.volunteerWork}>
                <strong>Волонтёрство:</strong> {org.volunteer_work || 'Помощь в организации мероприятий'}
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