import Typography from "@mui/material/Typography";
import Form from "./Form";

export default function CreateProject() {
  return (
    <main>
      <Typography variant="h2" fontSize={32} mt={24} mb={8} align="center">發起專案</Typography>
      <Form />
    </main>
  );
}
