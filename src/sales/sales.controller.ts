import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesDto } from './dto/create-sales.dto';
import type { CreateProductDto } from './dto/create-product.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  createSales(@Body() createSalesDto: CreateSalesDto) {
    return this.salesService.createSales(createSalesDto);
  }

  @Post('addProduct')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.salesService.craeteProduct(createProductDto);
  }
  @Get()
  getSalesRecords() {
    return 'Hello world';
  }
}
