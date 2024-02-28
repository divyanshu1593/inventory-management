import { Body, Controller, Post } from '@nestjs/common';
import { ProductDto } from './dto/product-info.dto';
import { StandardResponse } from './type/res.type';
import { ManufacturingService } from './manufacturing.service';
import { ManufactureProductDto } from './dto/manufacture-product.dto';

@Controller('manufacturing')
export class ManufacturingController {
  constructor(private readonly manufacturingService: ManufacturingService) {}

  @Post('manufacture-product')
  async manufactureProduct(
    @Body() manufactureProductDto: ManufactureProductDto,
  ): Promise<StandardResponse<void>> {
    return {
      isError: false,
      message: '',
      data: await this.manufacturingService.manufactureProduct(
        manufactureProductDto,
      ),
    };
  }

  @Post('add-new-product')
  async addProduct(
    @Body() productInfo: ProductDto,
  ): Promise<StandardResponse<void>> {
    return {
      isError: false,
      message: '',
      data: await this.manufacturingService.addProduct(productInfo),
    };
  }
}
