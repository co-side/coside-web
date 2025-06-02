import { useFormikContext } from "formik";
import { TextField } from "@mui/material";
import { Field } from "formik";
import { projectType, titleType, duration } from "@/constant";
import { FormValues } from "@/app/project/create/useFormControl";
import Select from "@/components/Select";
import UploadImage from "./UploadImage";

export default function FormStepper() {
  const { values, handleChange, touched, errors } =
    useFormikContext<FormValues>();

  return (
    <>
      <Field
        as={Select}
        label="發起類型"
        color="secondary"
        options={titleType}
        value={values.titleType}
        onChange={handleChange}
        name="titleType"
        fullWidth
        error={Boolean(touched.titleType && errors?.titleType)}
        helperText={touched.titleType && errors?.titleType}
      />
      <Field
        as={Select}
        label="專案類型"
        color="secondary"
        value={values.projectType}
        onChange={handleChange}
        options={projectType}
        name="projectType"
        fullWidth
        error={Boolean(touched.projectType && errors?.projectType)}
        helperText={touched.projectType && errors?.projectType}
      />

      <Field
        as={TextField}
        id="title"
        label="主題名稱"
        color="secondary"
        fullWidth
        value={values.title}
        onChange={handleChange}
        name="title"
        error={Boolean(touched.title && errors?.title)}
        helperText={touched.title && errors?.title}
      />
      <UploadImage />
      <Field
        as={Select}
        id="projectDuration"
        label="專案預計進行時間"
        color="secondary"
        value={values.projectDuration}
        onChange={handleChange}
        name="projectDuration"
        options={duration}
        error={Boolean(touched.projectDuration && errors?.projectDuration)}
        helperText={touched.projectDuration && errors?.projectDuration}
        fullWidth
      />
    </>
  );
}
