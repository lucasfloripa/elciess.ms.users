export interface IDeleteUserUsecase {
  execute: (userId: string) => Promise<boolean | Error>
}
