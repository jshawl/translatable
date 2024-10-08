export const getLocales = (acceptLanguage) =>
  acceptLanguage
    .split(/[q=\d\.\d]/)
    .flatMap((locale) => locale.replace(";", "").split(","))
    // allow listed
    .filter((locale) => ["en", "en-US", "fr"].includes(locale));

export const translate = async ({ key, locales, DB }) => {
  const sql = `
    SELECT keys1.untranslated as untranslated, keys2.untranslated as translated, keys2.locale as locale
    FROM translations
    JOIN keys keys1 ON
      translations.untranslated_key_id = keys1.id
    JOIN keys keys2 ON
      translations.translated_key_id = keys2.id
    WHERE keys1.untranslated = ? AND keys2.locale IN (${locales
      .map((l) => `'${l}'`)
      .join(",")})`;
  const { results } = await DB.prepare(sql).bind(key).all();

  const translations = [
    ...results,
    { locale: locales[0], untranslated: key, translated: key },
  ];

  for (let i = 0; i < locales.length; i++) {
    const result =
      translations.find((result) => result.locale === locales[i]) ?? {};
    const { locale, translated: value } = result;
    if (value) {
      return {
        locale,
        value,
      };
    }
  }

  // fallback to current locale, current key
  return { locale: locales[0], value: key };
};
