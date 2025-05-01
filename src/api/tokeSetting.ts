import axios from "axios";
export const setToken = async(token: string) => {
  await axios.post(
    "api/tokensetting",
    {
      token,
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
