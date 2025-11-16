import sqlite3

def create_database():
    conn = sqlite3.connect('database/database.db')

    print("Создаем таблицы и заполняем данными...")

    # Выполняем все SQL файлы
    with open('database/migrations/001_initial_schema.sql', 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
        print("Схема БД создана")

    with open('database/seeds/cities.sql', 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
        print("Города добавлены")

    with open('database/seeds/nko.sql', 'r', encoding='utf-8') as f:
        conn.executescript(f.read())
        print("НКО добавлены")

    conn.commit()
    conn.close()
    print("База данных полностью готова!")


if __name__ == "__main__":
    create_database()