import { Dialog } from "@reach/dialog";
import React, { useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";

import { useForm } from "../hooks/useForm";
import { GET_ENDPOINT, POST_ENDPOINT } from "../utils/constants";
import { isEUcountry } from "../utils/index";
import { validate } from "../utils/validations";
import "../styles.css";

export function BillingDetailsForm() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [data, setData] = useState({});
  const [activeState, setActiveState] = useState([]);
  const [formStatus, setFormStatus] = useState(null);

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const req = await fetch(POST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });
      await req.json();
      alert(
        `successfully submitted with data: ${JSON.stringify(values, null, 2)}`
      );
      setFormStatus({ status: "success" });
      setShowDialog(false);
    } catch (e) {
      setFormStatus({ status: "error", message: e });
    }
    setSubmitting(false);
  };

  const { values, errors, handleChange, handleSubmit } = useForm({
    data: data.data,
    activeState,
    validate,
    onSubmit
  });

  useEffect(() => {
    // fetch only when dialog is open and there is no data
    if (!showDialog || Object.keys(data).length > 0) return;
    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(GET_ENDPOINT);
        const data = await res.json();
        setData(data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    getData();
  }, [showDialog]);

  useEffect(() => {
    const activeState = data?.countries?.find(country => {
      return country.country === values?.country;
    })?.states;
    setActiveState(activeState);
  }, [values]);

  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <div className="form-container">
      <Button onClick={open}>Ввести данные</Button>
      <Dialog
        isOpen={showDialog}
        onDismiss={close}
        aria-label="Billing details form"
      >
        <button onClick={close}>Close</button>
        <Form
          error={formStatus?.status === "error"}
          loading={isLoading || isSubmitting}
          onSubmit={handleSubmit}
        >
          <Form.Input
            error={errors.name}
            label="Customer full name"
            name="name"
            value={values?.name || ""}
            onChange={handleChange}
          />

          <Form.Input
            error={errors.company}
            label="Company name"
            name="company"
            value={values?.company || ""}
            onChange={handleChange}
          />

          <Form.Group unstackable>
            <Form.Field width={10}>
              <label>Country</label>
              <select
                name="country"
                value={values?.country || ""}
                onChange={handleChange}
              >
                {data?.countries?.map(({ country }) => {
                  return (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  );
                })}
              </select>
            </Form.Field>
            {isEUcountry(values?.country) && (
              <Form.Field width={6}>
                <Form.Input
                  error={errors.vat}
                  label="VAT ID"
                  name="vat"
                  value={values?.vat || ""}
                  onChange={handleChange}
                />
              </Form.Field>
            )}
          </Form.Group>

          <Form.Group unstackable>
            <Form.Field width={10}>
              <label>City</label>
              <input
                name="city"
                value={values?.city || ""}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field width={6}>
              <label>State</label>
              <select
                name="state"
                value={values?.state || ""}
                onChange={handleChange}
                disabled={activeState?.length === 0}
              >
                {activeState?.map(state => {
                  return (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  );
                })}
              </select>
            </Form.Field>
          </Form.Group>
          <Form.Input
            error={errors.zip_code}
            label="ZIP Code"
            name="zip_code"
            value={values?.zip_code || ""}
            onChange={handleChange}
          />
          <Form.Input
            error={errors.address}
            label="Address"
            name="address"
            value={values?.address || ""}
            onChange={handleChange}
          />
          <Message
            error
            header="Action Forbidden"
            content={formStatus?.message}
          />
          <Button type="submit">Go to checkout</Button>
        </Form>
      </Dialog>
    </div>
  );
}
