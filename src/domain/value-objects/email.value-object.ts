export class Email {
  constructor(readonly email: string) {}

  static create(email: string): Email {
    return new Email(email)
  }
}
