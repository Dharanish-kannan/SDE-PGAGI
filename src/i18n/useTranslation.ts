import { useAppSelector } from "@/redux/hooks";
import { translations } from "./translations";

export function useTranslation() {
  const language = useAppSelector((state) => state.preferences.language) || "en";
  const dict = translations[language] || translations.en;

  const t = (key: keyof typeof translations.en): string => {
    return dict[key] || translations.en[key] || key;
  };

  return { t, language };
}
