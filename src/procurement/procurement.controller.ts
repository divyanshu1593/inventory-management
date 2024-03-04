import { Body, Controller, Post } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { MachineInfoDto } from './dto/machine-info.req.dto';
import { RawMaterialInfoDto } from './dto/raw-material-info.req.dto';
import { RawMaterialImportDto } from './dto/raw-material-import.req.dto';
import { MachineImportDto } from './dto/machine-import.req.dto';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}
  // TODO: Guarded by Department Head
  @Post('add-machine')
  async addMachine(@Body() machineInfoDto: MachineInfoDto) {
    return await this.procurementService.addNewMachine(machineInfoDto);
  }

  // TODO: Guarded by Department Head
  @Post('import-machine')
  async importMachine(@Body() machineImportDto: MachineImportDto) {
    return await this.procurementService.importMachine(machineImportDto);
  }

  // TODO: guarded by Manager
  @Post('import-raw-material')
  async importRawMaterial(@Body() rawMaterialImportDto: RawMaterialImportDto) {
    return await this.procurementService.importRawMaterial(
      rawMaterialImportDto,
    );
  }

  // TODO: guarded by Department Head
  @Post('add-raw-material')
  async addRawMaterial(@Body() rawMaterialInfoDto: RawMaterialInfoDto) {
    return await this.procurementService.createRawMaterialEntry(
      rawMaterialInfoDto,
    );
  }
}
