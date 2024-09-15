import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";

import { getLocales, translate } from "./utils";

const app = new Hono();

app.use("/api/*", cors());

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
  const result = await translate({ key, locales, DB });
  if (result.error) {
    c.status(404);
  }
  return c.json(result);
});

export default app;
