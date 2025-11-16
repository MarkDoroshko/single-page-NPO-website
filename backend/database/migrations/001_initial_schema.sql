-- Таблица пользователей
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Таблица городов присутствия Росатома
CREATE TABLE cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Таблица НКО организаций
CREATE TABLE nko_organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Местное сообщество и развитие территорий',
        'Социальная защита',
        'Экология и устойчивое развитие',
        'Здоровье и спорт',
        'Культура и образование',
        'Защита животных',
        'Другое'
    )),
    description TEXT,
    target_audience TEXT,
    plan_description TEXT,
    phone TEXT,
    address TEXT,
    city_id INTEGER NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    social_links TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (city_id) REFERENCES cities(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Индексы для ускорения поиска
CREATE INDEX idx_nko_city_id ON nko_organizations(city_id);
CREATE INDEX idx_nko_status ON nko_organizations(status);
CREATE INDEX idx_nko_category ON nko_organizations(category);
CREATE INDEX idx_users_email ON users(email);

-- Триггер для обновления updated_at
CREATE TRIGGER update_nko_timestamp
AFTER UPDATE ON nko_organizations
FOR EACH ROW
BEGIN
    UPDATE nko_organizations
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;