"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import style from "@/styles/theme"

import Box from "@mui/material/Box";
import { useSearchParams, useRouter } from "next/navigation";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import { IconButton, Avatar, Button } from "@mui/material";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import styles from "./page.module.scss";
import SelectLabels from "@/components/LoginPage/select";

import { Formik, Form, Field } from "formik";
import { set, z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import useLoginStore from "@/stores/loginStore";

import axios from "axios";
import { userGetSelf } from "@/api/user";
import { setToken } from "@/api/tokeSetting";

const LoginSetting = () => {
  const steps = ["基本資料", "聯繫方式"];

  const params = useSearchParams();;
  const email = params.get("email");
  const name = params.get("name"); 
  const settingToken = params.get("token");
  setToken(settingToken);

  const { setUserInfo, token, isAuthenticated } = useLoginStore();
  const router = useRouter()

  const [formData, setFormData] = useState({
    previewImage: "",
    image: "",
    name: name,
    email: email,
    email2: "",
    emailPublic: true,
    position: "",
    describe: "",
    projectUrl: "",
    LineId: "",
    LineIdPublic: false,
    facebook: "",
    facebookPublic: false,
    instagram: "",
    instagramPublic: false,
    imgPath: "",
    otherPosition: "",
  });

  const [fileError, setFileError] = useState<string>("");

  const [activeStep, setActiveStep] = useState<number>(0);

  const prevStep = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    }
    return;
  };

  const nextStep = async () => {
    if (activeStep === 0) {
      // 檢查是否有
      setActiveStep(1);
    } else if (activeStep === 1) {
      // 檢查是否有填完全部內容
      const bodyData = JSON.stringify({
        name: formData.name,
        email: email,
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
      });
      try {
        const res = await axios.post(
          `/api/signup`,
          bodyData,
          {
            headers: {
              Authorization: `Bearer ${settingToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.success) {
          const userInfo = await userGetSelf(res.data.data.token);
          setUserInfo(res.data.data.token, userInfo.data); // 儲存進 store
          router.push("/")
        } else {
          console.error(res.data.message)
        }


      } catch (e) {

      }
    }
  };



  const step1ValidationSchema = z.object({
    name: z.string().optional(),
    describe: z.string().optional(),
    position: z.string().optional(),
    otherPosition: z.string().optional(),
    projectUrl: z.string().url({ message: "無效的網址" }).optional(),
  }).superRefine((data, ctx) => {
    if (!data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "名稱是必填項",
        path: ["name"],
      });
    }
    if (!data.describe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "個人簡介是必填項",
        path: ["describe"],
      });
    } else if (data.describe.length > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "個人簡介不能超過 100 個字元",
        path: ["describe"],
      });
    }
    if (!data.position) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "職位是必選項",
        path: ["position"],
      });
    }
    if (data.position === "其他" && !data.otherPosition) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "請輸入其他職位",
        path: ["otherPosition"],
      });
    }
  });

  const step2ValidationSchema = z
    .object({
      emailPublic: z.boolean(),
      // email2: z
      //   .string({ message: "必填" })
      //   .email({ message: "無效的電子郵件地址" }),
      // email2: z.string().optional(),
      // LineId: z.string().optional(),
      // LineIdPublic: z.boolean(),
      facebook: z.string().optional(),
      facebookPublic: z.boolean(),
      instagram: z.string().optional(),
      instagramPublic: z.boolean(),
    })
    // .refine(
    //   (data) => {
    //     if (data.emailPublic) {
    //       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //       console.log(
    //         data.email2 &&
    //           emailRegex.test(data.email2) &&
    //           data.email2.length > 0
    //       );
    //       return (
    //         data.email2 &&
    //         emailRegex.test(data.email2) &&
    //         data.email2.length > 0
    //       );
    //     }
    //     return true;
    //   },
    //   {
    //     message: "請輸入正確的電子郵件地址",
    //     path: ["email2"], // 錯誤消息會附加到 `email` 字段
    //   }
    // )
    // .refine(
    //   (data) => {
    //     if (data.LineIdPublic) {
    //       return data.LineId && data.LineId.length > 0;
    //     }
    //     return true;
    //   },
    //   {
    //     message: "請輸入Line ID",
    //     path: ["LineId"],
    //   }
    // )
    .refine(
      (data) => {
        if (data.facebookPublic) {
          return data.facebook && data.facebook.length > 0;
        }
        return true;
      },
      {
        message: "請輸入Facebook",
        path: ["facebook"],
      }
    )
    .refine(
      (data) => {
        if (data.instagramPublic) {
          return data.instagram && data.instagram.length > 0;
        }
        return true;
      },
      {
        message: "請輸入Instagram",
        path: ["instagram"],
      }
    );

  const switchSetting = (disabled = false) => {
    return {
      "& .MuiSwitch-switchBase": {
        //   transitionDuration: '300ms',
        "&.Mui-checked": {
          // transform: 'translateX(16px)',
          // color: "#fff",
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
        //   boxSizing: 'border-box',
        //   width: 20,
        //   height: 20,
        backgroundColor: "#e9e9ea",
      },
      "& .MuiSwitch-track": {
        borderRadius: 13 / 2,
        backgroundColor: "#e9e9ea",
        opacity: 1,
        transition: "background-color 500ms",
      },
    };
  };

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
            <div>
              <Formik
                initialValues={formData}
                validationSchema={toFormikValidationSchema(
                  step1ValidationSchema
                )}
                // validationSchema={toFormikValidationSchema(validationSchema)}
                onSubmit={(values) => {
                  setFormData({ ...formData, ...values });
                  nextStep();
                }}
              >
                {({
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  values,
                  setFieldValue,
                }) => (
                  <Form>
                    {/* 圖片上傳 */}
                    <div className={styles.inner}>
                      <div className={styles.form}>
                        <>
                          <div className={styles.upload}>
                            <input
                              accept=".jpg, .jpeg, .png"
                              style={{ display: "none" }}
                              id="icon-button-file"
                              type="file"
                              onChange={async (event) => {
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

                                const reader = new FileReader();
                                reader.onload = () => {
                                  // setFormData({
                                  //   ...formData,
                                  //   previewImage: (reader.result as string) || "",
                                  // });
                                  // setFieldValue(
                                  //   "previewImage",
                                  //   (reader.result as string) || ""
                                  // )
                                };

                                const data = new FormData();
                                data.append("file", file);
                                try {
                                  const res = await axios.post(
                                    `/api/upload?type=images`,
                                    data,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${settingToken}`,
                                        "Content-Type": "multipart/form-data",
                                      },
                                    }
                                  );
                                  setFormData({
                                    ...formData,
                                    imgPath: res.data.data,
                                  });
                                  setFieldValue(
                                    "imgPath",
                                    res.data.data
                                  );

                                } catch (e) {
                                  setFileError("上傳失敗，請稍後再試");
                                  setFieldValue(
                                    "previewImage",
                                    ""
                                  )
                                  setFormData({
                                    ...formData,
                                    previewImage: "",
                                  });
                                }

                                reader.readAsDataURL(file);
                              }}
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
                              <p>大小上限：2Mb</p>
                            </div>
                            {fileError && (
                              <p className={styles.errorText}>{fileError}</p>
                            )}
                          </div>
                          {formData.imgPath && (
                            <div style={{ width: '200px', position: 'relative' }}>
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.imgPath}`}
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
                            onChange={handleChange}
                            value={values.name}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                              },
                            }}
                          />
                          <Field
                            as={TextField}
                            id="email"
                            name="email"
                            label="電子信箱"
                            fullWidth
                            onChange={handleChange}
                            value={values.email}
                            disabled
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                              },
                            }}
                          />
                          <Field
                            as={SelectLabels}
                            id="position"
                            name="position"
                            label="你主要的職位"
                            value={values.position}
                            onChange={handleChange}
                            fullWidth
                            error={touched.position && Boolean(errors.position)}
                            helperText={touched.position && errors.position}
                          />
                          {values.position === "其他" && (
                            <Field
                              as={TextField}
                              id="otherPosition"
                              name="otherPosition"
                              label="請輸入其他職位"
                              fullWidth
                              onChange={handleChange}
                              value={values.otherPosition}
                              error={touched.otherPosition && Boolean(errors.otherPosition)}
                              helperText={touched.otherPosition && errors.otherPosition}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                },
                              }}
                            />
                          )}
                          <Field
                            as={TextField}
                            id="describe"
                            name="describe"
                            label="個人簡介"
                            multiline
                            rows={8}
                            fullWidth
                            onChange={handleChange}
                            value={values.describe}
                            error={touched.describe && Boolean(errors.describe)}
                            helperText={touched.describe && errors.describe}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                              },
                            }}
                          />
                          <Field
                            as={TextField}
                            id="projectUrl"
                            name="projectUrl"
                            label="作品集網址"
                            fullWidth
                            onChange={handleChange}
                            value={values.projectUrl}
                            error={
                              touched.projectUrl && Boolean(errors.projectUrl)
                            }
                            helperText={touched.projectUrl && errors.projectUrl}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                              },
                            }}
                          />
                        </>

                        <div className={styles.buttonContainer}>
                          <Button
                            disabled={activeStep === 0}
                            variant="outlined"
                            className={styles.btn}
                            onClick={prevStep}
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
                )}
              </Formik>
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <Formik
                initialValues={formData}
                validationSchema={toFormikValidationSchema(
                  step2ValidationSchema
                )}
                // validationSchema={toFormikValidationSchema(validationSchema)}
                onSubmit={(values) => {
                  setFormData({ ...formData, ...values });
                  nextStep();
                }}
              >
                {({
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  values,
                  setFieldValue,
                }) => (
                  <Form>
                    {/* 圖片上傳 */}
                    <div className={styles.inner}>
                      <div className={styles.form}>
                        <>
                          <div className={styles.flexItem}>
                            <Field
                              as={TextField}
                              id="email"
                              name="email"
                              label="電子信箱"
                              fullWidth
                              disabled
                              onChange={handleChange}
                              value={values.email}
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email2 && errors.email2}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                },
                              }}
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
                                  sx={() => switchSetting(true)}
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
                          {/* <div className={styles.flexItem}>
                            <Field
                              as={TextField}
                              id="LineId"
                              name="LineId"
                              label="LINE ID"
                              fullWidth
                              onChange={handleChange}
                              value={values.LineId}
                              error={touched.LineId && Boolean(errors.LineId)}
                              helperText={touched.LineId && errors.LineId}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                },
                              }}
                            />
                            <FormControlLabel
                              value="LineIdPublic"
                              control={
                                <Field
                                  as={Switch}
                                  name="LineIdPublic"
                                  color="primary"
                                  checked={values.LineIdPublic}
                                  onChange={(event) => {
                                    setFieldValue(
                                      "LineIdPublic",
                                      event.target.checked
                                    );
                                  }}
                                  sx={switchSetting}
                                />
                              }
                              label={values.LineIdPublic ? "公開" : "關閉"}
                              labelPlacement="top"
                              className={styles.switch}
                            />
                          </div> */}
                          <div className={styles.flexItem}>
                            <Field
                              as={TextField}
                              id="facebook"
                              name="facebook"
                              label="Facebook"
                              fullWidth
                              onChange={handleChange}
                              value={values.facebook}
                              error={
                                touched.facebook && Boolean(errors.facebook)
                              }
                              helperText={touched.facebook && errors.facebook}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                },
                              }}
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
                                  sx={() => switchSetting()}
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
                              onChange={handleChange}
                              value={values.instagram}
                              error={
                                touched.instagram && Boolean(errors.instagram)
                              }
                              helperText={touched.instagram && errors.instagram}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                },
                              }}
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
                                    setFieldValue(
                                      "instagramPublic",
                                      event.target.checked
                                    );
                                  }}
                                  sx={() => switchSetting()}
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
                        </>

                        <div className={styles.buttonContainer}>
                          <Button
                            disabled={Number(activeStep) === 0}
                            variant="outlined"
                            className={styles.btn}
                            onClick={prevStep}
                            startIcon={<ArrowBackIosIcon />}
                          >
                            上一步
                          </Button>
                          {Number(activeStep) === 0 && (
                            <Button
                              type="submit"
                              variant="contained"
                              className={styles.btn}
                              onClick={nextStep}
                              endIcon={<ArrowForwardIosIcon />}
                            >
                              下一步
                            </Button>
                          )}
                          {activeStep === 1 && (
                            <Button
                              type="submit"
                              variant="contained"
                              className={styles.btn}
                              endIcon={<ArrowForwardIosIcon />}
                            >
                              完成
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSetting;
