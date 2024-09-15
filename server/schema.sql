DROP TABLE IF EXISTS translations;
CREATE TABLE IF NOT EXISTS translations
    (id INTEGER PRIMARY KEY, locale TEXT, untranslated TEXT, translated Text);
INSERT INTO translations 
    (id, locale, untranslated, translated) VALUES 
    (1, 'en', 'Hello', 'Hello'),
    (2, 'fr', 'Hello', 'Bonjour');