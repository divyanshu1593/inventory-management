import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesDto } from './dto/create-sales.dto';
import { UUID } from 'crypto';
import { AllowAllDept, AllowDept } from 'src/guards/department.guard';
import { CompanyDepartment } from 'src/database/entities/company-departments';
import { AllowAllRoles, AllowRoles } from 'src/guards/roles.guard';
import { UserRole } from 'src/database/entities/user.roles';

@AllowDept(CompanyDepartment.SALES)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @AllowRoles(UserRole.OPERATOR)
  @Post('create-sale')
  createSale(@Body() createSalesDto: CreateSalesDto) {
    return this.salesService.createSale(createSalesDto);
  }

  @AllowAllRoles()
  @AllowAllDept()
  @Get('get-sales')
  getSales() {
    return this.salesService.getSales();
  }

  @AllowAllRoles()
  @AllowAllDept()
  @Get('id/:id')
  getSaleById(@Param('id') productId: UUID) {
    return this.salesService.getSaleById(productId);
  }

  @AllowAllRoles()
  @AllowAllDept()
  @Get('totalcost/:totalCost')
  getSalesByTotalCost(@Param('totalCost') totalCost: number) {
    return this.salesService.getSalesByTotalCost(totalCost);
  }
}
