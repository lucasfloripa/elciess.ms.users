export class ITokenService {
  generateAccessToken: <T extends object>(payload: T) => Promise<string>
  generateRefreshToken: <T extends object>(payload: T) => Promise<string>
  verifyAccessToken: <T extends object>(token: string) => Promise<T | string>
  verifyRefreshToken: <T extends object>(token: string) => Promise<T | string>
}
