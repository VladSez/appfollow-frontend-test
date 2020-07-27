import { useEffect, useState } from "react";

export function useForm({ onSubmit, validate, data, activeState }) {
  const [values, setValues] = useState(data);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(data);
  }, [data]);

  useEffect(() => {
    setValues(values => ({ ...values, state: activeState?.[0] }));
  }, [activeState]);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      onSubmit();
    }
    setSubmitting(false);
  }, [errors]);

  useEffect(() => {
    // do not validate when there is no data
    if (!values?.state) return;

    setErrors(validate(values));
  }, [values]);

  const handleSubmit = event => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setSubmitting(true);
  };

  const handleChange = event => {
    event.persist();
    setValues(values => {
      return {
        ...values,
        [event.target.name]: event.target.value
      };
    });
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors
  };
}
