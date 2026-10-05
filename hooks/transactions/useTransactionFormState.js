import { useMemo, useRef, useState } from "react";
import { usePendingItemFocus } from "./usePendingItemFocus";

export function useTransactionFormState({
  createEmptyForm,
  mapItemToForm,
  emptyItem,
  estimateTotal,
}) {
  const [form, setForm] = useState(createEmptyForm);
  const [initialForm, setInitialForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const itemSelectRefs = useRef([]);
  const itemRowRefs = useRef([]);
  const [pendingItemFocusIndex, setPendingItemFocusIndex] = useState(null);

  function resetForm() {
    setEditingId("");
    const emptyForm = createEmptyForm();
    setForm(emptyForm);
    setInitialForm(emptyForm);
    setShowForm(false);
    setPendingItemFocusIndex(null);
    itemSelectRefs.current = [];
    itemRowRefs.current = [];
  }

  function handleFormOpenChange(open, saving, onClose) {
    if (saving) return;
    if (!open) {
      resetForm();
      onClose?.();
      return;
    }
    setShowForm(true);
  }

  function openCreate() {
    const emptyForm = createEmptyForm();
    setEditingId("");
    setForm(emptyForm);
    setInitialForm(emptyForm);
    setShowForm(true);
    setPendingItemFocusIndex(null);
  }

  function startEdit(item) {
    const nextForm = mapItemToForm(item);
    setEditingId(item.id);
    setShowForm(true);
    setPendingItemFocusIndex(null);
    setForm(nextForm);
    setInitialForm(nextForm);
  }

  function handleFormFieldChange(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function setItem(index, key, value) {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  }

  function addItem() {
    const nextIndex = form.items.length;
    setForm((previous) => ({
      ...previous,
      items: [...previous.items, { ...emptyItem }],
    }));
    setPendingItemFocusIndex(nextIndex);
  }

  function removeItem(index) {
    setForm((previous) => {
      if (previous.items.length <= 1) return previous;
      return {
        ...previous,
        items: previous.items.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  }

  const estimatedTotal = useMemo(() => estimateTotal(form.items), [estimateTotal, form.items]);

  usePendingItemFocus({
    pendingItemFocusIndex,
    showForm,
    itemSelectRefs,
    itemRowRefs,
    itemCount: form.items.length,
    onSettled: () => setPendingItemFocusIndex(null),
  });

  return {
    form,
    initialForm,
    editingId,
    showForm,
    itemSelectRefs,
    itemRowRefs,
    estimatedTotal,
    resetForm,
    handleFormOpenChange,
    openCreate,
    startEdit,
    handleFormFieldChange,
    setItem,
    addItem,
    removeItem,
  };
}
