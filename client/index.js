async function translate(key) {
  const response = await fetch(
    `http://localhost:8787/api/translate?key=${key}`
  );
  const data = await response.json();
  return data.value;
}

async function debug() {
  const response = await fetch(`http://localhost:8787/api/debug`);
  const data = await response.json();
  return data;
}

export const translatable = () => {
  const t = translate;
  t.debug = debug;
  return t;
};
