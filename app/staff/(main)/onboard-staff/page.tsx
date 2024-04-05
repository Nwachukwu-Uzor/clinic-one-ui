"use client";
import React, { ChangeEvent } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { TextInput } from "@/components/shared";
import { countries } from "@/data";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { decodeToken, formatValidationErrors } from "@/utils/shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StaffService, onboardingService } from "@/services";
import { format } from "date-fns";
import {
  GET_ALL_DEPARTMENTS,
  GET_ALL_JOBS_FOR_DEPARTMENT,
  GET_STAFF_LIST,
  TOKEN_KEY,
} from "@/constants";

const schema = z.object({
  firstName: z
    .string({
      required_error: "First name required",
    })
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(2, "Last name must be at least 2 characters"),
  middleName: z.optional(z.string()),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Please provide a valid email address" }),
  country: z
    .string({ required_error: "Country is required" })
    .min(2, "Country is required"),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(2, "Phone number is required"),
  address: z
    .string({ required_error: "Address is required" })
    .min(2, "Address is required"),
  departmentId: z
    .string({ required_error: "Department is required" })
    .min(2, "Department is required"),
  jobId: z
    .string({ required_error: "Job is required" })
    .min(2, "Job is required"),
  dateOfBirth: z
    .string({ required_error: "Date of Birth is required" })
    .min(2, "Date of Birth is required"),
});

type FormFields = z.infer<typeof schema>;

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = sessionStorage.getItem(TOKEN_KEY) as string;
  const staffService = new StaffService(token);
  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: [GET_ALL_DEPARTMENTS],
    queryFn: async () => {
      const response = await staffService.getAllDepartments();
      return response.data;
    },
  });

  const {
    register,
    setError,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [countryInput, department] = watch(["country", "departmentId"]);
  const country = countryInput?.length > 0 ? JSON.parse(countryInput) : null;

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: [GET_ALL_JOBS_FOR_DEPARTMENT, department],
    queryFn: async () => {
      if (!department) {
        return [];
      }
      const response = await staffService.getJobForDepartment(department);
      return response.data;
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (values) => {
    console.log(values);

    try {
      const response = await staffService.onboardStaff({
        ...values,
        country: country.name,
        phoneNumber: `${country?.dial_code ?? ""}${values?.phoneNumber.trim()}`,
      });

      if (!response?.status) {
        toast.error(response?.message);
      }
      toast.success(response?.message);
      queryClient.invalidateQueries({ queryKey: [GET_STAFF_LIST] });
      reset();
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
        Onboard Staff
      </h2>
      <form
        className="bg-white p-3 rounded-md mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="leading-7 my-4">
          Please fill in this form to onboard a new staff.
        </p>
        <div className="grid lg:grid-cols-2 gap-x-2 gap-y-4">
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
          <TextInput
            label="Email"
            {...register("email")}
            error={errors?.email?.message}
            disabled={isSubmitting}
          />
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-sm">Country</label>
            <select
              className="relative w-full bg-gray-100 py-1.5 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade"
              {...register("country")}
              disabled={isSubmitting}
            >
              <option value="">Please select a country --</option>
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
            type="date"
            label="Date of Birth"
            // value={dateOfBirth}
            // onChange={handleDateChange}
            {...register("dateOfBirth")}
            error={errors?.dateOfBirth?.message}
          />
          <TextInput
            label="Phone"
            {...register("phoneNumber")}
            error={errors?.phoneNumber?.message}
            disabled={isSubmitting}
            leftIcon={
              <span className="text-[10px] inline-flex  justify-center items-center w-5 font-semibold">
                {country ? country?.dial_code : "--"}
              </span>
            }
          />
          <TextInput
            label="Address"
            {...register("address")}
            error={errors?.address?.message}
            disabled={isSubmitting}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Department: </label>
            <select
              className="relative w-full bg-gray-100 py-2 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade font-size"
              {...register("departmentId")}
              disabled={isSubmitting || isLoadingDepartments}
            >
              <option value="">
                {isLoadingDepartments
                  ? "Loading..."
                  : "-- Please select a department --"}
              </option>
              {departments &&
                departments?.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
            </select>
            <p className="h-1 mt-0.5 text-red-500 text-xs">
              {errors?.departmentId?.message}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">Job: </label>
            <select
              className="relative w-full bg-gray-100 py-2 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade font-size"
              {...register("jobId")}
              disabled={isSubmitting || isLoadingDepartments}
            >
              <option value="">
                {isLoadingJobs ? "Loading..." : "-- Please select a job --"}
              </option>
              {jobs &&
                jobs?.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
            </select>
            <p className="h-1 mt-0.5 text-red-500 text-xs">
              {errors?.jobId?.message}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 my-4">
          {errors?.root?.message?.split(";").map((error) => (
            <p key={error} className="text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>
        <Button className="w-[50%] max-w-[150px]" disabled={isSubmitting}>
          {isSubmitting ? <PulseLoader color="#fff" /> : "Submit"}
        </Button>
      </form>
    </section>
  );
};

export default Page;
