import { getCurrentUser, getUsers } from "../../lib/api/users";
import { USER_ROLES } from "../../constants/roles";
import {
  DEFAULT_OWNER_EMAIL,
  emptyUserForm,
  USERS_DEFAULT_LIMIT,
  USERS_DEFAULT_PAGE,
} from "../../features/users/user-form-utils";

export function createEmptyUserForm() {
  return { ...emptyUserForm };
}

export function mapUserToForm(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || USER_ROLES.EMPLOYEE,
    isActive: Boolean(user?.isActive),
  };
}

function filterUserCollection(items, search) {
  const keyword = search.trim().toLowerCase();
  if (!keyword) return items;

  return items.filter((item) =>
    [item.name, item.email, item.role]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(keyword)),
  );
}

export async function fetchUsersPageData({ isOwner, page, limit, search }) {
  if (isOwner) {
    return getUsers({ page, limit, search });
  }

  const currentUser = await getCurrentUser();
  const currentUserCollection = currentUser ? [currentUser] : [];
  const filteredUsers = filterUserCollection(currentUserCollection, search);

  return {
    data: filteredUsers,
    meta: {
      page: USERS_DEFAULT_PAGE,
      limit: USERS_DEFAULT_LIMIT,
      totalItems: currentUserCollection.length,
    },
  };
}

export function isDefaultOwnerUser(user) {
  return (
    String(user?.role || "") === USER_ROLES.OWNER
    && String(user?.email || "").toLowerCase() === DEFAULT_OWNER_EMAIL
  );
}

export function buildUserPayload({ form, isEditMode, isDefaultOwnerEdit, editingItem }) {
  if (isEditMode && editingItem) {
    return {
      name: form.name.trim(),
      email: form.email.trim(),
      role: isDefaultOwnerEdit ? editingItem.role : form.role,
      isActive: form.isActive,
    };
  }

  return {
    ...form,
    role: USER_ROLES.EMPLOYEE,
    isActive: form.isActive,
  };
}
