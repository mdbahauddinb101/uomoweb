import { useEffect, useSyncExternalStore } from "react";
import { useLocalization } from "./LocalizationContext";
import {
  getCachedTranslation,
  loadTranslationCache,
  requestTranslation,
  subscribeToTranslations,
} from "./translationService";

export default function useTranslatedString(text) {
  const { language, setTranslationError } = useLocalization();
  const targetLanguage = language.split("-")[0];
  const translatedText = useSyncExternalStore(
    subscribeToTranslations,
    () => getCachedTranslation(text, targetLanguage) || text,
    () => text,
  );

  useEffect(() => {
    let active = true;
    loadTranslationCache(targetLanguage);
    const cachedTranslation = getCachedTranslation(text, targetLanguage);

    if (targetLanguage === "en" || cachedTranslation || !text.trim()) {
      return undefined;
    }

    requestTranslation(text, targetLanguage).catch((error) => {
      if (!active) return;
      console.error("Unable to translate page text:", error);
      setTranslationError(
        `Online translation failed (${error.message}). The original English text remains visible.`,
      );
    });

    return () => {
      active = false;
    };
  }, [setTranslationError, targetLanguage, text]);

  return translatedText;
}
