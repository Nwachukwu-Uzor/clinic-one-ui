export const formatValidationErrors = (
  validationErrors: Record<string, string[]>
) => {
  const errors = Object.keys(validationErrors).map((key) => {
    for (const error of validationErrors[key]) {
      return error;
    }
  });
  return errors.join(",");
};
