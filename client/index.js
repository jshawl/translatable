const apiUrl = "http://localhost:8787/translatable/api";

async function translate(key) {
  try {
    const response = await fetch(`${apiUrl}/translate?key=${key}`);
    const data = await response.json();
    return data.value ?? key;
  } catch (error) {
    return key;
  }
}

async function debug() {
  const response = await fetch(`${apiUrl}/debug`);
  const data = await response.json();
  return data;
}

export const translatable = () => {
  const t = translate;
  t.debug = debug;
  return t;
};
