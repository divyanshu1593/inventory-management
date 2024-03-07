import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesDto } from './dto/create-sales.dto';
import { UUID } from 'crypto';
import { AllowDept } from 'src/guards/department.guard';
import { CompanyDepartment } from 'src/database/entities/company-departments';
import { AllowRoles } from 'src/guards/roles.guard';
import { UserRole } from 'src/database/entities/user.roles';

@AllowDept(CompanyDepartment.SALES)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @AllowRoles(UserRole.OPERATOR)
  @Post()
  createSales(@Body() createSalesDto: CreateSalesDto) {
    return this.salesService.createSale(createSalesDto);
  }

  @AllowRoles(UserRole.MANAGER)
  @Get()
  getSales() {
    return this.salesService.getSales();
  }

  @AllowRoles(UserRole.MANAGER)
  @Get('id/:id')
  getSaleById(@Param('id') productId: UUID) {
    return this.salesService.getSaleById(productId);
  }

  @AllowRoles(UserRole.MANAGER)
  @Get('totalcost/:totalCost')
  getSalesByTotalCost(@Param('totalCost') totalCost: number) {
    return this.salesService.getSalesByTotalCost(totalCost);
  }
}
