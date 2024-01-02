import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const validateInputs = ({
  name,
  email,
  password,
}: {
  name?: string;
  email: string;
  password: string;
}) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (name === "") {
    toast.error("Name required");
    return false;
  }

  if (email === "") {
    toast.error("Email required");
    return false;
  }

  if (!emailRegex.test(email)) {
    toast.error("Invalid email");
    return false;
  }

  if (password === "") {
    toast.error("Password required");
    return false;
  }

  return true;
};
