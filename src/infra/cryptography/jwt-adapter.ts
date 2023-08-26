import { Decrypter, Encrypter } from '../../application/protocols'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  async encrypt (id: string): Promise<string> {
    return jwt.sign({ id }, 'elciess')
  }

  async decrypt (text: string): Promise<string> {
    return jwt.verify(text, 'elciess') as string
  }
}
