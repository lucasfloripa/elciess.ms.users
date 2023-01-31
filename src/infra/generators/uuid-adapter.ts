import { IdGenerator } from '../../application/protocols'

import { v4 as uuidv4 } from 'uuid'

export class UuidAdapter implements IdGenerator {
  async generate (): Promise<string> {
    return uuidv4()
  }
}
