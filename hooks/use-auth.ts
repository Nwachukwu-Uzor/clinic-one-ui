import { TOKEN_KEY } from "@/constants";
import { TokenType } from "@/types/shared";
import { decodeToken } from "@/utils/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useAuth = (redirectUrl: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TokenType | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push(redirectUrl);
      toast.warn("Unauthorized access. Please login to continue");
    } else {
      setIsLoading(false);
      const user = decodeToken(token);

      setUser(user);
    }
  }, [router, redirectUrl]);

  return { isLoading, user };
};
