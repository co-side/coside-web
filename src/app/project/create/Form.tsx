"use client";

import { useState } from "react";
import Image from "next/image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import TextField from "@mui/material/TextField";
import Select from "@/components/Select";
import UploadImage from "@/components/UploadImage";
import MDXEditor from "@/components/MDXEditor";
import { jobPosition, projectType, titleType } from "@/constant";
import useArray from "@/hooks/useArray";
import type { PartnerType } from "./Form.type";

const steps = ["專案基本資訊", "專案說明", "組員需求"];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 30,
    left: "max(-155px, calc(-50vw + 9rem))",
    right: "100%",
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[200],
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

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

const partnerNumberOption = Array.from({ length: 5 }, (_, index) => ({
  label: index + 1,
  value: index + 1,
}));

export default function Form() {
  const [activeStep, setActiveStep] = useState(0);
  const partners = useArray<PartnerType>({
    defaultValues: [{ id: "1", number: 1 }],
  });

  const handlePrevious = () => {
    setActiveStep((preStep) => {
      if (preStep > 0) return preStep - 1;
      return preStep;
    });
  };

  const handleNext = () => {
    setActiveStep((preStep) => {
      if (preStep < 2) return preStep + 1;
      return preStep;
    });
  };

  return (
    <Box
      maxWidth={600}
      mx="auto"
      mb={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
    >
      <Box width="100%" mb={4.5}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<QontoConnector />}
          sx={{ justifyContent: "space-between" }}
        >
          {steps.map((label) => (
            <Step
              key={label}
              sx={{
                p: 0,
                flex: "0 0 6rem",
                ".MuiStepLabel-root .Mui-completed": {
                  color: "secondary.dark",
                  opacity: 0.8,
                },
                ".MuiStepLabel-root .Mui-active": {
                  color: "secondary.dark",
                  fontWeight: "bold",
                },
              }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activeStep === 0 && (
        <>
          <Select
            label="發起類型"
            color="secondary"
            options={titleType}
            fullWidth
          />
          <Select
            label="專案類型"
            color="secondary"
            options={projectType}
            fullWidth
          />
          <TextField label="主題名稱" color="secondary" fullWidth />
          <Select label="主題/產業類別" color="secondary" fullWidth />
          <UploadImage />
          <TextField
            label="專案預計進行時間"
            helperText="未填寫則自動帶入未定"
            color="secondary"
            fullWidth
          />
        </>
      )}

      {activeStep === 1 && (
        <>
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
          <MDXEditor label="專案構想" markdown="" />
        </>
      )}

      {activeStep === 2 && (
        <>
          {Array.isArray(partners.values) &&
            partners.values.map((partner, index) => (
              <Card key={partner.id}>
                <Box alignSelf="flex-end">
                  <IconButton onClick={() => partners.remove(index)}>
                    <Image
                      src="/delete.svg"
                      alt="delete icon"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                </Box>
                <Box display="flex" gap={2.5}>
                  <Select
                    label="組員職位"
                    color="secondary"
                    options={jobPosition}
                    fullWidth
                  />
                  <Select
                    name="number"
                    label="人數"
                    color="secondary"
                    options={partnerNumberOption}
                    onChange={({ target }) => {
                      const { name, value } = target;
                      partners.update({ ...partner, [name]: value }, index);
                    }}
                    fullWidth
                  />
                </Box>
                <TextField
                  label="能力要求"
                  placeholder="若無，可不填"
                  color="secondary"
                  minRows={3}
                  fullWidth
                  multiline
                />
                {Array.from({ length: partner.number }, () => 0).map(
                  (_, index) => (
                    <TextField
                      key={index}
                      label="組員Email"
                      placeholder="請輸入Email"
                      color="secondary"
                      fullWidth
                    />
                  )
                )}
              </Card>
            ))}
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            fullWidth
            onClick={() =>
              partners.append({ id: Math.random().toString(), number: 1 })
            }
          >
            新增職位
          </Button>
        </>
      )}

      <Box display="flex" width="100%" gap={2.5}>
        <Button
          size="large"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handlePrevious}
        >
          取消
        </Button>
        <Button
          size="large"
          variant="contained"
          color="secondary"
          sx={{ color: "white" }}
          endIcon={activeStep !== 2 && <ChevronRightIcon />}
          fullWidth
          onClick={handleNext}
        >
          {activeStep === 2 ? "發布" : "下一步"}
        </Button>
      </Box>
    </Box>
  );
}
