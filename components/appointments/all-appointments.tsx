import { AppointmentType } from "@/types/appointment";
import { PaginatedResponseType } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "../ui/data-table";

type Props = {
  data: PaginatedResponseType<AppointmentType>;
  handlePaginate: (page: number) => void;
  pageNumber: number;
};

export const AllAppointments: React.FC<Props> = ({
  data,
  handlePaginate,
  pageNumber,
}) => {
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

  return data.data.length > 0 ? (
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
                <button onClick={() => handlePaginate(page)}>{page}</button>
              </li>
            ))}
        </ul>
        <div>
          <h4 className="font-medium text-gray-600 text-sm">
            Total Appointments Count:{" "}
            <span className="font-normal">{data.totalRecords}</span>
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
  );
};
