"use client";
import React, { ChangeEvent } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET_ALL_DOCTORS, TOKEN_KEY } from "@/constants";
import { AppointmentService, DoctorService, PatientService } from "@/services";
import { Button } from "../ui/button";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { formatAPIError, formatValidationErrors } from "@/utils/shared";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { IoAlertCircleOutline, IoCheckmark } from "react-icons/io5";
import { DoctorType } from "@/types/staff";

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
  description: z.optional(z.string()),
});

type FormFields = z.infer<typeof schema>;

export const CreateAppointment = () => {
  const router = useRouter();
  const token = sessionStorage.getItem(TOKEN_KEY);
  const doctorService = new DoctorService(token);
  const appointmentService = new AppointmentService(token);
  const patientService = new PatientService(token);

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: [GET_ALL_DOCTORS],
    queryFn: async () => {
      const response = await doctorService.getAllDoctors();
      return response.data;
    },
  });

  const { reset, data, isError, error, isPending, mutate } = useMutation({
    mutationFn: async (data: string) => {
      const response = await patientService.getPatientByPatientID(data);
      console.log(response.data);

      return response.data;
    },
  });

  const {
    register,
    setError,
    handleSubmit,
    setValue,
    watch,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [patientID] = watch(["patientID"]);

  const onSubmit: SubmitHandler<FormFields> = async (values) => {
    try {
      const doctor = JSON.parse(values.doctorId) as DoctorType;
      const response = await appointmentService.creatAnAppointment({
        appointmentTime: new Date(values.appointmentTime),
        description: values.description,
        doctorId: doctor.id,
        patientId: data?.id as string,
      });
      if (!response?.status) {
        toast.error(response?.message);
      }
      toast.success(response?.message);
      resetForm();
      reset();
      router.push("/staff/appointments");
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

  const handleValidatePatientID = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    mutate(event.target.value);
  };

  const handlePatientIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue("patientID", event.target.value);
  };

  return (
    <article className="bg-white rounded-sm p-3 shadow-sm">
      <h3 className="font-semibold">Create Appointment</h3>
      <form
        className="max-w-[400px] my-3 flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          value={patientID}
          onChange={handlePatientIdChange}
          error={errors?.patientID?.message}
          onBlur={handleValidatePatientID}
        />
        <div className="my-2">
          {isPending ? (
            <p>Loading...</p>
          ) : isError ? (
            <Alert variant="destructive" className="py-2 text-sm">
              <div className="flex items-center gap-2">
                <IoAlertCircleOutline className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
              </div>
              <AlertDescription>
                {(formatAPIError(error) as string)?.split(";").map((error) => (
                  <p key={error} className="text-sm text-main-red">
                    {error}
                  </p>
                ))}
              </AlertDescription>
            </Alert>
          ) : data ? (
            <Alert variant="success" className="py-2 text-sm">
              <div className="flex items-center gap-2">
                <IoCheckmark className="h-4 w-4" />
                <AlertTitle>
                  {data?.firstName} {data?.lastName}
                </AlertTitle>
              </div>
            </Alert>
          ) : null}
        </div>
        <TextInput
          label="Appointment Date and Time: "
          type="datetime-local"
          {...register("appointmentTime")}
          error={errors?.appointmentTime?.message}
        />
        <TextInput
          label={
            <>
              Description <i className="font-regular">(Optional)</i>
            </>
          }
          {...register("description")}
          placeholder="Description"
          error={errors?.description?.message}
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
