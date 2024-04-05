import { TOKEN_KEY } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useAuth = (redirectUrl: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push(redirectUrl);
      toast.warn("Unauthorized access. Please login to continue");
    } else {
      setIsLoading(false);
    }
  }, [setIsLoading, router, redirectUrl]);

  return { isLoading };
};
