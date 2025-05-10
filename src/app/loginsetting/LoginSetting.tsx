"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import { styled } from '@mui/material/styles'
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import MuiTextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MuiSwitch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Formik, Form, Field, useFormikContext } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios from "axios";
import styles from "./page.module.scss";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import { useMutation } from "@tanstack/react-query";
import { fetchLogin, fetchSignup } from "@/services/auth";

export const JOB_POSITION = [
  { label: 'UI設計師', value: 'UI設計師' },
  { label: 'UX設計師', value: 'UX設計師' },
  { label: 'UIUX/產品設計師', value: 'UIUX/產品設計師' },
  { label: '使用者研究員', value: '使用者研究員' },
  { label: '前端工程師', value: '前端工程師' },
  { label: '後端工程師', value: '後端工程師' },
  { label: '全端工程師', value: '全端工程師' },
  { label: 'PM', value: 'PM' },
  { label: '其他', value: '其他' },
] as const

function formatErrorMessages<T1 extends Record<string, string>, T2 extends Record<string, boolean>>(errors: T1, touched: T2): Record<keyof T1, boolean> {
  return Object.fromEntries(Object.entries(errors).map(([key, value]) => {
    return [key, Boolean(touched[key] && value)]
  })) as Record<keyof T1, boolean>
}

function formatHelperTexts<T1 extends Record<string, string>, T2 extends Record<string, boolean>>(errors: T1, touched: T2): Record<keyof T1, string> {
  return Object.fromEntries(Object.entries(errors).map(([key, value]) => {
    return [key, touched[key] ? value : '']
  })) as Record<keyof T1, string>
}

const TextField = styled(MuiTextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
})

const Switch = styled(MuiSwitch)({
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        backgroundColor: "#54B153",
        opacity: 1,
        border: 1,
        borderColor: "gray",
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: "#2E7D32",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#e9e9ea",
  },
  "& .MuiSwitch-track": {
    borderRadius: 13 / 2,
    backgroundColor: "#e9e9ea",
    opacity: 1,
    transition: "background-color 500ms",
  },
})

interface ProfileFormData {
  imgPath: string;
  previewImage: string;
  name: string;
  email: string;
  position: string;
  otherPosition: string;
  describe: string;
  projectUrl: string;
}

interface ProfileFormProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImagePathChange: (imagePath: string) => void;
  onPreviewImageChange: (imagePath: string) => void
  values: ProfileFormData
  errors: { [K in keyof ProfileFormData]: boolean };
  helperTexts: { [K in keyof ProfileFormData]: string };
}

