-- Тестовые НКО для прототипа (3 города по 1 НКО)

-- 1. Ангарск
INSERT INTO nko_organizations (
    name, category, description, volunteer_work,
    phone, address, city_id, website_url, social_links, status
) VALUES (
    'ОО ТОС АГО "12а микрорайон"',
    'Местное сообщество и развитие территорий',
    'Повышение качества жизни жителей 12а микрорайона г.Ангарска. Благоустройство территории, организация культурных и спортивных мероприятий.',
    'Помощь в организации мероприятий, благоустройство территории, работа с жителями.',
    '+7-xxx-xxx-xx-xx',
    'г. Ангарск, микрорайон 12а',
    (SELECT id FROM cities WHERE name = 'Ангарск'),
    '',
    'https://vk.com/id74647f055',
    'approved'
);

-- 2. Зеленогорск
INSERT INTO nko_organizations (
    name, category, description, volunteer_work,
    phone, address, city_id, website_url, social_links, status
) VALUES (
    'АНО "Клуб компьютерного спорта и кибер-спорта "Кибер-атом"',
    'Здоровье и спорт',
    'Развитие компьютерного спорта и кибер-спорта в городе, проведение турниров и просветительская работа.',
    'Организация турниров, помощь в проведении мероприятий, работа с подростками.',
    '+7-xxx-xxx-xx-xx',
    'г. Зеленогорск',
    (SELECT id FROM cities WHERE name = 'Зеленогорск'),
    '',
    'https://vk.com/cyberatom_zlk24',
    'approved'
);

-- 3. Снежинск
INSERT INTO nko_organizations (
    name, category, description, volunteer_work,
    phone, address, city_id, website_url, social_links, status
) VALUES (
    'Снежинская городская общественная организация "Союз женщин Снежинска"',
    'Местное сообщество и развитие территорий',
    'Поддержка семей с детьми, развитие социального предпринимательства, содействие качеству жизни старшего поколения.',
    'Работа с семьями, организация мероприятий, поддержка пожилых людей.',
    '+7-xxx-xxx-xx-xx',
    'г. Снежинск',
    (SELECT id FROM cities WHERE name = 'Снежинск'),
    '',
    'https://vk.com/sovetgensnz',
    'approved'
);