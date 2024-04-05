"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { TOKEN_KEY } from "@/constants";
import { GET_STAFF_LIST } from "@/constants/query-keys";
import { StaffService } from "@/services";
import { StaffType } from "@/types/staff/staff-type";
import { formatAPIError } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React, { useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

const AllStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const token = sessionStorage.getItem(TOKEN_KEY);
  const staffService = new StaffService(token);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [GET_STAFF_LIST, currentPage],
    queryFn: async () => {
      const response = await staffService.getStaffList(currentPage);
      return response;
    },
  });
  const columns: ColumnDef<StaffType>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "middleName",
      header: "Middle Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "appUser.email",
      header: "Email",
    },
    {
      accessorKey: "staffID",
      header: "Staff ID",
    },
    {
      accessorKey: "job.department.name",
      header: "Department",
    },
    {
      accessorKey: "job.title",
      header: "Job",
    },
  ];

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
              All Staff
            </h2>
          </div>
          {/* {JSON.stringify(data)} */}
          <div className="my-2">
            <div className="flex justify-end my-4">
              <Button>
                <Link href="/staff/onboard" className="text-sm font-medium">
                  Onboard New Staff
                </Link>
              </Button>
            </div>
            {data.data.length > 0 ? (
              <div className=" bg-white">
                <DataTable columns={columns} data={data.data} />
                <div className="mt-2 flex items-center ga-p-2">
                  <ul>
                    {new Array(data.pageSize)
                      .fill("")
                      .map((_data, i) => i + 1)
                      .map((page) => (
                        <li key={page}>
                          <button>{page}</button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ) : (
              <article className="min-h-[40vh] mt-4 bg-white flex items-center justify-center text-center rounded-md">
                <div>
                  <h3 className="scroll-m-20 text-2xl font-semibold text-gray-600 tracking-tight">
                    No staff found.
                  </h3>
                </div>
              </article>
            )}
          </div>
        </article>
      ) : (
        <article className="min-h-[40vh] mt-4 bg-white flex items-center justify-center text-center rounded-md">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold text-gray-600 tracking-tight">
              You have not completed your profile yet.
            </h3>
            <p className="leading-7 my-4">
              Click the button below to get started.
            </p>
          </div>
        </article>
      )}
    </section>
  );
};

export default AllStaff;
