import { Hono } from "hono";
import { cors } from "hono/cors";
const app = new Hono();
app.use("/api/*", cors());

const translations = {
  en: {
    Hello: "Hello",
  },
  fr: {
    Hello: "Bonjour",
  },
};

const locales = (acceptLanguage) =>
  acceptLanguage
    .split(/[q=\d\.\d]/)
    .flatMap((locale) => locale.replace(";", "").split(","))
    .filter(String);

app.get("/api/debug", (c) => {
  const acceptLanguage = c.req.header("Accept-Language");

  return c.json({
    "Accept-Language": acceptLanguage,
    locales: locales(acceptLanguage),
  });
});

app.get("/api/translate", (c) => {
  const ls = locales(c.req.header("Accept-Language"));
  const key = c.req.query("key");
  for (let i = 0; i < ls.length; i++) {
    const value = translations[ls[i]]?.[key];
    if (value) {
      return c.json({
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
