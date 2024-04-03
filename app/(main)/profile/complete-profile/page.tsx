"use client";
import React from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { TextInput } from "@/components/shared";
import { bloodGroups, countries, genotypes } from "@/data";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { formatValidationErrors } from "@/utils/shared";

const schema = z.object({
  firstName: z.string({
    required_error: "First name required",
  }),
  lastName: z.string({
    required_error: "Last name is required",
  }),
  middleName: z.optional(z.string()),
  country: z.string({ required_error: "Country is required" }),
  phoneNumber: z.string({ required_error: "Phone number is required" }),
  address: z.string({ required_error: "Address is required" }),
  bloodGroup: z.string({ required_error: "Blood Group is required" }),
  genotype: z.string({ required_error: "Genotype is required" }),
});

type FormFields = z.infer<typeof schema>;

const Page = () => {
  const router = useRouter();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (values) => {
    try {
      console.log(values);
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
    <section>
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
        Complete Profile
      </h2>
      <form
        className="bg-white p-3 rounded-md mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="leading-7 my-4">
          Please fill in this form to complete your profile.
        </p>
        <div className="grid lg:grid-cols-2 gap-2">
          <TextInput
            label="First Name"
            {...register("firstName")}
            error={errors?.firstName?.message}
            disabled={isSubmitting}
          />
          <TextInput
            label="Middle Name"
            {...register("middleName")}
            disabled={isSubmitting}
          />
          <TextInput
            label="Last Name"
            {...register("lastName")}
            error={errors?.lastName?.message}
            disabled={isSubmitting}
          />
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm">Country</label>
            <select
              className="relative w-full bg-gray-100 py-1.5 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade"
              {...register("country")}
              disabled={isSubmitting}
            >
              {countries.map((country) => (
                <option key={country.code} value={JSON.stringify(country)}>
                  {country.name}
                </option>
              ))}
            </select>
            <p className="h-1 mt-0.5 text-red-500 text-xs">
              {errors?.country?.message}
            </p>
          </div>
          <TextInput
            label="Phone"
            {...register("phoneNumber")}
            error={errors?.phoneNumber?.message}
            disabled={isSubmitting}
          />
          <TextInput
            label="Address"
            {...register("address")}
            error={errors?.address?.message}
            disabled={isSubmitting}
          />
          <div className="flex flex-col gap-1.5">
            <Label>Genotype: </Label>
            <select
              className="relative w-full bg-gray-100 py-1.5 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade"
              {...register("genotype")}
              disabled={isSubmitting}
            >
              {genotypes.map((genotype) => (
                <option key={genotype.id} value={genotype.value}>
                  {genotype.label}
                </option>
              ))}
            </select>
            <p className="h-1 mt-0.5 text-red-500 text-xs">
              {errors?.genotype?.message}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Blood Group: </Label>
            <select
              className="relative w-full bg-gray-100 py-1.5 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade"
              {...register("bloodGroup")}
              disabled={isSubmitting}
            >
              {bloodGroups.map((bloodGroup) => (
                <option key={bloodGroup.id} value={bloodGroup.value}>
                  {bloodGroup.label}
                </option>
              ))}
            </select>
            <p className="h-1 mt-0.5 text-red-500 text-xs">
              {errors?.bloodGroup?.message}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          {errors?.root?.message?.split(";").map((error) => (
            <p key={error} className="text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>
        <Button className="mt-3 w-[50%] max-w-[150px]" disabled={isSubmitting}>
          {isSubmitting ? <PulseLoader /> : "Submit"}
        </Button>
      </form>
    </section>
  );
};

export default Page;
