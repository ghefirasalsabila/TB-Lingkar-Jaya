export const emptyCategoryForm = {
  name: "",
  isActive: true,
};

export const CATEGORIES_DEFAULT_PAGE = 1;
export const CATEGORIES_DEFAULT_LIMIT = 10;

export function validateCategoryForm(form) {
  return form.name.trim().length >= 2;
}
