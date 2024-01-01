import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import AuthInput from "~/components/auth/AuthInput";
import { signIn } from "next-auth/react";
import { GithubIcon } from "~/components/Icons";

const AuthForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [variant, setVariant] = useState("login");

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login",
    );
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="mb-6 text-3xl font-semibold">
          {variant === "login" ? "Sign in" : "Register"}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        {variant !== "login" && (
          <AuthInput
            label="Name"
            id="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        )}
        <AuthInput
          label="Email"
          id="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          type="email"
        />
        <AuthInput
          label="Password"
          id="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          type="password"
        />
      </div>

      <DialogFooter>
        <Button className="mt-8 w-full" type="submit">
          Login
        </Button>
      </DialogFooter>

      <div
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="mt-4 h-10 w-10 cursor-pointer self-center rounded-full transition hover:opacity-80"
      >
        <GithubIcon className="h-full w-full" />
      </div>

      <DialogDescription className="mt-4">
        {variant === "login"
          ? "First time using Molly?"
          : "Already have an account?"}
        <span
          onClick={toggleVariant}
          className="ml-1 cursor-pointer hover:underline"
        >
          {variant === "register" ? "Login" : "Create an account"}
        </span>
      </DialogDescription>
    </>
  );
};

export default AuthForm;
