// hooks/useProjectSubmission.ts
import axios from 'axios';
import { FormikHelpers } from 'formik';
import { doValidate } from '../utils/validation';
import { step2ValidationSchema } from './useFormValidation';
import { FormValues } from './useFormControl';

export const useProjectSubmission = () => {
  const uploadImageBeforeSubmit = async (
    formValues: FormValues,
  ) => {
    try {
      switch (formValues.imageType) {
        case "upload": {
          if (!formValues.bannerUpload) {
            throw new Error("No file selected for upload");
          }

          const data = new FormData();
          data.append("file", formValues.bannerUpload as Blob);

          const response = await axios.post(`/api/upload?type=images`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data;
        }

        case "coside": {
          return formValues.bannerCoside;
        }

        case "unsplash": {
          // console.log(formValues.bannerUnsplash);

          try {
            if (!formValues.bannerUnsplash) {
              throw new Error("No Unsplash image selected");
            }
            // 原始圖片資訊
            const imageUrl = formValues.bannerUnsplash.urls.raw;
            const downloadUrl =
              formValues.bannerUnsplash.links.download_location;

            // 壓縮參數
            let width = 1920;
            let quality = 80; // 初始品質
            const minQuality = 60; // 最低品質
            const fileSizeLimit = 3 * 1024 * 1024; // 3MB

            // 建立壓縮後的圖片 URL
            const getCompressedUrl = (url: any, width: any, quality: any) => {
              return `${url}?w=${width}&q=${quality}&fm=jpg&fit=max`;
            };

            // 用 axios 獲取圖片 Blob 並檢查大小
            const compressAndGetQuality = async (url: any) => {
              let compressedUrl = getCompressedUrl(url, width, quality);

              while (true) {
                const response = await axios.get(compressedUrl, {
                  responseType: "blob",
                });
                const blob = response.data;

                if (blob.size <= fileSizeLimit || quality <= minQuality) {
                  // 返回確認後的 URL 和品質
                  return { blob };
                }

                // 若大小不合格且品質未達最低，降低品質再試
                quality -= 10;
                compressedUrl = getCompressedUrl(url, width, quality);
              }
            };

            // 獲取確認後的壓縮 URL 和品質以及 blob
            const { blob: compressedBlob } =
              await compressAndGetQuality(imageUrl);

            await axios.get(
              `${downloadUrl}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID}`
            );

            // 使用前面已經取得的壓縮後 blob 來建立 File 物件
            const file = new File(
              [compressedBlob],
              `${formValues.bannerUnsplash.id}.jpg`,
              { type: "image/jpeg" }
            );

            // 建立 FormData 並上傳圖片
            const data = new FormData();
            data.append("file", file);

            const res = await axios.post(`/api/upload?type=images`, data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            return res.data.data;
          } catch (e) {
            console.error("處理圖片或上傳時發生錯誤:", e);
          }
        }

        default:
          throw new Error("Invalid image type");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const submitProject = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
    activeStep: number
  ) => {
    const { setErrors, setSubmitting } = formikHelpers;

    if (activeStep !== 2) {
      return false; // Not at the final step
    }

    try {
      setSubmitting(true);

      // 1. Validate the form data
      const validateResult = await doValidate(values, step2ValidationSchema);
      if (validateResult) {
        setErrors(validateResult);
        return false;
      }

      // 2. Upload the image
      const imgPath = await uploadImageBeforeSubmit(values);

      // 3. Transform members data
      if (!values.partners) {
        throw new Error("No partner");
      }

      const members = values.partners.flatMap((partner) =>
        partner.members.map((member) => ({
          role: partner.jobPosition,
          skill: partner.projectRequirement || "",
          email: member.trim() === "" ? null : member,
          group: partner.jobPosition,
        }))
      );

      // 4. Prepare the request body
      const bodyData = {
        name: values.title,
        type: values.titleType,
        duration: values.projectDuration,
        background_Path: imgPath,
        description: values.MKContent,
        categories: [values.projectType],
        members,
        industry: "未分類",
        tags: ["未分類"],
      };

      // 5. Submit the project
      await axios.post(`/api/project`, bodyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return true;
    } catch (error: any) {
      console.error("Submit error:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        setErrors({ submit: "請重新登入" });
      } else if (error.response?.status === 413) {
        setErrors({ submit: "圖片檔案過大，請選擇較小的檔案" });
      } else {
        setErrors({ submit: "發生錯誤，請稍後再試" });
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitProject };
};