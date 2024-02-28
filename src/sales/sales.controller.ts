import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesDto } from './dto/create-sales.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  createSales(@Body() createSalesDto: CreateSalesDto) {
    return this.salesService.createSale(createSalesDto);
  }

  @Get()
  getSales() {
    return this.salesService.getSales();
  }

  @Get('id/:id')
  getSalesById(@Param('id') productId) {
    return this.salesService.getSalesById(productId);
  }

  @Get('totalcost/:totalCost')
  getSalesByTotalCost(@Param('totalCost') totalCost) {
    return this.salesService.getSalesByTotalCost(totalCost);
  }
}
