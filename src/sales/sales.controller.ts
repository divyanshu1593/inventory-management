import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesDto } from './dto/create-sales.dto';
import type { ProductSale } from 'src/database/entities/product-sale.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  createSales(@Body() createSalesDto: CreateSalesDto) {
    return this.salesService.createSale(createSalesDto);
  }

  @Get()
  getSales(): Promise<{ data: ProductSale[] }> {
    return this.salesService.getSales();
  }

  @Get('byId')
  getSalesById(
    @Query('productId') productId: string,
  ): Promise<{ data: ProductSale[] }> {
    return this.salesService.getSalesById(productId);
  }

  @Get('byTotalCost')
  getSalesByTotalCost(
    @Query('totalCost') totalCost: number,
  ): Promise<{ data: ProductSale[] }> {
    return this.salesService.getSalesByTotalCost(totalCost);
  }
}
