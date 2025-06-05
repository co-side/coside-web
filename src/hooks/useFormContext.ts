import { getIn, FormikProps } from "formik";

export function useFormContext<T>(context: FormikProps<T>) {
  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } = context;
  const getError = (key: string) => {
    return Boolean(getIn(errors, key) && getIn(touched, key))
  }
  const getHelperText = (key: string) => {
    return getError(key) ? String(getIn(errors, key) || '') : ''
  }
  return {
    values,
    getError,
    getHelperText,
    onChange: handleChange,
    onSubmit: handleSubmit,
    setFieldValue,
  }
}
