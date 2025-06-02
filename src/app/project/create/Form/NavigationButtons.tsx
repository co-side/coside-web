import { Box, Button } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useFormControlContext } from "@/app/project/create/FormControlContext";

export default function NavigationButtons({ onCancelAttempt }) {
  const formControl = useFormControlContext();

  const handleCancelClick = () => {
    if (formControl.activeStep === 0) {
      onCancelAttempt();
    } else {
      formControl.handlePrevious();
    }
  };

  return (
    <Box display="flex" width="100%" gap={2.5}>
      <Button
        size="large"
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={handleCancelClick}
      >
        {formControl.activeStep === 0 ? "取消" : "上一步"}
      </Button>

      {formControl.activeStep === 2 ? (
        <Button
          size="large"
          variant="contained"
          color="secondary"
          sx={{ color: "white" }}
          fullWidth
          // onClick={() => handleNext(values, setErrors)}
          type="submit"
        >
          發布
        </Button>
      ) : (
        <Button
          size="large"
          variant="contained"
          color="secondary"
          sx={{ color: "white" }}
          endIcon={<ChevronRightIcon />}
          fullWidth
          // onClick={() => handleNext(values, setErrors)}
          type="submit"
        >
          下一步
        </Button>
      )}
    </Box>
  );
}
