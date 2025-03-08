import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";
import { useState } from "react";
import { ArrowRight, Lock, TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Playwrite_GB_S } from "next/font/google";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const playwrite: { className: string } = Playwrite_GB_S({
  weight: "400",
});

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(password !== confirmPassword){
      setError("Password do not match");
      return;
    }
    setPending(true);
    signIn("password",{name, email, password, flow: "signUp"})
    .catch(() => {
      setError("Something went wrong")
    })
    .finally(() => {
      setPending(false);
    })
  };

  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className="w-full h-full p-8 rounded-3xl shadow-xl shadow-teal-900 bg-teal-500/20 border border-teal-600 backdrop-blur-lg backdrop-saturate-150">
      <CardHeader className="px-0 pt-0">
        <CardTitle
          className={`${playwrite.className} text-2xl font-bold text-gray-200 flex items-center justify-center gap-2`}
        >
          <Lock className="w-6 h-6 text-[#32c9ba]" />
          Join Us Today
        </CardTitle>
        <CardDescription className="text-gray-100 text-center mt-4">
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-4">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            type="text"
            required
          />
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button
            type="submit"
            className="w-full bg-[#26a89b] hover:bg-[#229185] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            size={"lg"}
            disabled={pending}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("google")}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FcGoogle
              style={{ width: "20px", height: "20px" }}
              className="absolute top-2.5 left-2.5"
            />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("github")}
            variant={"outline"}
            size={"lg"}
            className="w-full relative"
          >
            <FaGithub
              style={{ width: "20px", height: "20px" }}
              className="absolute top-2.5 left-2.5"
            />
            Continue with Github
          </Button>
        </div>
        <p className="mt-6 text-center text-gray-200">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="text-[#26a89b] hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

