import { formatValidationErrors } from ".";

export const formatAPIError = (customError: any, fallback = "") => {
  if (customError?.response?.data?.data?.errors) {
    return (
      formatValidationErrors(customError?.response?.data?.data?.errors) ??
      fallback
    );
  } else {
    return customError?.response?.data?.data?.title ?? fallback;
  }
};
