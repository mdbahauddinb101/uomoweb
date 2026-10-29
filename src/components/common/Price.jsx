import { useLocalization } from "../../localization/LocalizationContext";

export default function Price({ amount }) {
  const { currency, locale, rate, rateLoading } = useLocalization();

  if (!Number.isFinite(amount)) return null;
  if (!Number.isFinite(rate) || rate <= 0) {
    return (
      <span
        aria-label={rateLoading ? "Loading exchange rate" : "Exchange rate unavailable"}
        title={rateLoading ? "Loading exchange rate" : "Exchange rate unavailable"}
      >
        {rateLoading ? "..." : "—"}
      </span>
    );
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount * rate);
}
