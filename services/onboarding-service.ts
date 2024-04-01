import axios from "axios";
import { baseApiUrl } from "../config";
import { APIResponseType } from "@/types/shared";
import { VerificationResponseType } from "@/types/onboardingService";

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
}

export const onboardingService = new OnboardingService();
