"use client";
import React, { ChangeEvent } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../shared";
import { useQuery } from "@tanstack/react-query";
import { GET_ALL_DOCTORS, TOKEN_KEY } from "@/constants";
import { AppointmentService, DoctorService } from "@/services";
import { Button } from "../ui/button";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { formatValidationErrors } from "@/utils/shared";

const schema = z.object({
  patientID: z
    .string({
      required_error: "Patient ID is requeired",
    })
    .min(2, "Patient ID is required"),
  doctorId: z
    .string({
      required_error: "Please select a doctor",
    })
    .min(2, "Please select a doctor"),
  appointmentTime: z
    .string({
      required_error: "Appointment time is requeired",
    })
    .min(2, "Appointment time is required"),
});

type FormFields = z.infer<typeof schema>;

export const CreateAppointment = () => {
  const router = useRouter();
  const token = sessionStorage.getItem(TOKEN_KEY);
  const doctorService = new DoctorService(token);
  const appointmentService = new AppointmentService(token);

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: [GET_ALL_DOCTORS],
    queryFn: async () => {
      const response = await doctorService.getAllDoctors();
      return response.data;
    },
  });
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
      const response = await appointmentService.creatAnAppointment(values);
      if (!response?.status) {
        toast.error(response?.message);
      }
      toast.success(response?.message);
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

  const handleValidatePatientID = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
  };

  return (
    <article className="bg-white rounded-sm p-3 shadow-sm">
      <h3 className="font-semibold">Create Appointment</h3>
      <form className="max-w-[400px] my-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm">Doctor</label>
          <select
            className="relative w-full bg-gray-100 py-1.5 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade"
            {...register("doctorId")}
            disabled={isSubmitting}
          >
            <option value="">
              {isLoadingDoctors ? "Loading..." : "-- Please select a doctor --"}
            </option>
            {doctors &&
              doctors.map((doctor) => (
                <option key={doctor.id} value={JSON.stringify(doctor)}>
                  {doctor.staff.firstName} {doctor.staff.lastName} - (
                  {doctor.staff.job.title})
                </option>
              ))}
          </select>
          <p className="h-1 mt-0.5 text-red-500 text-xs">
            {errors?.doctorId?.message}
          </p>
        </div>
        <TextInput
          label="Patient ID"
          placeholder="Patient ID"
          {...register("doctorId")}
          error={errors?.doctorId?.message}
          onBlur={handleValidatePatientID}
        />
        <TextInput
          label="Appointment Date and Time: "
          type="datetime-local"
          {...register("appointmentTime")}
          error={errors?.appointmentTime?.message}
        />

        <div className="flex flex-col gap-0.5">
          {errors?.root?.message?.split(";").map((error) => (
            <p key={error} className="text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <PulseLoader color="#fff" /> : <>Submit</>}
        </Button>
      </form>
    </article>
  );
};
