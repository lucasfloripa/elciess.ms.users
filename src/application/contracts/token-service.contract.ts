export class TokenService {
  generateAccessToken: (payload: any) => Promise<string>
  generateRefreshToken: (payload: any) => Promise<string>
  verifyAccessToken: (token: string) => string
  verifyRefreshToken: (token: string) => Promise<string>
}
