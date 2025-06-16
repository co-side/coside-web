"use client";

import { Form, FormikProps } from "formik";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ForwardRefEditor from "@/components/Editor/ForwardRefEditor";
import { useFormContext } from "@/hooks/useFormContext";

interface StepDescriptionFormData {
  description: string;
}

interface StepDescriptionProps {
  context: FormikProps<StepDescriptionFormData>
  onPreview?: () => void;
}

export default function StepDescription({ onPreview, context }: StepDescriptionProps) {
  const { setFieldValue, onSubmit ,values ,getError, getHelperText } = useFormContext<StepDescriptionFormData>(context)

  return (
    <Form onSubmit={onSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        gap={4}
      >
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
          markdown={values.description}
          onMarkdownChange={(value) => {
            setFieldValue("description", value);
          }}
          helperText={getHelperText('description')}
          error={getError('description')}
        />
        <Box display="flex" width="100%" gap={2.5}>
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={onPreview}
          >
            上一步
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
