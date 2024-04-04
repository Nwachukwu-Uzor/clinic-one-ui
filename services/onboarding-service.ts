import axios from "axios";
import { baseApiUrl } from "../config";
import { APIResponseType } from "@/types/shared";
import { VerificationResponseType } from "@/types/onboardingService";
import { PatientType } from "@/types/patient";

class OnboardingService {
  async sendVerificationLink(data: { email: string }) {
    const response = await axios.post<APIResponseType<string>>(
      `${baseApiUrl}/Patients/PatientRegisterationRequest`,
      data
    );
    return response?.data;
  }

  async verifyEmail(data: { accessCode: string; id: string }) {
    const response = await axios.post<
      APIResponseType<VerificationResponseType>
    >(`${baseApiUrl}/Patients/VerifyPatientRegisterRequest`, data);
    return response?.data;
  }

  async createPatientPassword(data: {
    password: string;
    confirmPassword: string;
    patientRegisterationRequestId: string;
  }) {
    const response = await axios.post<APIResponseType<string>>(
      `${baseApiUrl}/Patients/CreatePatientPassword`,
      data
    );
    return response?.data;
  }

  async completePatientDetails(
    data: Partial<Omit<PatientType, "id" | "patientID">> & {
      appUserId: string;
    },
    token: string
  ) {
    const response = await axios.post<APIResponseType<PatientType>>(
      `${baseApiUrl}/Patients/CompletePatientDetails`,
      data,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response?.data;
  }
}

export const onboardingService = new OnboardingService();
