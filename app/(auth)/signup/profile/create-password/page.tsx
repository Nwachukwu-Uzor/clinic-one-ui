"use client";
import React, { useState } from "react";
import { TextInput } from "@/components/shared";
import { Card, CardTitle } from "@/components/ui/card";
import { MdOutlineLock } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";

const CreatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const [accessCode, userId] = [
    searchParams.get("accessCode"),
    searchParams.get("userId"),
  ];

  // console.log({ accessCode, userId });

  const handleToggleShowPassword = () => {
    setShowPassword((shown) => !shown);
  };
  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword((shown) => !shown);
  };

  return (
    <article className="w-[90%] max-w-[500px]">
      <Card className="shadow-md px-3 py-6">
        <CardTitle className="text-lg">Create Password</CardTitle>
        <p className="leading-7 my-2 text-xs md:text-sm font-light">
          Please enter your desired password
        </p>
        <form className="mt-4 flex flex-col gap-2">
          <TextInput
            leftIcon={<MdOutlineLock className="text-purple-700" />}
            placeholder="Password"
            label="Password"
            type={showPassword ? "text" : "password"}
            rightIcon={
              <span
                className="cursor-pointer text-purple-600"
                onClick={handleToggleShowPassword}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            }
          />
          <TextInput
            leftIcon={<MdOutlineLock className="text-purple-700" />}
            placeholder="Confirm Password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            rightIcon={
              <span
                className="cursor-pointer text-purple-600"
                onClick={handleToggleShowConfirmPassword}
              >
                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            }
          />
          <Button className="w-full">Create Password</Button>
        </form>
      </Card>
    </article>
  );
};

export default CreatePassword;
