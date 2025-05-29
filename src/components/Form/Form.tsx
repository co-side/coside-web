"use client";

import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  FormControlProvider,
  useFormControlContext,
} from "@/contexts/FormControlContext";
import { FormValues } from "@/hooks/useFormControl";
import FormStepper from "./FormStepper";
import StepInfo from "./StepInfo";
import StepDescription from "./StepDescription";
import StepMember from "./StepMember";
import NavigationButtons from "./NavigationButtons";
import useLoginStore from "@/stores/loginStore";
import { Box } from "@mui/material";
import { Form as FormFormik } from "formik";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import CustomDialog from "@/components/Dialog/CustomDialog";

// Initial form values
const initialValues: FormValues = {
  titleType: "",
  projectType: "",
  title: "",
  projectDuration: "",
  MKContent: "",
  imageType: "upload",
  bannerUpload: undefined,
  bannerCoside: "",
  bannerUnsplash: undefined,
  partners: [
    {
      number: 1,
      jobPosition: "",
      otherJobPosition: "",
      projectRequirement: "",
      members: [""],
    },
  ],
  submit: "",
};

// Helper function to check if form has been edited
const checkFormEdited = (values: FormValues) => {
  const hasChanged = Object.keys(initialValues).some((key) => {
    if (Array.isArray(initialValues[key])) {
      return JSON.stringify(initialValues[key]) !== JSON.stringify(values[key]);
    } else if (
      typeof initialValues[key] === "object" &&
      initialValues[key] !== null
    ) {
      return JSON.stringify(initialValues[key]) !== JSON.stringify(values[key]);
    }
    return initialValues[key] !== values[key];
  });
  return hasChanged;
};

function FormContent() {
  const formControl = useFormControlContext();
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const router = useRouter();
  const [intendedRoute, setIntendedRoute] = useState("");
  const [currentValues, setCurrentValues] = useState(initialValues);

  // Effect to check if form is edited whenever values change
  useEffect(() => {
    setIsFormEdited(checkFormEdited(currentValues));
  }, [currentValues]);

  // Set up beforeunload event listener
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormEdited) {
        const message = "你有未保存的更改，確定要離開嗎？";
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormEdited]);

  // Handle dialog actions
  const handleExitConfirm = () => {
    setShowExitDialog(false);
    formControl.resetForm();
    
    // 如果有目標路由，導航到該路由
    if (intendedRoute) {
      router.push(intendedRoute);
    }
  };

  const handleExitCancel = () => {
    setShowExitDialog(false);
  };

  const handleCancelAttempt = () => {
    if (isFormEdited) {
      setIntendedRoute("/"); // Set the home page as the intended route
      setShowExitDialog(true);
    } else {
      router.push("/");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(
        formControl.currentValidationSchema
      )}
      onSubmit={formControl.handleSubmit}
    >
      {({ handleSubmit, values }) => {
        // Update currentValues when form values change
        // This is safe because it doesn't call a hook
        if (JSON.stringify(values) !== JSON.stringify(currentValues)) {
          setCurrentValues(values);
        }

        return (
          <FormFormik onSubmit={handleSubmit}>
            <Box
              maxWidth="600px"
              width="100%"
              mx="auto"
              mb={10}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}
            >
              <FormStepper />
              {formControl.activeStep === 0 && <StepInfo />}
              {formControl.activeStep === 1 && <StepDescription />}
              {formControl.activeStep === 2 && <StepMember />}
              <NavigationButtons onCancelAttempt={handleCancelAttempt}/>
              
              {/* 離開頁面確認對話框 */}
              <CustomDialog
                themeColor="red"
                open={showExitDialog}
                onClose={handleExitCancel}
                title="確定要離開此頁面嗎？"
                description="你有未保存的更改，離開後將無法恢復"
                buttons={[
                  { text: "我再想想", onClick: handleExitCancel, variant: "outline" },
                  {
                    text: "確定離開",
                    onClick: handleExitConfirm,
                    variant: "fill",
                  },
                ]}
              />
            </Box>
          </FormFormik>
        );
      }}
    </Formik>
  );
}

export default function Form() {
  const { token } = useLoginStore();

  return (
    <FormControlProvider>
      <FormContent />
    </FormControlProvider>
  );
}