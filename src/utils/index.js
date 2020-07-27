import { getCode } from "country-list";
import { EU_COUNTRIES } from "./constants";

export function isEUcountry(country) {
  const code = getCode(country ? country : "");
  return EU_COUNTRIES.includes(code);
}