function ProfileForm({
  onChange,
  onImagePathChange,
  onPreviewImageChange,
  values,
  errors,
  helperTexts,
}: ProfileFormProps) {
  const [fileError, setFileError] = useState('');
  const searchParams = useSearchParams();
  const { setFieldValue } = useFormikContext()
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = event.currentTarget.files?.[0];

    if (!file) {
      setFileError("請選擇檔案");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("檔案大小超過2MB上限");
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFileError("只接受 .jpg, .jpeg, .png 格式");
      return;
    }

    setFieldValue("image", file);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await axios.post(
        `/api/upload?type=images`,
        data,
        {
          headers: {
            Authorization: `Bearer ${searchParams.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onImagePathChange(res.data.data);
      setFieldValue("imgPath", res.data.data);

    } catch (e) {
      setFileError("上傳失敗，請稍後再試");
      setFieldValue("previewImage", "")
      onPreviewImageChange('');
    }
  }

  return (
    <Form>
      <div className={styles.inner}>
        <div className={styles.form}>
          <div className={styles.upload}>
            <input
              accept=".jpg, .jpeg, .png"
              style={{ display: "none" }}
              id="icon-button-file"
              type="file"
              onChange={onFileChange}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                aria-label="upload picture"
                component="span"
              >
                <Avatar className={styles.uploadBox}>
                  <PhotoCamera className={styles.cameraIcon} />
                </Avatar>
              </IconButton>
            </label>
            <div className={styles.text}>
              <p>上傳格式：jpg, jpeg, png</p>
              <p>大小上限：2MB</p>
            </div>
            {fileError && (
              <p className={styles.errorText}>{fileError}</p>
            )}
          </div>
          {values.imgPath && (
            <div style={{ width: '200px', position: 'relative' }}>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${values.imgPath}`}
                alt="preview"
                width={200}
                height={0}
                sizes="200px"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}
          <Field
            as={TextField}
            id="name"
            name="name"
            label="名稱"
            fullWidth
            onChange={onChange}
            value={values.name}
            error={errors.name}
            helperText={helperTexts.name}
          />
          <Field
            as={TextField}
            id="email"
            name="email"
            label="電子信箱"
            fullWidth
            onChange={onChange}
            value={values.email}
            disabled
            error={errors.email}
            helperText={helperTexts.email}
          />
          <FormControl sx={{ minWidth: '100%' }} error={errors.position}>
            <InputLabel id="select-label">你主要的職位</InputLabel>
            <Field
              as={Select}
              name="position"
              value={values.position}
              onChange={onChange}
              fullWidth
              error={errors.position}
              sx={{ borderRadius: '12px' }}
            >
              {JOB_POSITION.map((item, index) => (
                <MenuItem value={item.value} key={index}>
                  {item.label}
                </MenuItem>
              ))}
            </Field>
            {helperTexts.position && <FormHelperText>{helperTexts.position}</FormHelperText>}
          </FormControl>
          {values.position === "其他" && (
            <Field
              as={TextField}
              name="otherPosition"
              label="請輸入其他職位"
              fullWidth
              onChange={onChange}
              value={values.otherPosition}
              error={errors.otherPosition}
              helperText={helperTexts.otherPosition}
            />
          )}
          <Field
            as={TextField}
            name="describe"
            label="個人簡介"
            multiline
            rows={8}
            fullWidth
            onChange={onChange}
            value={values.describe}
            error={errors.describe}
            helperText={helperTexts.describe}
          />
          <Field
            as={TextField}
            name="projectUrl"
            label="作品集網址"
            fullWidth
            onChange={onChange}
            value={values.projectUrl}
            error={errors.projectUrl}
            helperText={helperTexts.projectUrl}
          />
          <div className={styles.buttonContainer}>
            <Button
              disabled
              variant="outlined"
              className={styles.btn}
              startIcon={<ArrowBackIosIcon />}
            >
              上一步
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={styles.btn}
              endIcon={<ArrowForwardIosIcon />}
            >
              下一步
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}

interface ContactFormData {
  email: string;
  emailPublic: boolean;
  facebook: string;
  facebookPublic: boolean;
  instagram: string;
  instagramPublic: boolean;
}

interface ContactFormProps {
  onPrevStep: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  values: ContactFormData
  errors: { [K in keyof ContactFormData]: boolean };
  helperTexts: { [K in keyof ContactFormData]: string };
}

function ContactForm({
  onChange,
  onPrevStep,
  values,
  errors,
  helperTexts,
}: ContactFormProps) {
  const { setFieldValue } = useFormikContext()
  return (
    <Form>
      <div className={styles.inner}>
        <div className={styles.form}>
          <div className={styles.flexItem}>
            <Field
              as={TextField}
              id="email"
              name="email"
              label="電子信箱"
              fullWidth
              disabled
              onChange={onChange}
              value={values.email}
              error={errors.email}
              helperText={helperTexts.email}
            />
            <FormControlLabel
              value="emailPublic"
              control={
                <Field
                  as={Switch}
                  name="emailPublic"
                  color="primary"
                  checked={values.emailPublic}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue(
                      "emailPublic",
                      event.target.checked
                    );
                  }}
                  disabled
                />
              }
              label={values.emailPublic ? "公開" : "關閉"}
              labelPlacement="top"
              className={styles.switch}
              sx={{
                "& .MuiFormControlLabel-label.Mui-disabled": {
                  color: values.emailPublic ? "#54B153" : "rgba(0, 0, 0, 0.38)", // 綠 or 灰
                },
              }}
            />
          </div>
          <div className={styles.flexItem}>
            <Field
              as={TextField}
              id="facebook"
              name="facebook"
              label="Facebook"
              fullWidth
              onChange={onChange}
              value={values.facebook}
              error={errors.facebook}
              helperText={helperTexts.facebook}
            />
            <FormControlLabel
              value="facebookPublic"
              control={
                <Field
                  as={Switch}
                  name="facebookPublic"
                  color="primary"
                  checked={values.facebookPublic}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue(
                      "facebookPublic",
                      event.target.checked
                    );
                  }}
                />
              }
              label={values.facebookPublic ? "公開" : "關閉"}
              labelPlacement="top"
              className={styles.switch}
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: values.facebookPublic ? "#54B153" : "rgba(0, 0, 0, 0.38)", // 綠 or 灰
                },
              }}
            />
          </div>
          <div className={styles.flexItem}>
            <Field
              as={TextField}
              id="instagram"
              name="instagram"
              label="Instagram"
              fullWidth
              onChange={onChange}
              value={values.instagram}
              error={errors.instagram}
              helperText={helperTexts.instagram}
            />
            <FormControlLabel
              value="instagramPublic"
              control={
                <Field
                  as={Switch}
                  name="instagramPublic"
                  color="primary"
                  checked={values.instagramPublic}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("instagramPublic", event.target.checked)
                  }}
                />
              }
              label={values.instagramPublic ? "公開" : "關閉"}
              labelPlacement="top"
              className={styles.switch}
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: values.instagramPublic ? "#54B153" : "rgba(0, 0, 0, 0.38)", // 綠 or 灰
                },
              }}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              variant="outlined"
              className={styles.btn}
              onClick={onPrevStep}
              startIcon={<ArrowBackIosIcon />}
            >
              上一步
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={styles.btn}
              endIcon={<ArrowForwardIosIcon />}
            >
              完成
            </Button>
          </div>
        </div>
      </div>
    </Form>
  )
}

