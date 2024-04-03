"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GET_PATIENT_DATA } from "@/constants";
import { userService } from "@/services";
import { formatAPIError } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

const Profile = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: [GET_PATIENT_DATA],
    queryFn: async () => {
      const token = sessionStorage.getItem("token") as string;
      const response = await userService.getProfileByUserId(token);
      return response;
    },
    retry: 2,
  });
  return (
    <section>
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
        Profile
      </h2>
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
        <article></article>
      ) : (
        <article className="min-h-[40vh] mt-4 bg-white flex items-center justify-center text-center">
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
