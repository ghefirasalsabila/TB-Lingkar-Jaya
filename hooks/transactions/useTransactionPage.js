import { TRANSACTION_DEFAULT_LIMIT, TRANSACTION_DEFAULT_PAGE } from "../../features/transactions/transaction-utils";
import { usePaginatedCollection } from "../shared/usePaginatedCollection";
import { useTransactionActions } from "./useTransactionActions";
import { useTransactionFormState } from "./useTransactionFormState";
import { useTransactionMasterData } from "./useTransactionMasterData";

export function useTransactionPage({
  isOwner,
  fetchPage,
  fetchPageErrorMessage,
  loadMasterData,
  createItem,
  updateItem,
  voidItem,
  downloadReceipt,
  receiptFileName,
  voidErrorMessage,
  receiptErrorMessage,
  emptyItemsError,
  createEmptyForm,
  mapItemToForm,
  emptyItem,
  estimateTotal,
  toPayload,
}) {
  const listState = usePaginatedCollection({
    defaultPage: TRANSACTION_DEFAULT_PAGE,
    defaultLimit: TRANSACTION_DEFAULT_LIMIT,
    fetchPage,
    errorMessage: fetchPageErrorMessage,
  });

  const formState = useTransactionFormState({
    createEmptyForm,
    mapItemToForm,
    emptyItem,
    estimateTotal,
  });

  const masterData = useTransactionMasterData(loadMasterData);
  const actionState = useTransactionActions({
    isOwner,
    listState,
    formState,
    reloadMasterData: masterData.reload,
    createItem,
    updateItem,
    voidItem,
    downloadReceipt,
    receiptFileName,
    voidErrorMessage,
    receiptErrorMessage,
    emptyItemsError,
    toPayload,
  });

  return {
    items: listState.items,
    masterData: masterData.value,
    masterDataLoading: masterData.loading,
    masterDataError: masterData.error,
    reloadMasterData: masterData.reload,
    searchQuery: listState.searchQuery,
    page: listState.page,
    paginationMeta: listState.paginationMeta,
    loading: listState.loading,
    saving: actionState.saving,
    error: listState.error,
    voidTargetId: actionState.voidTargetId,
    voidReason: actionState.voidReason,
    voiding: actionState.voiding,
    setVoidReason: actionState.setVoidReason,
    handleVoidDialogOpenChange: actionState.handleVoidDialogOpenChange,
    handleSearchChange: listState.handleSearchChange,
    setPage: listState.setPage,
    handleSubmit: actionState.handleSubmit,
    requestVoid: actionState.requestVoid,
    confirmVoid: actionState.confirmVoid,
    handleDownloadReceipt: actionState.handleDownloadReceipt,
    form: formState.form,
    initialForm: formState.initialForm,
    editingId: formState.editingId,
    showForm: formState.showForm,
    itemSelectRefs: formState.itemSelectRefs,
    itemRowRefs: formState.itemRowRefs,
    estimatedTotal: formState.estimatedTotal,
    handleFormChange: formState.handleFormFieldChange,
    handleFormOpenChange: (open) => formState.handleFormOpenChange(open, actionState.saving, () => listState.setError("")),
    openCreate: formState.openCreate,
    startEdit: formState.startEdit,
    setItem: formState.setItem,
    addItem: formState.addItem,
    removeItem: formState.removeItem,
  };
}
