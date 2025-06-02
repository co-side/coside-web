// components/Form/StepDescription.tsx
"use client";

import { useFormikContext } from "formik";
import { Box } from "@mui/material";
import { FormValues } from "@/app/project/create/useFormControl";
import { ForwardRefEditor } from "@/components/Editor/ForwardRefEditor";

export default function StepDescription() {
  const { values, touched, errors, setFieldValue } =
    useFormikContext<FormValues>();

  return (
    <>
      <Box
        width="100%"
        py={1.5}
        px={3}
        bgcolor="secondary.light"
        border="1px solid"
        borderColor="secondary.dark"
        borderRadius="12px"
      >
        請盡量將構想 <b>有架構的描述</b>，讓其他人更了解你的想法
      </Box>
      <ForwardRefEditor
        label="專案構想"
        markdown={values.MKContent}
        onChange={(markdown: string) => {
          setFieldValue("MKContent", markdown);
        }}
        helperText={touched.MKContent && errors?.MKContent}
        error={Boolean(touched.MKContent && errors?.MKContent)}
      />
    </>
  );
}
