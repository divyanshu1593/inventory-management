import { Body, Controller, Post } from '@nestjs/common';
import { ProductDto } from './dto/product-info.dto';
import { ManufacturingService } from './manufacturing.service';
import { ManufactureProductDto } from './dto/manufacture-product.dto';
import { AllowRoles } from 'src/guards/roles.guard';
import { UserRole } from 'src/database/entities/user.roles';
import { AllowDept } from 'src/guards/department.guard';
import { CompanyDepartment } from 'src/database/entities/company-departments';

@AllowDept(CompanyDepartment.MANUFACTURING)
@Controller('manufacturing')
export class ManufacturingController {
  constructor(private readonly manufacturingService: ManufacturingService) {}

  @AllowRoles(UserRole.OPERATOR)
  @Post('manufacture-product')
  async manufactureProduct(
    @Body() manufactureProductDto: ManufactureProductDto,
  ) {
    return await this.manufacturingService.manufactureProduct(
      manufactureProductDto,
    );
  }

  @AllowRoles(UserRole.DEPARTMENT_HEAD)
  @Post('add-new-product')
  async addProduct(@Body() productInfo: ProductDto) {
    return await this.manufacturingService.addProduct(productInfo);
  }
}
