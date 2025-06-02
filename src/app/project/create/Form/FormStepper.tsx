import { Box, Stepper, Step, StepLabel } from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { useFormControlContext } from "@/app/project/create/FormControlContext";

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

const steps = ["專案基本資訊", "專案說明", "組員需求"];

export default function FormStepper() {
  const formControl = useFormControlContext();

  return (
    <Box width="100%" mb={4.5}>
      <Stepper
        activeStep={formControl.activeStep}
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
  );
}
