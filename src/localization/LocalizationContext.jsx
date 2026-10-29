import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const RATE_ENDPOINT = "https://api.frankfurter.dev/v2/rate/USD";
const RATE_STORAGE_KEY = "uomo-exchange-rates";
const LANGUAGE_STORAGE_KEY = "uomo-language";
const CURRENCY_STORAGE_KEY = "uomo-currency";

const languages = ["en-GB", "en-US", "bn", "es", "fr"];
const currencies = ["USD", "GBP", "EUR", "BDT"];
const localeByLanguage = {
  "en-GB": "en-GB",
  "en-US": "en-US",
  bn: "bn-BD",
  es: "es-ES",
  fr: "fr-FR",
};

const getStoredValue = (key, allowedValues, fallback) => {
  try {
    const storedValue = localStorage.getItem(key);
    return allowedValues.includes(storedValue) ? storedValue : fallback;
  } catch (error) {
    console.error(`Failed to load ${key} from storage:`, error);
    return fallback;
  }
};

const getSavedRates = () => {
  try {
    const rates = JSON.parse(localStorage.getItem(RATE_STORAGE_KEY) || "{}");
    return rates && typeof rates === "object" ? rates : {};
  } catch (error) {
    console.error("Failed to load exchange rates from storage:", error);
    return {};
  }
};

const savePreference = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to save ${key} to storage:`, error);
  }
};

const LocalizationContext = createContext(null);

export function LocalizationProvider({ children }) {
  const [language, setLanguage] = useState(() =>
    getStoredValue(LANGUAGE_STORAGE_KEY, languages, "en-GB"),
  );
  const [currency, setCurrency] = useState(() =>
    getStoredValue(CURRENCY_STORAGE_KEY, currencies, "USD"),
  );
  const [savedRates, setSavedRates] = useState(getSavedRates);
  const [rateError, setRateError] = useState("");
  const [translationError, setTranslationError] = useState("");
  const savedRate = savedRates[currency]?.rate;
  const rate =
    currency === "USD"
      ? 1
      : Number.isFinite(savedRate) && savedRate > 0
        ? savedRate
        : undefined;
  const rateLoading = currency !== "USD" && !rate && !rateError;
  const updateLanguage = useCallback((nextLanguage) => {
    setLanguage(nextLanguage);
    setTranslationError("");
  }, []);
  const updateCurrency = useCallback((nextCurrency) => {
    setCurrency(nextCurrency);
    setRateError("");
  }, []);

  useEffect(() => {
    savePreference(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    savePreference(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  useEffect(() => {
    if (currency === "USD") return undefined;

    const controller = new AbortController();

    const loadRate = async () => {
      try {
        const response = await fetch(`${RATE_ENDPOINT}/${currency}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Exchange-rate service returned HTTP ${response.status}.`);
        }

        const result = await response.json();
        if (
          !Number.isFinite(result.rate) ||
          result.rate <= 0 ||
          typeof result.date !== "string"
        ) {
          throw new Error("Exchange-rate service returned an invalid rate.");
        }

        const nextRates = {
          ...getSavedRates(),
          [currency]: { rate: result.rate, date: result.date },
        };
        setSavedRates(nextRates);
        try {
          localStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(nextRates));
        } catch (error) {
          console.error("Failed to save exchange rates to storage:", error);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Unable to load currency exchange rate:", error);
        setRateError(
          "Live exchange rates are unavailable. Showing a saved rate when possible.",
        );
      }
    };

    loadRate();
    return () => controller.abort();
  }, [currency]);

  const value = useMemo(
    () => ({
      language,
      currency,
      rate,
      locale: localeByLanguage[language],
      rateLoading,
      rateError,
      translationError,
      setLanguage: updateLanguage,
      setCurrency: updateCurrency,
      setTranslationError,
    }),
    [
      currency,
      language,
      rate,
      rateError,
      rateLoading,
      translationError,
      updateCurrency,
      updateLanguage,
    ],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider.");
  }
  return context;
}
