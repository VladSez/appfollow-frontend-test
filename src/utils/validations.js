import { isEUcountry } from "./index";

export function validate(values) {
  let errors = {};

  if (!values.name) {
    errors.name = "Name is required";
  } else if (!/^[a-z]{2,}(?:\s[a-z]{2,})+/i.test(values.name)) {
    errors.name = "Name must be at least two words";
  }
  if (!values.company) {
    errors.company = "company is required";
  } else if (values.company.length < 3) {
    errors.company = "Company must be 3 or more characters";
  }
  if (isEUcountry(values?.country) && !values.vat) {
    errors.vat = "Vat is required";
  }
  if (!values.zip_code) {
    errors.zip_code = "Zip_code is required";
  } else if (values.zip_code.length < 3) {
    errors.zip_code = "Zip_code must be 3 or more characters";
  }
  if (!values.address) {
    errors.address = "Address is required";
  } else if (values.address.length < 7) {
    errors.address = "address must be 7 or more characters";
  }
  return errors;
}
