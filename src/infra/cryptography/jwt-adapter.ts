import { Encrypter } from '../../application/protocols'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  async encrypt (id: string): Promise<string> {
    return jwt.sign({ id }, 'elciess')
  }
}
