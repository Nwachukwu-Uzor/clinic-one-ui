"use client";
import React, { useState } from "react";
import { TextInput } from "@/components/shared";
import { Card, CardTitle } from "@/components/ui/card";
import { MdOutlineLock, MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoAlertCircleOutline,
  IoCheckmark,
} from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { VERIFY_EMAIL } from "@/constants";
import { onboardingService } from "@/services";
import { formatValidationErrors } from "@/utils/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const [accessCode, requestId] = [
    searchParams.get("access-code"),
    searchParams.get("requestId"),
  ];

  const {
    data,
    isError,
    error,
    isLoading: isVerifying,
  } = useQuery({
    queryKey: [VERIFY_EMAIL, accessCode, requestId],
    queryFn: async () => {
      const payload = {
        accessCode: accessCode ?? "",
        id: requestId ?? "",
      };
      const response = await onboardingService.verifyEmail(payload);
      console.log(response);
      return response;
    },
    retry: false,
  });

  const handleToggleShowPassword = () => {
    setShowPassword((shown) => !shown);
  };
  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword((shown) => !shown);
  };

  const formatError = () => {
    const customError = error as any;
    console.log(customError?.response);

    if (customError?.response?.data?.data?.errors) {
      return (
        formatValidationErrors(customError?.response?.data?.data?.errors) ??
        "Unable to verify link"
      );
    } else {
      return (
        customError?.response?.data?.data?.title ?? "Unable to verify link"
      );
    }
  };

  return (
    <article className="w-[90%] max-w-[500px]">
      <Card className="shadow-md px-3 py-6 mt-3">
        <CardTitle className="text-lg">Login</CardTitle>
        <p className="leading-7 my-2 text-xs md:text-sm font-light">
          Please enter your desired password
        </p>
        <form className="mt-4 flex flex-col gap-2">
          <TextInput
            leftIcon={<MdOutlineMailOutline className="text-purple-700" />}
            placeholder="Email"
            // {...register("email")}
            // disabled={isSubmitting}
            // error={errors?.email?.message}
          />
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

          <Button className="w-full">Login</Button>
        </form>
      </Card>
    </article>
  );
};

export default Login;
