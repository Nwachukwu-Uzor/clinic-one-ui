"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GET_PATIENT_DATA } from "@/constants";
import { userService } from "@/services";
import { formatAPIError } from "@/utils/shared";
import { useQuery } from "@tanstack/react-query";
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
    retry: 2
  });
  return (
    <section>
      <h3>Profile</h3>
      {isLoading && (
        <div className="min-h-[40vh] flex items-center justify-center">
          <ClipLoader color="#7e22ce" />
        </div>
      )}
      {isError ? (
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
      ) : (
        <div></div>
      )}
    </section>
  );
};

export default Profile;
