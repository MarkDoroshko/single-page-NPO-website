import { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

declare global {
  interface Window {
    ymaps: any
  }
}

interface NKO {
  id: number
  name: string
  category: string
  description: string
  target_audience: string
  plan_description: string
  city_name: string
  status: string
  phone?: string
  address?: string
  website?: string
  social_links?: string
}

const rosatomCities = [
  'Все города',
  'Ангарск', 'Байкальск', 'Балаково', 'Билибино', 'Волгодонск',
  'Глазов', 'Десногорск', 'Димитровград', 'Железногорск', 'ЗАТО Заречный',
  'Заречный', 'Зеленогорск', 'Краснокаменск', 'Курчатов', 'Лесной',
  'Неман', 'Нововоронеж', 'Новоуральск', 'Обнинск', 'Озерск',
  'Певек', 'Полярные Зори', 'Саров', 'Северск', 'Снежинск',
  'Советск', 'Сосновый Бор', 'Трехгорный', 'Удомля', 'Усолье-Сибирское',
  'Электросталь', 'Энергодар'
];

const MapSection = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const placemarksRef = useRef<any[]>([])
  const [organizations, setOrganizations] = useState<NKO[]>([])
  const [selectedOrg, setSelectedOrg] = useState<NKO | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('Все')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [allOrganizations, setAllOrganizations] = useState<NKO[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('Все города')

  // Функция для обрезки текста
  const truncateDescription = (text: string, wordLimit: number = 15) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Обработчик для кнопки "Подробнее" в балуне
  const handleDetailsClick = (org: NKO) => {
    setSelectedOrg(org);
    if (mapInstance.current) {
      mapInstance.current.balloon.close();
    }
  };

  // Закрыть модальное окно
  const closeModal = () => {
    setSelectedOrg(null);
  };

  // Функция для обновления меток на карте
  const updateMapMarkers = (orgsToShow: NKO[]) => {
    if (!mapInstance.current) return;

    // Очищаем все метки
    mapInstance.current.geoObjects.removeAll();
    placemarksRef.current = [];

    // Функция для получения координат городов
    const getCityCoords = (city: string): [number, number] => {
      const coords: {[key: string]: [number, number]} = {
        'Ангарск': [52.28, 104.28],
        'Зеленогорск': [56.11, 94.59],
        'Снежинск': [56.08, 60.73],
        'Байкальск': [51.52, 104.16],
        'Глазов': [58.14, 52.66],
        'Железногорск': [56.25, 93.53],
        'Москва': [55.76, 37.64],
        'Санкт-Петербург': [59.94, 30.31],
      };
      return coords[city] || [55.76, 37.64];
    };

    // Добавляем только отфильтрованные метки
    orgsToShow.forEach((nko: NKO) => {
      const coords = getCityCoords(nko.city_name);

      const balloonContent = `
        <div style="
          padding: 15px;
          font-family: Arial, sans-serif;
          max-width: 300px;
          background: white;
          border-radius: 12px;
          text-align: left;
        ">
          <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
            <div style="
              font-size: 24px;
              background: #f8f9fa;
              padding: 12px;
              border-radius: 8px;
            ">🏢</div>
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #003366; font-weight: 600;">
                ${nko.name}
              </h3>
              <span style="font-size: 12px; color: #00A651; font-weight: 500;">
                ${nko.city_name}
              </span>
            </div>
          </div>

          <div style="
            display: inline-block;
            background: rgba(0, 166, 81, 0.1);
            color: #00A651;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 12px;
          ">
            ${nko.category}
          </div>

          <p style="
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #666;
            line-height: 1.4;
          ">
            ${truncateDescription(nko.description)}
          </p>

          <button onclick="window.mapDetailsClick(${nko.id})" style="
            width: 100%;
            background: #003366;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s;
          " onmouseover="this.style.background='#002244'"
             onmouseout="this.style.background='#003366'">
            Подробнее
          </button>
        </div>
      `;

      const placemark = new window.ymaps.Placemark(
        coords,
        {
          balloonContent: balloonContent,
          organizationData: nko
        },
        {
          iconLayout: 'default#image',
          iconImageHref: '/mark.svg',
          iconImageSize: [40, 40],
          iconImageOffset: [-20, -40],
          balloonCloseButton: false
        }
      );

      mapInstance.current.geoObjects.add(placemark);
      placemarksRef.current.push(placemark);
    });
  };

  // Функция фильтрации организаций
  const filterOrganizations = () => {
      let filtered = allOrganizations;

        // Фильтр по городу
        if (selectedCity !== 'Все города') {
          filtered = filtered.filter(org => org.city_name === selectedCity);
        }

      // Фильтр по категории
      if (selectedCategory !== 'Все') {
        filtered = filtered.filter(org => org.category === selectedCategory);
      }

      // Фильтр по поисковому запросу
      if (searchQuery.trim()) {
        filtered = filtered.filter(org =>
          org.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setOrganizations(filtered);
      updateMapMarkers(filtered);
    };

  // Обработчик изменения фильтра
  const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
    };

    // Обработчик изменения поискового запроса
    const handleSearchChange = (query: string) => {
      setSearchQuery(query);
    };

    const handleCityChange = (city: string) => {
      setSelectedCity(city);
    };

  // Очистка поиска
  const clearSearch = () => {
    setSearchQuery('');
    filterOrganizations();
  };

    useEffect(() => {
      if (allOrganizations.length > 0) {
        filterOrganizations();
      }
    }, [selectedCategory, searchQuery, selectedCity, allOrganizations]);

  useEffect(() => {
    const initMap = async () => {
      if (mapRef.current && window.ymaps) {
        window.ymaps.ready(async () => {
          mapInstance.current = new window.ymaps.Map(mapRef.current, {
            center: [55.76, 37.64],
            zoom: 4,
            controls: ['zoomControl', 'fullscreenControl'],
          });

          try {
            const response = await fetch('http://localhost:8000/nko');
            const data = await response.json();

            setAllOrganizations(data.nko);
            setOrganizations(data.nko);

            const uniqueCategories = [...new Set(data.nko.map((org: NKO) => org.category))];
            setCategories(['Все', ...uniqueCategories]);

            updateMapMarkers(data.nko);

            (window as any).mapDetailsClick = (orgId: number) => {
              const org = data.nko.find((nko: NKO) => nko.id === orgId);
              if (org) {
                handleDetailsClick(org);
              }
            };

          } catch (error) {
            console.error('Ошибка загрузки НКО для карты:', error);
          }
        });
      }
    };

    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=aec83077-0ab1-49bd-a54b-93b31de15c9c&lang=ru_RU';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
      delete (window as any).mapDetailsClick;
    };
  }, []);

  return (
    <section className={styles.mapSection}>
      <div className={styles.container}>
        <div className={styles.mapContent}>
          <div className={styles.mapHeader}>
            <div className={styles.mapIcon}>🗺️</div>
            <h2 className={styles.mapTitle}>Карта добрых дел</h2>
            <p className={styles.mapDescription}>
              Интерактивная карта благотворительных организаций городов Росатома
            </p>
          </div>

          <div className={styles.mapContainer}>
            {/* Панель фильтров */}
            <div className={styles.filtersPanel}>
              <h3>Поиск и фильтры</h3>

              {/* Поиск по названию */}
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Поиск по названию организации..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button onClick={clearSearch} className={styles.clearSearch}>
                    ×
                  </button>
                )}
              </div>
                {/* Фильтр по городам */}
                <div className={styles.citySection}>
                  <h4>Город</h4>
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className={styles.citySelect}
                  >
                    {rosatomCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

              {/* Фильтры по категориям */}
              <div className={styles.categorySection}>
                <h4>Категории</h4>
                <div className={styles.categoryFilters}>
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`${styles.filterBtn} ${
                        selectedCategory === category ? styles.filterBtnActive : ''
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Подсказка */}
              <div className={styles.helpText}>
                💡 Используйте поиск и фильтры для быстрого поиска организаций
              </div>
            </div>

            <div ref={mapRef} className={styles.yandexMap} style={{ width: '100%', height: '500px' }} />
          </div>

          <div className={styles.mapStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>32</span>
              <span className={styles.statLabel}>города</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{organizations.length}</span>
              <span className={styles.statLabel}>организаций</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>волонтёров</span>
            </div>
          </div>

          {/* Модальное окно */}
          {selectedOrg && (
            <div className={styles.modalOverlay} onClick={closeModal}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={closeModal}>×</button>

                <h2>{selectedOrg.name}</h2>
                <p style={{textAlign: 'left'}}>Город: {selectedOrg.city_name}</p>
                <p style={{textAlign: 'left'}}>Категория: {selectedOrg.category}</p>
                <p style={{textAlign: 'left'}}>Описание: {selectedOrg.description}</p>
                <p style={{textAlign: 'left'}}>Целевая аудитория: {selectedOrg.target_audience}</p>
                <p style={{whiteSpace: 'pre-line', textAlign: 'left'}}>План мероприятий на год: {selectedOrg.plan_description}</p>
                {selectedOrg.social_links && (
                  <p style={{textAlign: 'left'}}>
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
        </div>
      </div>
    </section>
  );
};

export default MapSection;