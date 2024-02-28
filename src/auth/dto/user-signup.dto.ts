import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { UserRole } from 'src/database/entities/user.roles';
import { IsNotEmptyString } from 'src/manufacturing/custom-decorators/is-not-empty-string.decorator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsNotEmptyString()
  address: string;

  @IsNotEmptyString()
  name: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
