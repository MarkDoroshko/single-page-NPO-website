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
    // Функция инициализации карты
    const initMap = () => {
      if (mapRef.current && window.ymaps) {
        window.ymaps.ready(() => {
          mapInstance.current = new window.ymaps.Map(mapRef.current, {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ['zoomControl', 'fullscreenControl'],
          })

          // Добавляем несколько меток для примера
          const markers = [
            { coords: [55.76, 37.64], title: 'Москва' },
            { coords: [59.94, 30.31], title: 'Санкт-Петербург' },
            { coords: [56.33, 44.0], title: 'Нижний Новгород' },
            { coords: [56.84, 60.61], title: 'Екатеринбург' },
          ]

          markers.forEach((marker) => {
            const placemark = new window.ymaps.Placemark(
              marker.coords,
              { balloonContent: marker.title },
              { preset: 'islands#icon', iconColor: '#0095b6' }
            )
            mapInstance.current.geoObjects.add(placemark)
          })
        })
      }
    }

    // Загружаем API Яндекс.Карт
    if (!window.ymaps) {
      const script = document.createElement('script')
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=f5521c4a-ab4c-4838-80ed-ab93cb789abf&lang=ru_RU'
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
