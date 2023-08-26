export interface UserValidation {
  execute: (token: string) => Promise<string>
}
