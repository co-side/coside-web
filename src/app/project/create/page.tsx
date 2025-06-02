import Typography from "@mui/material/Typography";
import Form from "./Form/Form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Project",
};

export default function CreateProject() {
  return (
    <main style={{ padding: 16 }}>
      <Typography variant="h2" fontSize={32} mt={24} mb={8} align="center">
        發起專案
      </Typography>
      <Form />
    </main>
  );
}
