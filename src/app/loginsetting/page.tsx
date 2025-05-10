import React, { Suspense } from "react";
import LoginSetting from "./LoginSetting";
import { cookies } from "next/headers";

const LoginSettingPage = () => {
  const cookieStore = cookies();
  const signupName = cookieStore.get("signup_name")?.value;
  const signupEmail = cookieStore.get("signup_email")?.value;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginSetting
        signupName={signupName}
        signupEmail={signupEmail}
      />
    </Suspense>
  );
};

export default LoginSettingPage;

