'use client';

import { Form, Field, FormikProps } from "formik";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { projectType, titleType, duration } from "@/constant";
import Select from "@/components/Select";
import ProjectImagePicker, { FileInfo } from "./components/ProjectImagePicker";
import { useFormContext } from "@/hooks/useFormContext";

interface StepInfoFormData {
  titleType: string;
  projectType: string;
  title: string;
  projectDuration: string;
  fileInfo: null | FileInfo;
}

interface StepInfoProps {
  context: FormikProps<StepInfoFormData>
  onCancel?: () => void;
}

export default function StepInfo({ onCancel, context }: StepInfoProps) {
  const { setFieldValue, onSubmit, onChange, values, getError, getHelperText } = useFormContext<StepInfoFormData>(context)
  return (
    <Form onSubmit={onSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Field
          as={Select}
          label="發起類型"
          color="secondary"
          options={titleType}
          value={values.titleType}
          onChange={onChange}
          name="titleType"
          fullWidth
          error={getError('titleType')}
          helperText={getHelperText('titleType')}
        />
        <Field
          as={Select}
          label="專案類型"
          color="secondary"
          value={values.projectType}
          onChange={onChange}
          options={projectType}
          name="projectType"
          fullWidth
          error={getError('projectType')}
          helperText={getHelperText('projectType')}
        />
        <Field
          as={TextField}
          label="主題名稱"
          color="secondary"
          fullWidth
          value={values.title}
          onChange={onChange}
          name="title"
          error={getError('title')}
          helperText={getHelperText('title')}
        />
        <ProjectImagePicker
          value={values.fileInfo}
          onFileChange={(info) => {
            setFieldValue("fileInfo", info);
          }}
          isError={getError('fileInfo')}
          helperText={getHelperText('fileInfo')}
        />
        <Field
          as={Select}
          label="專案預計進行時間"
          color="secondary"
          value={values.projectDuration}
          onChange={onChange}
          name="projectDuration"
          options={duration}
          fullWidth
          error={getError('projectDuration')}
          helperText={getHelperText('projectDuration')}
        />
        <Box display="flex" width="100%" gap={2.5}>
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            sx={{ color: "white" }}
            endIcon={<ChevronRightIcon />}
            fullWidth
            type="submit"
          >
            下一步
          </Button>
        </Box>
      </Box>
    </Form>
  );
}
