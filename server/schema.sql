DROP TABLE IF EXISTS keys;
CREATE TABLE IF NOT EXISTS keys
    (id INTEGER PRIMARY KEY, locale TEXT, untranslated TEXT);
INSERT INTO keys
    (id, locale, untranslated) VALUES
    (1, 'en', 'Hello'),
    (2, 'fr', 'Bonjour');

DROP TABLE IF EXISTS translations;
CREATE TABLE IF NOT EXISTS translations
    (id INTEGER PRIMARY KEY, untranslated_key_id INTEGER, translated_key_id INTEGER);
INSERT INTO translations 
    (id, untranslated_key_id, translated_key_id) VALUES
    (1, 1, 2),
    (2, 2, 1);

SELECT keys1.untranslated AS untranslated, keys2.untranslated AS translated
FROM translations
JOIN keys keys1 ON
    translations.untranslated_key_id = keys1.id
JOIN keys keys2 ON
    translations.translated_key_id = keys2.id;
