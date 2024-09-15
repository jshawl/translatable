const apiUrl = "http://localhost:8787";

async function translate(key) {
  const response = await fetch(`${apiUrl}/api/translate?key=${key}`);
  const data = await response.json();
  return data.value;
}

async function debug() {
  const response = await fetch(`${apiUrl}/api/debug`);
  const data = await response.json();
  return data;
}

export const translatable = () => {
  const t = translate;
  t.debug = debug;
  return t;
};
