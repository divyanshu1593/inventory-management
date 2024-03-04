import { Body, Controller, Post } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { MachineInfoDto } from './dto/machine-info.req.dto';
import { RawMaterialInfoDto } from './dto/raw-material-info.req.dto';
import { RawMaterialImportDto } from './dto/raw-material-import.req.dto';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}
  // TODO: Guarded by Department Head
  @Post('add-machine')
  async importMachine(@Body() machineInfoDto: MachineInfoDto) {
    return await this.procurementService.importNewMachine(machineInfoDto);
  }

  // TODO: guarded by Manager
  @Post('import-raw-material')
  async importRawMaterial(@Body() rawMaterialImportDto: RawMaterialImportDto) {
    return await this.procurementService.importRawMaterial(
      rawMaterialImportDto,
    );
  }

  // TODO: guarded by Department Head
  @Post('create-raw-material')
  async createRawMaterial(@Body() rawMaterialInfoDto: RawMaterialInfoDto) {
    return await this.procurementService.createRawMaterialEntry(
      rawMaterialInfoDto,
    );
  }
}