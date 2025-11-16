from fastapi import FastAPI, HTTPException, Form
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="NKO Map API")

# Разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321", "http://127.0.0.1:4321"],  # Явно указываем фронтенд
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение к БД
def get_db():
    conn = sqlite3.connect('database/database.db')
    conn.row_factory = sqlite3.Row  # Чтобы возвращать dict вместо tuple
    return conn

# 1. Получить все города
@app.get("/cities")
def get_cities():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cities ORDER BY name")
    cities = cursor.fetchall()
    conn.close()
    return {"cities": [dict(city) for city in cities]}

# 2. Получить все одобренные НКО
@app.get("/nko")
def get_all_nko():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT nko.*, cities.name as city_name 
        FROM nko_organizations nko
        JOIN cities ON nko.city_id = cities.id
        WHERE nko.status = 'approved'
        ORDER BY nko.name
    """)
    nko_list = cursor.fetchall()
    conn.close()
    return {"nko": [dict(nko) for nko in nko_list]}

# 3. Получить НКО по ID города
@app.get("/nko/city/{city_id}")
def get_nko_by_city(city_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT nko.*, cities.name as city_name 
        FROM nko_organizations nko
        JOIN cities ON nko.city_id = cities.id
        WHERE nko.city_id = ? AND nko.status = 'approved'
    """, (city_id,))
    nko_list = cursor.fetchall()
    conn.close()
    return {"nko": [dict(nko) for nko in nko_list]}

# 4. Получить одну НКО по ID
@app.get("/nko/{nko_id}")
def get_nko_by_id(nko_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT nko.*, cities.name as city_name 
        FROM nko_organizations nko
        JOIN cities ON nko.city_id = cities.id
        WHERE nko.id = ?
    """, (nko_id,))
    nko = cursor.fetchone()
    conn.close()
    if nko:
        return dict(nko)
    raise HTTPException(status_code=404, detail="НКО не найдена")


# Модель данных для создания НКО
class NKOCreate(BaseModel):
    name: str
    category: str
    description: str
    target_audience: str = ""
    plan_description: str = ""
    phone: str = ""
    address: str = ""
    city_id: int
    website_url: str = ""
    social_links: str = ""


# POST - Добавить новую НКО
@app.post("/nko")
def create_nko(nko_data: NKOCreate):
    conn = get_db()
    cursor = conn.cursor()

    try:
        # Проверяем существование города
        cursor.execute("SELECT id FROM cities WHERE id = ?", (nko_data.city_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=400, detail="Город не найден")

        # Добавляем новую НКО (статус 'pending' - на модерации)
        cursor.execute("""
            INSERT INTO nko_organizations 
            (name, category, description, target_audience, plan_description, phone, address, city_id, website_url, social_links, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        """, (
            nko_data.name, nko_data.category, nko_data.description,
            nko_data.target_audience, nko_data.plan_description, nko_data.phone, nko_data.address,
            nko_data.city_id, nko_data.website_url, nko_data.social_links
        ))

        conn.commit()
        nko_id = cursor.lastrowid
        conn.close()

        return {
            "message": "НКО успешно добавлена и отправлена на модерацию",
            "nko_id": nko_id,
            "status": "pending"
        }

    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Ошибка при создании НКО: {str(e)}")


# PUT - Обновить существующую НКО
class NKOUpdate(BaseModel):
    name: str = None
    category: str = None
    description: str = None
    target_audience: str = None
    plan_description: str = None
    phone: str = None
    address: str = None
    website_url: str = None
    social_links: str = None


@app.put("/nko/{nko_id}")
def update_nko(nko_id: int, nko_data: NKOUpdate):
    conn = get_db()
    cursor = conn.cursor()

    try:
        # Проверяем существование НКО
        cursor.execute("SELECT id FROM nko_organizations WHERE id = ?", (nko_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="НКО не найдена")

        # Собираем только те поля, которые были переданы
        update_fields = []
        update_values = []

        if nko_data.name is not None:
            update_fields.append("name = ?")
            update_values.append(nko_data.name)
        if nko_data.category is not None:
            update_fields.append("category = ?")
            update_values.append(nko_data.category)
        if nko_data.description is not None:
            update_fields.append("description = ?")
            update_values.append(nko_data.description)
        if nko_data.target_audience is not None:
            update_fields.append("target_audience = ?")
            update_values.append(nko_data.target_audience)
        if nko_data.plan_description is not None:
            update_fields.append("plan_description = ?")
            update_values.append(nko_data.plan_description)
        if nko_data.phone is not None:
            update_fields.append("phone = ?")
            update_values.append(nko_data.phone)
        if nko_data.address is not None:
            update_fields.append("address = ?")
            update_values.append(nko_data.address)
        if nko_data.website_url is not None:
            update_fields.append("website_url = ?")
            update_values.append(nko_data.website_url)
        if nko_data.social_links is not None:
            update_fields.append("social_links = ?")
            update_values.append(nko_data.social_links)

        # Если нет полей для обновления
        if not update_fields:
            raise HTTPException(status_code=400, detail="Нет данных для обновления")

        # Добавляем ID в конец значений
        update_values.append(nko_id)

        # Выполняем обновление
        query = f"UPDATE nko_organizations SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, update_values)

        conn.commit()
        conn.close()

        return {"message": "НКО успешно обновлена", "nko_id": nko_id}

    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении НКО: {str(e)}")


# DELETE - Удалить НКО (для админа)
@app.delete("/nko/{nko_id}")
def delete_nko(nko_id: int):
    conn = get_db()
    cursor = conn.cursor()

    try:
        # Проверяем существование НКО
        cursor.execute("SELECT id FROM nko_organizations WHERE id = ?", (nko_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="НКО не найдена")

        # Удаляем НКО
        cursor.execute("DELETE FROM nko_organizations WHERE id = ?", (nko_id,))

        conn.commit()
        conn.close()

        return {"message": "НКО успешно удалена", "nko_id": nko_id}

    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении НКО: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)