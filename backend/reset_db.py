import sqlite3
import os


def reset_database():
    # Удаляем старую БД
    if os.path.exists('database/database.db'):
        os.remove('database/database.db')
        print("Старая БД удалена")

    # Создаем новую
    conn = sqlite3.connect('database/database.db')

    with open('database/migrations/001_initial_schema.sql', 'r', encoding='utf-8') as f:
        conn.executescript(f.read())

    with open('database/seeds/cities.sql', 'r', encoding='utf-8') as f:
        conn.executescript(f.read())

    with open('database/seeds/nko.sql', 'r', encoding='utf-8') as f:
        conn.executescript(f.read())

    conn.commit()
    conn.close()
    print("Новая БД создана!")


if __name__ == "__main__":
    reset_database()