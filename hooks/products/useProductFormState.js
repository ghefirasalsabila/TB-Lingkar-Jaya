import { useState } from "react";
import {
  emptyProductForm,
  isProductFieldValid,
} from "../../features/products/product-form-utils";

export function useProductFormState() {
  const [form, setForm] = useState({ ...emptyProductForm });
  const [touchedFields, setTouchedFields] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function handleFormChange(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleFieldBlur(field) {
    setTouchedFields((previous) => ({ ...previous, [field]: true }));
  }

  function isFieldInvalid(field) {
    if (!submitAttempted && !touchedFields[field]) return false;
    return !isProductFieldValid(field, form[field]);
  }

  function getLabelClassName(field) {
    return `block text-sm font-medium leading-none${isFieldInvalid(field) ? " text-destructive" : ""}`;
  }

  function resetForm() {
    setForm({ ...emptyProductForm });
    setTouchedFields({});
    setSubmitAttempted(false);
  }

  return {
    form,
    setForm,
    submitAttempted,
    setSubmitAttempted,
    handleFormChange,
    handleFieldBlur,
    getLabelClassName,
    isFieldInvalid,
    resetForm,
  };
}
