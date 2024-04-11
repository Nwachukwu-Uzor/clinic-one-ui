"use client";
import { TOKEN_KEY } from "@/constants";
import { TokenType } from "@/types/shared";
import { decodeToken } from "@/utils/shared";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useAuth = (redirectUrl: string, tokenKey = TOKEN_KEY) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TokenType | null>(null);
  const router = useRouter();
  const url = usePathname();

  useEffect(() => {
    const token = sessionStorage.getItem(tokenKey);
    if (!token) {
      router.push(`${redirectUrl}?redirectUrl=${url.substring(1)}`);
      toast.warn("Unauthorized access. Please login to continue");
    } else {
      setIsLoading(false);
      const user = decodeToken(token) as TokenType;

      setUser(user);
    }
  }, [router, redirectUrl, tokenKey, url]);

  return { isLoading, user };
};
