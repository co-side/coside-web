import Box from "@mui/material/Box";
import Stepper, { stepperClasses } from "@mui/material/Stepper";
import Step, { stepClasses } from "@mui/material/Step";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import StepLabel, { stepLabelClasses } from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";

const CustomStepper = styled(Stepper)(({ theme }) => ({
  justifyContent: "space-between",
  [`.${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[200],
    borderTopWidth: 3,
    borderRadius: 1,
  },
  [`.${stepLabelClasses.label}`]: {
    color: theme.palette.text.primary,
    fontWeight: "bold",
  },
  [`.${stepLabelClasses.completed}`]: {
    color: theme.palette.secondary.dark,
    opacity: 0.8,
  },
  [`.${stepLabelClasses.active}`]: {
    color: theme.palette.secondary.dark,
    fontWeight: "bold",
  },
  [`.${stepClasses.root} .${stepLabelClasses.active}`]: {
    color: theme.figma.Secondary.dark_purple,
  }
}))

export interface StepParameters {
  label: React.ReactNode
}

export interface StepsProps<Step extends StepParameters> {
  active: number;
  steps: Step[];
}

export default function Steps<Step extends StepParameters>({ steps, active }: StepsProps<Step>) {
  return (
    <Box width="100%" mb={4.5}>
      <CustomStepper
        activeStep={active}
        alternativeLabel
        connector={<StepConnector />}
      >
        {steps.map(({ label }, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </CustomStepper>
    </Box>
  );
}
