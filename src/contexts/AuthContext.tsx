import { RegisterRequestDTO } from "@/services/auth";
import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isLogin: false,
  fetchSignin: (params: { code: string }): Promise<unknown> => {
    throw new Error("Function not implemented.");
  },
  fetchLogout: (): Promise<unknown> => {
    throw new Error("Function not implemented.");
  },
  fetchSignup: (dto: RegisterRequestDTO): Promise<unknown> => {
    throw new Error("Function not implemented.");
  },
})

export const useAuth = () => useContext(AuthContext)
