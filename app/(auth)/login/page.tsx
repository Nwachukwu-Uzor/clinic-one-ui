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
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader, PulseLoader } from "react-spinners";
import { VERIFY_EMAIL } from "@/constants";
import { loginService, onboardingService } from "@/services";
import { formatValidationErrors } from "@/utils/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "react-toastify";

const schema = z.object({
  email: z.string({
    required_error: "Email is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
});

type FormFields = z.infer<typeof schema>;

const Login = () => {
  const router = useRouter();
  const {
    register,
    setError,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const onSubmit: SubmitHandler<FormFields> = async (values) => {
    try {
      const response = await loginService.LoginPatient(values);
      if (!response?.status) {
        toast.error(response?.message);
      }
      toast.success(response?.message);
      sessionStorage.setItem("token", response?.data?.token);
      router.push("/dashboard");
    } catch (error: any) {
      const errorData = error?.response?.data?.data?.errors;

      if (errorData) {
        const formattedValidationErrors = formatValidationErrors(
          errorData as Record<string, string[]>
        );
        toast.error(formattedValidationErrors);
        setError("root", { type: "deps", message: formattedValidationErrors });
      } else {
        toast.error(
          error?.response?.data?.data?.title ??
            error?.message ??
            "An error occurred"
        );
      }
    }
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
        <form
          className="mt-4 flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            leftIcon={<MdOutlineMailOutline className="text-purple-700" />}
            placeholder="Email"
            {...register("email")}
            disabled={isSubmitting}
            error={errors?.email?.message}
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
          <div className="flex flex-col gap-0.5">
            {errors?.root?.message?.split(";").map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <PulseLoader color="#fff" /> : <>Login</>}
          </Button>
        </form>
      </Card>
    </article>
  );
};

export default Login;
