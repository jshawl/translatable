import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
const app = new Hono();
app.use("/api/*", cors());

const getLocales = (acceptLanguage) =>
  acceptLanguage
    .split(/[q=\d\.\d]/)
    .flatMap((locale) => locale.replace(";", "").split(","))
    // allow listed
    .filter((locale) => ["en", "en-US", "fr"].includes(locale));

app.get("/api/debug", (c) => {
  const acceptLanguage = c.req.header("Accept-Language");

  return c.json({
    "Accept-Language": acceptLanguage,
    locales: getLocales(acceptLanguage),
  });
});

app.get("/api/db", async (c) => {
  const { DB } = env(c);
  const { results } = await DB.prepare("SELECT * FROM translations").all();
  return c.json({ results });
});

app.get("/api/translate", async (c) => {
  const locales = getLocales(c.req.header("Accept-Language"));
  const key = c.req.query("key");
  const { DB } = env(c);
  const sql = `SELECT * FROM translations WHERE untranslated = ? AND locale IN (${locales
    .map((l) => `'${l}'`)
    .join(",")})`;
  const { results } = await DB.prepare(sql).bind(key).all();

  for (let i = 0; i < locales.length; i++) {
    const result = results.find((result) => result.locale === locales[i]);
    const value = result?.translated;
    const locale = result?.locale;
    if (value) {
      return c.json({
        locale,
        value,
      });
    }
  }
  c.status(404);
  return c.json({
    error: "Not Found",
  });
});

export default app;
