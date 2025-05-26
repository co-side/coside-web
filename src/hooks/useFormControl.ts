// useFormControl.ts
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormikHelpers } from "formik";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useProjectSubmission } from "@/hooks/useProjectSubmission";

type PartnerType = {
  number: number;
  jobPosition: string;
  otherJobPosition: string;
  projectRequirement: string;
  members: string[];
};

type BannerUnsplash = {
  [key: string]: any;
};

export type FormValues = {
  title: string;
  projectType: string;
  titleType: string;
  projectDuration: string;
  MKContent: string;
  imageType: string;
  bannerUpload: object | Blob | undefined;
  bannerCoside: string;
  bannerUnsplash: BannerUnsplash | undefined;
  partners: PartnerType[];
  submit: string;
};

export const useFormControl = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const { currentValidationSchema } = useFormValidation(activeStep);
  const { submitProject } = useProjectSubmission();

  // Image related states
  const [previewImage, setPreviewImage] = useState("");
  const [imageType, setImageType] = useState("upload");
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [activeCosideIndex, setActiveCosideIndex] = useState<number | null>(-1);
  const [activeUnsplashIndex, setActiveUnsplashIndex] = useState<number | null>(-1);
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
  const currentPage = useRef(1);

  const resetForm = () => {
    setPreviewImage("");
    setImageType("upload");
    setSearchValue("");
    setFilterValue("");
    setActiveCosideIndex(-1);
    setActiveUnsplashIndex(-1);
    setUnsplashImages([]);
    currentPage.current = 1;
  };

  // Step navigation handlers
  const handlePrevious = () => {
    setActiveStep((preStep) => (preStep > 0 ? preStep - 1 : preStep));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Form submission handler
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    if (activeStep === 2) {
      const success = await submitProject(values, formikHelpers, activeStep);
      if (success) {
        router.push("/");
      }
    } else {
      handleNext();
    }
  };

  return {
    // Step control
    activeStep,
    setActiveStep,
    handlePrevious,
    handleNext,

    // Form reset function
    resetForm,

    // Form validation and submission
    currentValidationSchema,
    handleSubmit,

    // Image related states and handlers
    imageType,
    previewImage,
    searchValue,
    filterValue,
    activeCosideIndex,
    activeUnsplashIndex,
    unsplashImages,
    currentPage,
    setImageType,
    setPreviewImage,
    setSearchValue,
    setFilterValue,
    setActiveUnsplashIndex,
    setActiveCosideIndex,
    setUnsplashImages,
  };
};