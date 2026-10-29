const TRANSLATION_ENDPOINT =
  import.meta.env.VITE_TRANSLATION_API_URL ||
  "https://translate.terraprint.co/translate";
const TRANSLATION_CACHE_PREFIX = "uomo-translations:";
const BATCH_SIZE = 25;
const MAX_BATCH_CHARACTERS = 1500;

const cache = new Map();
const pending = new Map();
const timers = new Map();
const loadedLanguages = new Set();
const subscribers = new Set();

const notifyTranslationsChanged = () =>
  subscribers.forEach((subscriber) => subscriber());

const getCacheKey = (language, text) => `${language}:${text}`;

const loadCachedTranslations = (language) => {
  try {
    const stored = JSON.parse(
      localStorage.getItem(`${TRANSLATION_CACHE_PREFIX}${language}`) || "{}",
    );
    Object.entries(stored).forEach(([text, translated]) => {
      if (typeof translated === "string") {
        cache.set(getCacheKey(language, text), translated);
      }
    });
  } catch (error) {
    console.error(`Failed to load ${language} translations from storage:`, error);
  }
};

const saveCachedTranslations = (language, translations) => {
  try {
    const stored = Object.fromEntries(
      [...cache.entries()]
        .filter(([key]) => key.startsWith(`${language}:`))
        .map(([key, value]) => [key.slice(language.length + 1), value]),
    );
    localStorage.setItem(
      `${TRANSLATION_CACHE_PREFIX}${language}`,
      JSON.stringify({ ...stored, ...translations }),
    );
  } catch (error) {
    console.error(`Failed to save ${language} translations to storage:`, error);
  }
};

const translateBatch = async (language, texts) => {
  const response = await fetch(TRANSLATION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: texts,
      source: "en",
      target: language,
      format: "text",
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Translation service returned HTTP ${response.status}.`);
  }

  const result = await response.json();
  const translatedTexts = Array.isArray(result.translatedText)
    ? result.translatedText
    : [result.translatedText];
  if (
    translatedTexts.length !== texts.length ||
    translatedTexts.some((translation) => typeof translation !== "string")
  ) {
    throw new Error("Translation service returned an unexpected response.");
  }

  const translations = Object.fromEntries(
    texts.map((text, index) => [text, translatedTexts[index]]),
  );
  Object.entries(translations).forEach(([text, translated]) => {
    cache.set(getCacheKey(language, text), translated);
  });
  saveCachedTranslations(language, translations);
};

const flushQueue = async (language) => {
  timers.delete(language);
  const languageQueue = pending.get(language);
  if (!languageQueue?.size) return;

  pending.delete(language);
  const entries = [...languageQueue.entries()];
  const batches = [];
  let batch = [];
  let batchCharacters = 0;
  entries.forEach((entry) => {
    const textLength = entry[0].length;
    if (
      batch.length &&
      (batch.length >= BATCH_SIZE ||
        batchCharacters + textLength > MAX_BATCH_CHARACTERS)
    ) {
      batches.push(batch);
      batch = [];
      batchCharacters = 0;
    }
    batch.push(entry);
    batchCharacters += textLength;
  });
  if (batch.length) batches.push(batch);

  for (const translationBatch of batches) {
    try {
      await translateBatch(
        language,
        translationBatch.map(([text]) => text),
      );
      notifyTranslationsChanged();
      translationBatch.forEach(([text, listeners]) =>
        listeners.resolvers.forEach((resolve) =>
          resolve(cache.get(getCacheKey(language, text))),
        ),
      );
    } catch (error) {
      translationBatch.forEach(([, listeners]) =>
        listeners.rejecters.forEach((reject) => reject(error)),
      );
    }
  }
};

export const getCachedTranslation = (text, language) =>
  cache.get(getCacheKey(language, text));

export const subscribeToTranslations = (subscriber) => {
  subscribers.add(subscriber);
  return () => subscribers.delete(subscriber);
};

export const requestTranslation = (text, language) => {
  if (language === "en" || !text.trim()) return Promise.resolve(text);

  if (cache.has(getCacheKey(language, text))) {
    return Promise.resolve(cache.get(getCacheKey(language, text)));
  }

  if (!pending.has(language)) pending.set(language, new Map());
  const languageQueue = pending.get(language);
  if (languageQueue.has(text)) {
    return new Promise((resolve, reject) => {
      const listeners = languageQueue.get(text);
      listeners.resolvers.push(resolve);
      listeners.rejecters.push(reject);
    });
  }

  const promise = new Promise((resolve, reject) => {
    languageQueue.set(text, { resolvers: [resolve], rejecters: [reject] });
  });

  if (!timers.has(language)) {
    timers.set(language, setTimeout(() => flushQueue(language), 100));
  }

  return promise;
};

export const loadTranslationCache = (language) => {
  if (!loadedLanguages.has(language)) {
    loadCachedTranslations(language);
    loadedLanguages.add(language);
    notifyTranslationsChanged();
  }
};
