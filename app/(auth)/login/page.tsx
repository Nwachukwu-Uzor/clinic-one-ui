"use client";
import React, { useState } from "react";
import { TextInput } from "@/components/shared";
import { Card, CardTitle } from "@/components/ui/card";
import { MdOutlineLock, MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { loginService } from "@/services";
import { formatValidationErrors } from "@/utils/shared";
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
      console.log(error?.response);
      const errorData = error?.response?.data?.data?.errors;

      if (errorData) {
        const formattedValidationErrors = formatValidationErrors(
          errorData as Record<string, string[]>
        );
        toast.error(formattedValidationErrors);
        setError("root", { type: "deps", message: formattedValidationErrors });
      } else {
        setError("root", {
          type: "deps",
          message:
            error?.response?.data?.data?.title ??
            error?.message ??
            "An error occurred",
        });
        toast.error(
          error?.response?.data?.data?.title ??
            error?.message ??
            "An error occurred"
        );
      }
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
            {...register("password")}
            error={errors?.password?.message}
          />
          <div className="flex flex-col gap-0.5">
            {errors?.root?.message?.split(";").map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <PulseLoader color="#fff" /> : <>Login</>}
          </Button>
        </form>
      </Card>
    </article>
  );
};

export default Login;
