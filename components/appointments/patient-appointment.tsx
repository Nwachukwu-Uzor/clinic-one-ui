"use client";
import React, { useState } from "react";
import { TextInput } from "../shared";
import { Button } from "../ui/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AppointmentService } from "@/services";
import { TOKEN_KEY } from "@/constants";
import { toast } from "react-toastify";
import { formatAPIError, formatValidationErrors } from "@/utils/shared";
import { AllAppointments } from ".";
import { ClipLoader } from "react-spinners";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { IoAlertCircleOutline } from "react-icons/io5";

const schema = z.object({
  patientId: z.string({
    required_error: "Patient ID is required",
  }),
  startDate: z
    .string({
      required_error: "Start date is required",
    })
    .min(2, "Start date must be at least 6 characters"),
  endDate: z
    .string({
      required_error: "Start date is required",
    })
    .min(2, "Start date must be at least 6 characters"),
});

type FormFields = z.infer<typeof schema>;

export const PatientAppointment = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [patientId, startDate, endDate] = watch([
    "patientId",
    "startDate",
    "endDate",
  ]);

  const searchParam = useSearchParams();
  const { mutate, isPending, error, isError, data } = useMutation({
    mutationFn: async (data: {
      patientId: string;
      startDate: Date;
      endDate: Date;
      page: number;
    }) => {
      const response = await appointmentService.getAppointmentsByPatientIdList(
        data
      );
      return response?.data;
    },
  });

  const token = sessionStorage.getItem(TOKEN_KEY);
  const appointmentService = new AppointmentService(token);

  const onSubmit: SubmitHandler<FormFields> = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        page: pageNumber,
        pageSize: 20,
      };
      mutate(payload);
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

  const handlePaginate = () => {};

  return (
    <article className="bg-white min-h-[50vh] shadow-sm">
      <form
        className="p-2 flex flex-col lg:flex-row items-end gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          placeholder="PT-000000"
          label="Patient ID"
          {...register("patientId")}
          error={errors?.patientId?.message}
        />
        <div className="flex flex-col md:flex-row justify-between w-full gap-2 items-center">
          <TextInput
            label="Start Date"
            type="date"
            {...register("startDate")}
            error={errors?.startDate?.message}
          />
          <TextInput
            label="End Date"
            type="date"
            {...register("endDate")}
            error={errors?.endDate?.message}
          />
        </div>
        <div className="w-full mb-2 lg:ml-auto flex lg:justify-end">
          <Button>Search</Button>
        </div>
      </form>
      {isPending ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <ClipLoader color="#7e22ce" />
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <IoAlertCircleOutline className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(formatAPIError(error, "Unable to fetch profile") as string)
              ?.split(";")
              .map((error) => (
                <p key={error} className="text-sm text-main-red">
                  {error}
                </p>
              ))}
          </AlertDescription>
        </Alert>
      ) : data?.data ? (
        <article>
          <AllAppointments
            data={data}
            handlePaginate={handlePaginate}
            pageNumber={pageNumber}
          />
        </article>
      ) : null}
    </article>
  );
};
