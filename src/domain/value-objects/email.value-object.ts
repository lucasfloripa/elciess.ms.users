export class Email {
  constructor(private readonly _email: string) {}

  static create(email: string): Email {
    return new Email(email)
  }

  value(): string {
    return this._email
  }
}
