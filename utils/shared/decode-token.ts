import { TokenType } from "@/types/shared"
import { jwtDecode } from "jwt-decode"

export const decodeToken = (token: string) => {
    const decoded = jwtDecode(token)
    return decoded as TokenType;
}