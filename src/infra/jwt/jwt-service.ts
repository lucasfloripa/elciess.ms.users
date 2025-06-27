import config from 'config'
import * as jwt from 'jsonwebtoken'

import { type ITokenService } from '../../application/contracts'
import { type JwtConfig } from '../interfaces'

export class JwtService implements ITokenService {
  private readonly JWT_SECRET: string
  private readonly JWT_REFRESH_SECRET: string
  private readonly ACCESS_TOKEN_EXPIRATION: number
  private readonly REFRESH_TOKEN_EXPIRATION: number

  constructor() {
    const jwtConfig = config.get<JwtConfig>('jwtConfig')
    this.JWT_SECRET = jwtConfig.jwtSecret
    this.JWT_REFRESH_SECRET = jwtConfig.jwtRefreshSecret
    this.ACCESS_TOKEN_EXPIRATION = jwtConfig.accessTokenExp
    this.REFRESH_TOKEN_EXPIRATION = jwtConfig.refreshTokenExp
  }

  async generateAccessToken<T extends object>(payload: T): Promise<string> {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRATION
    })
  }

  async generateRefreshToken<T extends object>(payload: T): Promise<string> {
    return jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRATION
    })
  }

  async verifyAccessToken<T extends object>(
    token: string
  ): Promise<T | string> {
    try {
      const response = jwt.verify(token, this.JWT_SECRET) as any
      const { exp, iat, ...data } = response
      return data
    } catch (error) {
      return error.name
    }
  }

  async verifyRefreshToken<T extends object>(
    token: string
  ): Promise<T | string> {
    try {
      const response = jwt.verify(token, this.JWT_REFRESH_SECRET) as any
      const { exp, iat, ...data } = response
      return data
    } catch (error) {
      return error.name
    }
  }
}
