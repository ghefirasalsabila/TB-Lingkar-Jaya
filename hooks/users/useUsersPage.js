import { useCallback } from "react";
import {
  USERS_DEFAULT_LIMIT,
  USERS_DEFAULT_PAGE,
} from "../../features/users/user-form-utils";
import { useEntityDialogState } from "../shared/useEntityDialogState";
import { usePaginatedCollection } from "../shared/usePaginatedCollection";
import {
  createEmptyUserForm,
  fetchUsersPageData,
  isDefaultOwnerUser,
  mapUserToForm,
} from "./user-page-helpers";
import { useUserPageActions } from "./useUserPageActions";

export function useUsersPage({ isOwner }) {
  const fetchUsersPage = useCallback(
    ({ page, limit, search }) => fetchUsersPageData({ isOwner, page, limit, search }),
    [isOwner],
  );

  const listState = usePaginatedCollection({
    defaultPage: USERS_DEFAULT_PAGE,
    defaultLimit: USERS_DEFAULT_LIMIT,
    fetchPage: fetchUsersPage,
    errorMessage: "Gagal memuat data pengguna",
  });

  const dialogState = useEntityDialogState({
    createEmptyForm: createEmptyUserForm,
    mapItemToForm: mapUserToForm,
  });

  const isEditMode = Boolean(dialogState.editingItem);
  const isDefaultOwnerEdit = isEditMode && isDefaultOwnerUser(dialogState.editingItem);

  const actionState = useUserPageActions({
    isOwner,
    listState,
    dialogState,
    isEditMode,
    isDefaultOwnerEdit,
  });

  return {
    users: listState.items,
    form: dialogState.form,
    formOpen: dialogState.dialogOpen,
    submitAttempted: dialogState.submitAttempted,
    loading: listState.loading,
    saving: actionState.saving,
    deleting: actionState.deleting,
    deleteTarget: actionState.deleteTarget,
    searchQuery: listState.searchQuery,
    page: listState.page,
    paginationMeta: listState.paginationMeta,
    error: listState.error,
    isEditMode,
    isDefaultOwnerEdit,
    handleSearchChange: listState.handleSearchChange,
    setPage: listState.setPage,
    handleFormChange: dialogState.handleFormChange,
    openCreate: dialogState.openCreate,
    openEdit: dialogState.openEdit,
    handleFormOpenChange: (open) => dialogState.handleDialogOpenChange(open, { blocked: actionState.saving }),
    handleSubmit: actionState.handleSubmit,
    requestDeactivate: actionState.requestDeactivate,
    confirmDeactivate: actionState.confirmDeactivate,
    clearDeleteTarget: actionState.clearDeleteTarget,
  };
}