const DEFAULT_FORM: ProfileFormData & ContactFormData = {
  imgPath: '',
  previewImage: '',
  //
  name: '',
  email: '',
  emailPublic: true,
  position: '',
  describe: '',
  projectUrl: '',
  // 
  facebook: '',
  facebookPublic: false,
  instagram: '',
  instagramPublic: false,
  otherPosition: '',
}

const useSignup = (formData: typeof DEFAULT_FORM) => {
  const router = useRouter()
  return useMutation({
    mutationFn: () => {
      return fetchSignup({
        name: formData.name,
        email: formData.email,
        emailPublic: formData.emailPublic,
        facebook: formData.facebook,
        isfacebookpublic: formData.facebookPublic,
        instagram: formData.instagram,
        isinstagrampublic: formData.instagramPublic,
        role: formData.position === "其他" ? "其他" : formData.position,
        otherRole: formData.position === "其他" ? formData.otherPosition : "",
        intro: formData.describe,
        link: formData.projectUrl,
        avatar: formData.imgPath,
        password: "Aa1@bc",
      })
      .then((res) => res.data.data)
    },
    onSuccess: async (data) => {
      const params = new URLSearchParams({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
      router.replace(`/?${params}`)
    },
  })
}


interface LoginSettingProps {
  signupName?: string
  signupEmail?: string
}

const LoginSetting = ({ signupName, signupEmail }: LoginSettingProps) => {
  const steps = ["基本資料", "聯繫方式"];
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState(() => {
    const name = signupName || searchParams.get("name")
    const email = signupEmail || searchParams.get("email")
    const value = { ...DEFAULT_FORM }
    if (name) value.name = name
    if (email) value.email = email
    return value
  });
  const [activeStep, setActiveStep] = useState(0);
  const { mutateAsync: onSignup } = useSignup(formData);

  const onSubmit = async (values: ProfileFormData | ContactFormData) => {
    setFormData((prev) => ({ ...prev, ...values }));
    if (activeStep === 0) {
      setActiveStep(1);
    }
    if (activeStep === 1) {
      await onSignup()
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.stepper}>
          <h2 className={styles.head}>
            {activeStep === 0 && "個人資料設定"}
            {activeStep === 1 && "註冊"}
          </h2>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <div>
          {activeStep === 0 && (
            <Formik
              onSubmit={(values) => onSubmit(values)}
              initialValues={formData as ProfileFormProps['values']}
              validationSchema={toFormikValidationSchema(
                z.object({
                  name: z.string({ message: '名稱是必填項' }),
                  describe: z.string({ message: '個人簡介是必填項' }).max(100, '個人簡介不能超過 100 個字元'),
                  projectUrl: z.string().url({ message: "無效的網址" }).optional(),
                  position: z.string({ message: '職位是必選項' }),
                  otherPosition: z.string().optional(),
                })
                .superRefine((data, ctx) => {
                  if (data.position === '其他' && !data.otherPosition) {
                    ctx.addIssue({
                      code: 'custom',
                      message: '請輸入其他職位',
                      path: ['otherPosition'],
                    })
                  }
                })
              )}
            >
              {({ errors, values, touched, handleChange }) => (
                <ProfileForm
                  values={values}
                  errors={formatErrorMessages(errors, touched)}
                  helperTexts={formatHelperTexts(errors, touched)}
                  onChange={handleChange}
                  onImagePathChange={(imagePath: string) => {
                    setFormData((prev) => ({ ...prev, imgPath: imagePath }));
                  }}
                  onPreviewImageChange={(imagePath: string) => {
                    setFormData((prev) => ({ ...prev, previewImage: imagePath }));
                  }}
                />
              )}
            </Formik>
          )}
          {activeStep === 1 && (
            <Formik
              onSubmit={(values) => onSubmit(values)}
              initialValues={formData as ContactFormData}
              validationSchema={toFormikValidationSchema(
                z.object({
                  emailPublic: z.boolean(),
                  facebook: z.string().optional(),
                  facebookPublic: z.boolean(),
                  instagram: z.string().optional(),
                  instagramPublic: z.boolean(),
                })
                .superRefine((data, ctx) => {
                  if (data.facebook === '其他' && !data.facebookPublic) {
                    ctx.addIssue({
                      code: 'custom',
                      message: '請輸入Facebook',
                      path: ['facebook'],
                    })
                  }
                  if (data.instagram === '其他' && !data.instagramPublic) {
                    ctx.addIssue({
                      code: 'custom',
                      message: '請輸入Instagram',
                      path: ['instagram'],
                    })
                  }
                })
              )}
            >
              {({ errors, values, touched, handleChange }) => (
                <ContactForm
                  values={values}
                  errors={formatErrorMessages(errors, touched)}
                  helperTexts={formatHelperTexts(errors, touched)}
                  onChange={handleChange}
                  onPrevStep={() => {
                    setActiveStep(0);
                  }}
                />
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSetting;
