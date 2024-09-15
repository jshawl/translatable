export const getLocales = (acceptLanguage) =>
  acceptLanguage
    .split(/[q=\d\.\d]/)
    .flatMap((locale) => locale.replace(";", "").split(","))
    // allow listed
    .filter((locale) => ["en", "en-US", "fr"].includes(locale));

export const translate = async ({ key, locales, DB }) => {
  const sql = `SELECT * FROM translations WHERE untranslated = ? AND locale IN (${locales
    .map((l) => `'${l}'`)
    .join(",")})`;
  const { results } = await DB.prepare(sql).bind(key).all();

  for (let i = 0; i < locales.length; i++) {
    const result = results.find((result) => result.locale === locales[i]) ?? {};
    const { locale, translated: value } = result;
    if (value) {
      return {
        locale,
        value,
      };
    }
  }

  return { error: "Not Found" };
};
