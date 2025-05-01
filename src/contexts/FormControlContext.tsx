// FormControlContext.tsx
import React, { createContext, useContext } from 'react';
import { useFormControl, FormValues } from '@/hooks/useFormControl'; // 確保路徑正確

interface FormControlContextType {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  handlePrevious: () => void;
  handleNext: () => void;
  resetForm: () => void;
  currentValidationSchema: any;
  handleSubmit: (values: FormValues, formikHelpers: any) => Promise<void>;
  imageType: string;
  previewImage: string;
  searchValue: string;
  filterValue: string;
  activeCosideIndex: number | null;
  activeUnsplashIndex: number | null;
  unsplashImages: string[];
  currentPage: React.MutableRefObject<number>;
  setImageType: React.Dispatch<React.SetStateAction<string>>;
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
  setActiveUnsplashIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveCosideIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setUnsplashImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const FormControlContext = createContext<FormControlContextType | undefined>(undefined);

export const FormControlProvider: React.FC<{ children: React.ReactNode; token: string }> = ({ children, token }) => {
  const formControl = useFormControl(token);

  return (
    <FormControlContext.Provider value={formControl}>
      {children}
    </FormControlContext.Provider>
  );
};

export const useFormControlContext = () => {
  const context = useContext(FormControlContext);
  if (!context) {
    throw new Error("useFormControlContext must be used within a FormControlProvider");
  }
  return context;
};