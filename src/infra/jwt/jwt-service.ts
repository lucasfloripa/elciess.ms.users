import * as jwt from 'jsonwebtoken'

import { type ITokenService } from '../../application/contracts'

export class JwtService implements ITokenService {
  private readonly JWT_SECRET: string
  private readonly ACCESS_TOKEN_EXPIRATION: string
  private readonly REFRESH_TOKEN_EXPIRATION: string

  constructor() {
    this.JWT_SECRET = String(process.env.JWT_SECRET)
    this.ACCESS_TOKEN_EXPIRATION = String(process.env.ACCESS_TOKEN_EXPIRATION)
    this.REFRESH_TOKEN_EXPIRATION = String(process.env.REFRESH_TOKEN_EXPIRATION)
  }

  async generateAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRATION
    })
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRATION
    })
  }

  verifyAccessToken: (token: string) => string

  async verifyRefreshToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET)
      return (decoded as jwt.JwtPayload).userId
    } catch (error) {
      return error.name
    }
  }
}
