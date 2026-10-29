import useTranslatedString from "../../localization/useTranslatedString";

export default function LocalizedInput({ placeholder, ...props }) {
  const translatedPlaceholder = useTranslatedString(placeholder || "");
  const ariaLabel = props["aria-label"];
  const translatedAriaLabel = useTranslatedString(
    typeof ariaLabel === "string" ? ariaLabel : "",
  );

  return (
    <input
      {...props}
      aria-label={ariaLabel ? translatedAriaLabel : undefined}
      placeholder={placeholder ? translatedPlaceholder : undefined}
    />
  );
}
