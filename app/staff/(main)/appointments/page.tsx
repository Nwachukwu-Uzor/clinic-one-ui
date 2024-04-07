"use client";
import { CreateAppointment } from "@/components/appointments/create-appointment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { GET_STAFF_LIST, TOKEN_KEY } from "@/constants";
import { AppointmentService } from "@/services";
import { AppointmentType } from "@/types/appointment";
import { StaffType } from "@/types/staff/staff-type";
import { formatAPIError } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

const Appointments = () => {
  const router = useRouter();
  const searchParam = useSearchParams();

  const pageNumber =
    Number(searchParam.get("page")) > 0 ? Number(searchParam.get("page")) : 1;

  const mode = searchParam.get("mode");

  const token = sessionStorage.getItem(TOKEN_KEY);
  const appointmentService = new AppointmentService(token);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [GET_STAFF_LIST, pageNumber],
    queryFn: async () => {
      const response = await appointmentService.getUpcomingAppointmentsList(
        pageNumber
      );
      return response;
    },
  });
  const columns: ColumnDef<AppointmentType>[] = [
    {
      header: "Patient Name",
      accessorFn: (val) =>
        `${val?.patient?.firstName} ${val?.patient?.lastName}`,
    },
    {
      header: "Patient ID",
      accessorFn: (val) => val?.patient?.patientID,
    },
    {
      header: "Doctor Name",
      accessorFn: (val) =>
        `${val?.doctor?.staff?.firstName} ${val?.doctor?.staff?.lastName}`,
    },
    {
      header: "Doctor ID",
      accessorFn: (val) => val?.doctor?.staff?.staffID,
    },
    {
      accessorKey: "appointmentTime",
      header: "Appointment Time",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  const handlePaginate = (page: number) => {
    router.push(`/staff/appointments?page=${page}`);
  };

  return (
    <section>
      {isLoading ? (
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
          <div className="bg-purple-100 h-[10vh] rounded-md flex items-center justify-center">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight text-purple-800 first:mt-0">
              Appointments
            </h2>
          </div>
          <>
            {mode === "create" ? (
              <div className="my-4">
                <CreateAppointment />
              </div>
            ) : (
              <div className="my-2">
                <div className="flex justify-end my-4">
                  <Button>
                    <Link
                      href="/staff/appointments?mode=create"
                      className="text-sm font-medium"
                    >
                      Create an Appointment
                    </Link>
                  </Button>
                </div>
                {data.data.length > 0 ? (
                  <div className=" bg-white">
                    <DataTable columns={columns} data={data.data} />
                    <div className="mt-2 flex items-center justify-between gap-2 px-1">
                      <ul className="flex items-center border border-purple-600 my-1 rounded-sm">
                        {new Array(data.totalPages)
                          .fill("")
                          .map((_data, i) => i + 1)
                          .map((page) => (
                            <li
                              key={page}
                              className={`py-1 px-2 text-sm font-semibold [&:not(:last-child)]:border-r [&:not(:last-child)]:border-r-purple-600 duration-100 ease ${
                                pageNumber === page
                                  ? "bg-purple-600 text-white"
                                  : "bg-transparent text-purple-600"
                              }`}
                            >
                              <button onClick={() => handlePaginate(page)}>
                                {page}
                              </button>
                            </li>
                          ))}
                      </ul>
                      <div>
                        <h4 className="font-medium text-gray-600 text-sm">
                          Total Staff Count:{" "}
                          <span className="font-normal">
                            {data.totalRecords}
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                ) : (
                  <article className="min-h-[40vh] mt-4 bg-white flex items-center justify-center text-center rounded-md">
                    <div>
                      <h3 className="scroll-m-20 text-2xl font-semibold text-gray-600 tracking-tight">
                        No Appointment Found.
                      </h3>
                    </div>
                  </article>
                )}
              </div>
            )}
          </>
        </article>
      ) : (
        <article className="min-h-[40vh] mt-4 bg-white flex items-center justify-center text-center rounded-md">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold text-gray-600 tracking-tight">
              No data found.
            </h3>
          </div>
        </article>
      )}
    </section>
  );
};

export default Appointments;
