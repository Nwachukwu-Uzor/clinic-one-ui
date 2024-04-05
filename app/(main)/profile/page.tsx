"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GET_PATIENT_DATA, TOKEN_KEY } from "@/constants";
import { userService } from "@/services";
import { formatAPIError } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";

import { ClipLoader } from "react-spinners";

const Profile = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: [GET_PATIENT_DATA],
    queryFn: async () => {
      const token = sessionStorage.getItem(TOKEN_KEY) as string;
      const response = await userService.getProfileByUserId(token);
      return response;
    },
    retry: 2,
  });
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
              Profile
            </h2>
          </div>
          <Card className="mt-3 py-3 shadow-sm">
            <div className="bg-purple-100 h-8 md:h-14 lg:h-20 aspect-square rounded-full flex items-center justify-center mx-auto my-3">
              <h3 className="font-bold text-gray-700 md:text-xl lg:text-2xl">
                {data.data.firstName.charAt(0)}
                {data.data.lastName.charAt(0)}
              </h3>
            </div>
            <div className="flex-1">
              <div>
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2 border-y border-gray-200 p-1 bg-gray-100">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-4 justify-between gap-2 md:gap-4 lg:gap-6 px-2 lg:px-3">
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      First Name:
                    </h3>
                    <p className="text-sm">{data.data.firstName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Middle Name:
                    </h3>
                    <p className="text-sm">{data.data.middleName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Last Name:
                    </h3>
                    <p className="text-sm">{data.data.lastName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Date of Birth:
                    </h3>
                    <p className="text-sm">
                      {format(new Date(data.data.dateOfBirth), "yyyy-MM-dd")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Phone Number:
                    </h3>
                    <p className="text-sm">{data.data.phoneNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Address:
                    </h3>
                    <p className="text-sm">{data.data.address}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Country:
                    </h3>
                    <p className="text-sm">{data.data.country}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">Email:</h3>
                    <p className="text-sm">{data.data.appUser.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 ">
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2 border-y border-gray-200 p-1 bg-gray-100">
                  Blood Group and Genotype
                </h2>
                <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-4 justify-between gap-2 md:gap-4 lg:gap-6 px-2 lg:px-3">
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Blood Group:{" "}
                    </h3>
                    <p className="text-sm font-light">{data.data.bloodGroup}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">
                      Genotype:{" "}
                    </h3>
                    <p className="text-sm font-light">{data.data.genotype}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
            <Link href="/profile/complete-profile">
              <Button>Complete Profile</Button>
            </Link>
          </div>
        </article>
      )}
    </section>
  );
};

export default Profile;
