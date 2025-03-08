"use client";
import { useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { CgMonday } from "react-icons/cg";
import { FlipWords } from "@/components/ui/flip-words";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  const text = state === "signIn" ? "In" : "Up";
  const words = [
    "Real-time",
    "Collaborate",
    "AI-powered",
    "Integrations",
    "Smart suggestions",
    "Automate",
    "Channels",
    "Workflows",
  ];


  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#1f2522] to-[#363b3a]">
      {/* Left Side - Logo */}
      <div className="hidden md:flex md:flex-col md:gap-0 flex-1 justify-center items-center relative shadow-xl shadow-teal-900 rounded-3xl bg-teal-950/10">
        <CgMonday className="text-teal-600 text-[100px]  absolute top-[-10px] right-[10px] " />
        <TextHoverEffect
          text="Kollab"
          // className="text-2xl font-semibold text-white"
        />
        <h1 className="text-3xl text-gray-100 text-center mb-4">
          <span className="text-7xl text-teal-600">S</span>ign {text} to access
          <span className="text-teal-600">
            <FlipWords words={words} /> <br />
          </span>{" "}
          features and streamline your workflow effortlessly!
        </h1>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex flex-1 justify-center">
        <div className="md:h-auto md:w-[420px]">
          {state === "signIn" ? (
            <SignInCard setState={setState} />
          ) : (
            <SignUpCard setState={setState} />
          )}
        </div>
      </div>
    </div>
  );
};
