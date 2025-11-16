import { useEffect, useRef } from 'react'
import styles from './index.module.scss'

declare global {
  interface Window {
    ymaps: any
  }
}

const MapSection = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
  const initMap = async () => {  // Делаем функцию async
    if (mapRef.current && window.ymaps) {
      window.ymaps.ready(async () => {  // Добавляем async здесь
        mapInstance.current = new window.ymaps.Map(mapRef.current, {
          center: [55.76, 37.64],
          zoom: 4,  // Увеличиваем zoom чтобы видеть всю Россию
          controls: ['zoomControl', 'fullscreenControl'],
        })

        // ЗАГРУЖАЕМ РЕАЛЬНЫЕ НКО ИЗ НАШЕГО API
        try {
          const response = await fetch('http://localhost:8000/nko')
          const data = await response.json()

          // Функция для получения координат городов
          const getCityCoords = (city: string): [number, number] => {
            const coords: {[key: string]: [number, number]} = {
              'Ангарск': [52.28, 104.28],
              'Зеленогорск': [56.11, 94.59],
              'Снежинск': [56.08, 60.73],
              'Москва': [55.76, 37.64],
              'Санкт-Петербург': [59.94, 30.31],
              'Нижний Новгород': [56.33, 44.0],
              'Екатеринбург': [56.84, 60.61],
              // Добавь остальные города при необходимости
            }
            return coords[city] || [55.76, 37.64] // По умолчанию Москва
          }

          // Добавляем метки для каждой НКО из нашей БД
          data.nko.forEach((nko: any) => {
            const coords = getCityCoords(nko.city_name)
            const placemark = new window.ymaps.Placemark(
              coords,
              {
                balloonContent: `
                  <strong>${nko.name}</strong><br/>
                  <em>${nko.category}</em><br/>
                  ${nko.description}<br/>
                  <b>Город:</b> ${nko.city_name}
                `
              },
              { preset: 'islands#icon', iconColor: '#0095b6' }
            )
            mapInstance.current.geoObjects.add(placemark)
          })

          // ОБНОВЛЯЕМ СТАТИСТИКУ реальными цифрами
          const statsElement = document.querySelector(`.${styles.statNumber}`)
          if (statsElement) {
            // Можно обновить цифры на реальные
            console.log(`Загружено ${data.nko.length} организаций`)
          }

        } catch (error) {
          console.error('Ошибка загрузки НКО для карты:', error)
        }
      })
    }
  }

    // Загружаем API Яндекс.Карт
    if (!window.ymaps) {
      const script = document.createElement('script')
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=aec83077-0ab1-49bd-a54b-93b31de15c9c&lang=ru_RU'
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    // Очистка при размонтировании компонента
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy()
      }
    }
  }, [])

  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <div className={styles.mapContent}>
          <div className={styles.mapHeader}>
            <div className={styles.mapIcon}>🗺️</div>
            <h2 className={styles.mapTitle}>Карта добрых дел</h2>
            <p className={styles.mapDescription}>Интерактивная карта благотворительных организаций городов Росатома</p>
          </div>

          <div className={styles.mapContainer}>
            <div ref={mapRef} className={styles.yandexMap} style={{ width: '100%', height: '400px' }} />
          </div>

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

          <button className={styles.exploreBtn}>Исследовать карту</button>
        </div>
      </div>
    </section>
  )
}

export default MapSection
