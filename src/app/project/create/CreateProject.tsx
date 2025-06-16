'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Steps, { StepParameters } from "./components/Steps";
import StepInfo from "./StepInfo";
import StepDescription from "./StepDescription";
import StepMember from "./StepMember";
import { FileInfo } from "./components/ProjectImagePicker";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "@/services/project/createProject";
import { fetchUpload } from "@/services/upload";
import { downloadUnsplashImage } from "@/services/unsplash/photo";

const isJsonDiff = (obj1: object, obj2: object): boolean => {
  try {
    return JSON.stringify(obj1) !== JSON.stringify(obj2);
  } catch (error) {
    return true;
  }
}

interface CreateProjectFormData {
  titleType: string;
  projectType: string;
  title: string;
  projectDuration: string;
  fileInfo: null | FileInfo;

  description: string;

  partners: {
    id: string;
    jobPosition: string;
    otherJobPosition?: string;
    projectRequirement?: string;
    members: {
      id: string;
      email?: string;
    }[];
  }[];
}

const initialValues: CreateProjectFormData = {
  titleType: "",
  projectType: "",
  title: "",
  projectDuration: "",
  fileInfo: null,

  description: "",

  partners: [
    {
      id: uuidv4(),
      jobPosition: "",
      otherJobPosition: "",
      projectRequirement: "",
      members: [
        {
          id: uuidv4(),
          email: "",
        }
      ],
    },
  ],
};

