"use client";
import React from "react";
import { z } from "zod";
import { TextInput } from "@/components/shared";
import { Card, CardTitle } from "@/components/ui/card";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { BsSend } from "react-icons/bs";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import { onboardingService } from "@/services";
import { formatValidationErrors } from "@/utils/shared";

const schema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Please provide a valid email address" }),
});

type FormFields = z.infer<typeof schema>;

const Signup = () => {
  const router = useRouter();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onboardingService.sendVerificationLink(data);
      if (!response?.status) {
        toast.error(response?.message);
      }
      toast.success(response?.message);
      router.push("/signup/email-sent");
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

  return (
    <article className="w-[90%] max-w-[500px]">
      <Card className="shadow-md px-3 py-6">
        <CardTitle className="text-lg">Sign Up</CardTitle>
        <p className="leading-7 my-2 text-xs md:text-sm font-light">
          Please enter your email address to sign up
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
          <div className="flex flex-col gap-0.5">
            {errors?.root?.message?.split(";").map((error) => (
              <p key={error} className="text-sm text-red-500">
                {error}
              </p>
            ))}
          </div>
          <Button className="w-full">
            {isSubmitting ? (
              <PulseLoader color="#fff" />
            ) : (
              <>
                <BsSend className="text-white inline-block mr-1" /> Send Link
              </>
            )}
          </Button>
        </form>
      </Card>
    </article>
  );
};

export default Signup;
