import { Body, Controller, Post } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { MachineInfoDto } from './dto/machine-info.req.dto';
import { RawMaterialInfoDto } from './dto/raw-material-info.req.dto';
import { RawMaterialImportDto } from './dto/raw-material-import.req.dto';
import { MachineImportDto } from './dto/machine-import.req.dto';
import { AllowRoles } from 'src/guards/roles.guard';
import { UserRole } from 'src/database/entities/user.roles';
import { AllowDept } from 'src/guards/department.guard';
import { CompanyDepartment } from 'src/database/entities/company-departments';

@Controller('procurement')
@AllowDept(CompanyDepartment.PROCUREMENT)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}
  @AllowRoles(UserRole.DEPARTMENT_HEAD)
  @Post('add-machine')
  async addMachine(@Body() machineInfoDto: MachineInfoDto) {
    return await this.procurementService.addNewMachine(machineInfoDto);
  }

  @AllowRoles(UserRole.MANAGER)
  @Post('import-machine')
  async importMachine(@Body() machineImportDto: MachineImportDto) {
    return await this.procurementService.importMachine(machineImportDto);
  }

  @AllowRoles(UserRole.MANAGER)
  @Post('import-raw-material')
  async importRawMaterial(@Body() rawMaterialImportDto: RawMaterialImportDto) {
    return await this.procurementService.importRawMaterial(
      rawMaterialImportDto,
    );
  }

  @AllowRoles(UserRole.DEPARTMENT_HEAD)
  @Post('add-raw-material')
  async addRawMaterial(@Body() rawMaterialInfoDto: RawMaterialInfoDto) {
    return await this.procurementService.createRawMaterialEntry(
      rawMaterialInfoDto,
    );
  }
}
