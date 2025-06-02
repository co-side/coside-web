import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { useFormikContext } from "formik";
import { Field, FieldArray, getIn } from "formik";
import { useTheme } from "@mui/material/styles";
import { Box, Button, IconButton, TextField } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/material/styles";
import { FormValues } from "@/app/project/create/useFormControl";
import Select from "@/components/Select";
import { jobPosition } from "@/constant";

const Card = styled("div")(({ theme }) => ({
  position: "relative",
  padding: "24px 32px 40px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
  border: `1px solid ${theme.palette.grey[500]}`,
  borderRadius: "12px",
}));

export default function StepMember() {
  const theme = useTheme();
  const { values, handleChange, errors } = useFormikContext<FormValues>();

  return (
    <FieldArray name="partners">
      {(arrayHelpers) => (
        <>
          {values.partners.map((partner, index) => (
            <Card key={index}>
              <Box alignSelf="flex-end">
                {values.partners.length > 1 && (
                  <IconButton
                    onClick={() => {
                      if (values.partners.length > 1)
                        arrayHelpers.remove(index);
                      else {
                      }
                    }}
                  >
                    <Image
                      src="/delete.svg"
                      alt="delete icon"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                )}
              </Box>
              <Box display="flex" gap={2.5}>
                <Field
                  as={Select}
                  label="組員職位"
                  color="secondary"
                  options={jobPosition}
                  value={values.partners[index].jobPosition}
                  onChange={handleChange}
                  name={`partners[${index}].jobPosition`}
                  fullWidth
                  error={Boolean(
                    getIn(errors, `partners.${index}.jobPosition`)
                  )}
                  helperText={
                    getIn(errors, `partners.${index}.jobPosition`) || ""
                  }
                />
              </Box>
              {values.partners[index].jobPosition === "其他" && (
                <Box>
                  <Field
                    as={TextField}
                    label="其他職位"
                    placeholder="請輸入職位"
                    color="secondary"
                    value={values.partners[index].otherJobPosition}
                    onChange={handleChange}
                    name={`partners[${index}].otherJobPosition`}
                    fullWidth
                    error={Boolean(
                      getIn(errors, `partners.${index}.otherJobPosition`)
                    )}
                    helperText={
                      getIn(errors, `partners.${index}.otherJobPosition`)
                        ? getIn(errors, `partners.${index}.otherJobPosition`)
                        : ""
                    }
                  />
                </Box>
              )}

              <TextField
                label="能力要求"
                placeholder="若無，可不填"
                color="secondary"
                value={values.partners[index].projectRequirement}
                onChange={handleChange}
                name={`partners[${index}].projectRequirement`}
                minRows={3}
                fullWidth
                multiline
              />
              <FieldArray name={`partners[${index}].members`}>
                {(memberArrayHelpers) => (
                  <>
                    {values.partners[index].members.map((_, emailIndex) => (
                      <Box key={emailIndex} sx={{ display: "flex" }}>
                        <Field
                          as={TextField}
                          label="組員Email"
                          placeholder="請輸入Email"
                          value={values.partners[index].members[emailIndex]}
                          onChange={handleChange}
                          name={`partners.${index}.members[${emailIndex}]`}
                          color="secondary"
                          fullWidth
                          error={Boolean(
                            getIn(
                              errors,
                              `partners.${index}.members.${emailIndex}`
                            )
                          )}
                          helperText={
                            getIn(
                              errors,
                              `partners.${index}.members.${emailIndex}`
                            ) ?? ""
                          }
                        />
                        {/* delete icon */}
                        <IconButton
                          disabled={values.partners[index].members.length < 2}
                          onClick={() => {
                            memberArrayHelpers.remove(emailIndex);
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <mask
                              id="mask0_757_2444"
                              style={{ maskType: "alpha" }}
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            >
                              <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_757_2444)">
                              <path
                                d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17ZM14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17Z"
                                fill={
                                  values.partners[index].members.length > 1
                                    ? "#FF5D5D"
                                    : theme.palette.grey[100]
                                }
                              />
                            </g>
                          </svg>
                        </IconButton>
                      </Box>
                    ))}
                    {getIn(values, `partners.${index}.members`)?.length < 5 && (
                      <Box display="flex" sx={{ justifyContent: "center" }}>
                        <AddCircleOutlineIcon
                          color="secondary"
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            memberArrayHelpers.push("");
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </FieldArray>
            </Card>
          ))}
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
            onClick={() =>
              arrayHelpers.push({
                id: uuidv4(),
                jobPosition: "",
                number: 1,
                projectRequirement: "",
                members: [""],
              })
            }
          >
            新增職位
          </Button>
        </>
      )}
    </FieldArray>
  );
}
