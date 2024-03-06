import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsStrongPassword,
  NotEquals,
} from 'class-validator';
import { CompanyDepartment } from 'src/database/entities/company-departments';
import { UserRole } from 'src/database/entities/user.roles';
import { IsNotEmptyString } from 'src/manufacturing/custom-decorators/is-not-empty-string.decorator';

export class UserSignupDto {
  @IsEmail()
  email: string;

  @IsNotEmptyString()
  address: string;

  @IsAlpha()
  @IsNotEmptyString()
  name: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  @NotEquals(UserRole.ADMIN)
  role: UserRole;

  @IsEnum(CompanyDepartment)
  department: CompanyDepartment;
}
