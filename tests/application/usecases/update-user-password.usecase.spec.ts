import { type IUserRepository } from '@/application/contracts'
import { UpdateUserPasswordUsecase } from '@/application/usecases'
import { UserEnums } from '@/domain/enums'
import { ConflictError, NotFoundError } from '@/domain/errors'
import { Password } from '@/domain/value-objects'

describe('UpdateUserPasswordUsecase', () => {
  let updateUserPasswordUsecase: UpdateUserPasswordUsecase
  let userRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    userRepository = {
      updateUserPassword: jest.fn()
    } as unknown as jest.Mocked<IUserRepository>

    updateUserPasswordUsecase = new UpdateUserPasswordUsecase(userRepository)
  })

  it('should return ConflictError if actual password equals new password', async () => {
    const request = {
      userId: 'user-id',
      password: 'same-password',
      confirmPassword: 'same-password',
      newPassword: 'same-password'
    }

    const result = await updateUserPasswordUsecase.execute(request)

    expect(result).toEqual(
      new ConflictError('Actual password equals newPassword')
    )
    expect(userRepository.updateUserPassword).not.toHaveBeenCalled()
  })

  it('should return NotFoundError if user not found when updating password', async () => {
    const request = {
      userId: 'user-id',
      password: 'same-password',
      confirmPassword: 'same-password',
      newPassword: 'new-password'
    }

    jest.spyOn(Password, 'create').mockResolvedValueOnce({
      value: () => 'hashed-old-password'
    } as unknown as Password)

    userRepository.updateUserPassword.mockResolvedValueOnce(
      UserEnums.USER_NOT_FOUND
    )

    const result = await updateUserPasswordUsecase.execute(request)

    expect(Password.create).toHaveBeenCalledWith(request.password)
    expect(userRepository.updateUserPassword).toHaveBeenCalledWith(
      request.userId,
      'hashed-old-password'
    )
    expect(result).toEqual(new NotFoundError('User not found'))
  })

  it('should update password successfully and return success message', async () => {
    const request = {
      userId: 'user-id',
      password: 'same-password',
      confirmPassword: 'same-password',
      newPassword: 'new-password'
    }

    jest.spyOn(Password, 'create').mockResolvedValueOnce({
      value: () => 'hashed-old-password'
    } as unknown as Password)

    userRepository.updateUserPassword.mockResolvedValueOnce(UserEnums.SUCCESS)

    const result = await updateUserPasswordUsecase.execute(request)

    expect(Password.create).toHaveBeenCalledWith(request.password)
    expect(userRepository.updateUserPassword).toHaveBeenCalledWith(
      request.userId,
      'hashed-old-password'
    )
    expect(result).toEqual({ message: 'Password has updated' })
  })
})