function CreateProject() {
  const steps = useMemo(() => [
    { label: "專案基本資訊" },
    { label: "專案說明" },
    { label: "組員需求" },
  ] as const satisfies StepParameters[], [])

  const [activeStep, setActiveStep] = useState(0)
  const formData = useRef(initialValues)
  const router = useRouter();
  
  const onCancel = () => {
    if (!isJsonDiff(initialValues, formData.current) || window.confirm('你有未保存的更改，確定要離開嗎？')) {
      router.push('/')
    }
  }

  useEffect(() => {
    if (!isJsonDiff(initialValues, formData.current)) {
      return
    }
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (window.confirm('你有未保存的更改，確定要離開嗎？')) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [])

  const { isPending, mutateAsync: onCreateProject } = useMutation({
    mutationFn: async (params: CreateProjectFormData) => {
      const uploadImage = async (info: CreateProjectFormData['fileInfo']) => {
        if (!info) {
          throw new Error("請先選擇圖片");
        }
        switch (info?.type) {
          case 'upload':
            return await fetchUpload({ file: info.file }).then(res => res.data);
          case 'coside':
            return info.file.value
          case 'unsplash':
            const blob = await downloadUnsplashImage(info.file);
            return await fetchUpload({ file: blob }).then(res => res.data);
        }
      }

      const fileInfo = await uploadImage(params.fileInfo);
      const res = await createProject({
        name: params.title,
        type: params.titleType,
        duration: params.projectDuration,
        background_Path: fileInfo,
        description: params.description,
        categories: [params.projectType],
        members: params.partners.flatMap(partner => {
          return partner.members.map(member => ({
            role: partner.jobPosition,
            skill: partner.projectRequirement || "",
            email: member.email?.trim() || "",
            group: partner.jobPosition,
            role_Name: partner.jobPosition === "其他" ? partner.otherJobPosition || "" : partner.jobPosition,
          }))
        }),
        industry: "未分類",
        tags: ["未分類"],
      });
      return res
    },
  })

  return (
    <main style={{ padding: 16 }}>
      <Typography variant="h2" fontSize={32} mt={24} mb={8} align="center">
        發起專案
      </Typography>
      <Box
        maxWidth="600px"
        width="100%"
        mx="auto"
        mb={10}
      >
        <Steps
          active={activeStep}
          steps={steps}
        />
        {(() => {
          if (isPending) {
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: { xs: "40px", md: "80px" },
                }}
              >
                <CircularProgress />
              </Box>
            )
          }
          switch (activeStep) {
            case 0:
              return (
                <Formik
                  key="step-0"
                  initialValues={{
                    titleType: initialValues.titleType,
                    projectType: initialValues.projectType,
                    title: initialValues.title,
                    projectDuration: initialValues.projectDuration,
                    fileInfo: initialValues.fileInfo,
                  }}
                  validationSchema={toFormikValidationSchema(
                    z.object({
                      titleType: z.string({ message: '請選擇發起類型' }).nonempty('請選擇發起類型'),
                      projectType: z.string({ message: '請選擇專案類型' }).nonempty('請選擇專案類型'),
                      title: z.string({ message: '請輸入主題名稱' }).nonempty('請輸入主題名稱'),
                      projectDuration: z.string({ message: '請選擇專案期限' }).nonempty('請選擇專案期限'),
                      fileInfo: z.object({
                        type: z.union([
                          z.literal('upload'),
                          z.literal('coside'),
                          z.literal('unsplash')
                        ]),
                        file: z.unknown(),
                      }, { message: '請選擇圖片' })
                    })
                  )}
                  onSubmit={(value) => {
                    setActiveStep(1);
                    formData.current = { ...formData.current, ...value };
                  }}
                >
                  {(formikProps) => {
                    formData.current = { ...formData.current, ...formikProps.values };
                    return (
                      <StepInfo
                        context={formikProps}
                        onCancel={onCancel}
                      />
                    )
                  }}
                </Formik>
              )
            case 1:
              return (
                <Formik
                  key="step-1"
                  initialValues={{
                    description: initialValues.description,
                  }}
                  validationSchema={toFormikValidationSchema(
                    z.object({
                      description: z.string({ message: '請輸入專案說明' }).nonempty('請輸入專案說明'),
                    })
                  )}
                  onSubmit={(value) => {
                    setActiveStep(2);
                    formData.current = { ...formData.current, ...value };
                  }}
                >
                  {(formikProps) => {
                    formData.current = { ...formData.current, ...formikProps.values };
                    return (
                      <StepDescription
                        context={formikProps}
                        onPreview={() => setActiveStep(0)}
                      />
                    )
                  }}
                </Formik>
              );
            case 2:
              return (
                <Formik
                  key="step-2"
                  initialValues={{
                    partners: initialValues.partners,
                  }}
                  validationSchema={toFormikValidationSchema(
                    z.object({
                      partners: z.array(
                        z.object({
                          jobPosition: z.string({ message: '請選擇組員職位' }).nonempty('請選擇組員職位'),
                          otherJobPosition: z.string().optional(),
                          projectRequirement: z.string({ message: '請輸入組員需求' }).optional(),
                          members: z.array(
                            z.object({
                              email: z.string().email({ message: '電子郵件格式不符合' }).optional()
                            })
                          ).min(1, { message: '請至少添加一名成員' }),
                        })
                      ).min(1, { message: '至少需要一名組員' }),
                    })
                    .superRefine((data, ctx) => {
                      data.partners.forEach((partner, index) => {
                        if (partner.jobPosition === '其他') {
                          if (partner.otherJobPosition) return
                          ctx.addIssue({
                            code: 'custom',
                            message: '請輸入其他職位',
                            path: ['partners', index, 'otherJobPosition'],
                          })
                        }
                      })
                    })
                  )}
                  onSubmit={(value) => {
                    formData.current = { ...formData.current, ...value };
                    onCreateProject(formData.current).then(() => {
                      router.push('/')
                    })
                  }}
                >
                  {(formikProps) => {
                    formData.current = { ...formData.current, ...formikProps.values };
                    return (
                      <StepMember
                        context={formikProps}
                        onPreview={() => setActiveStep(1)}
                      />
                    )
                  }}
                </Formik>
              );
            default:
              return (
                <Typography>未知步驟</Typography>
              )
          }
        })()}
      </Box>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Create Project",
};

export default CreateProject
