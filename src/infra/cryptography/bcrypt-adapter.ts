import { HashComparer, Hasher } from '../../application/protocols'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async compare (hash: string, hashToCompare: string): Promise<boolean> {
    return await bcrypt.compare(hash, hashToCompare)
  }

  async hash (plaintext: string): Promise<string> {
    return await bcrypt.hash(plaintext, this.salt)
  }
}
