// src/@types/express/index.d.ts
import { type IUserTokenInfos } from '@/domain/interfaces'

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenInfos
    }
  }
}
