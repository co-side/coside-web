import React, { Suspense } from "react";
import LoginSetting from "./LoginSetting";
import { cookies } from "next/headers";

const RegisterPage = async () => {
  const cookieStore = await cookies();
  const signupName = cookieStore.get("signup_name")?.value;
  const signupEmail = cookieStore.get("signup_email")?.value;
  const signupToken = cookieStore.get("signup_token")?.value;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginSetting
        signupName={signupName || ""}
        signupEmail={signupEmail || ""}
        signupToken={signupToken}
      />
    </Suspense>
  );
};

export default RegisterPage;

