import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { MachineInfoDto } from './dto/machine-info.req.dto';
import { RawMaterialInfoDto } from './dto/raw-material-info.req.dto';
import { RawMaterialImportDto } from './dto/raw-material-import.req.dto';
import { MachineImportDto } from './dto/machine-import.req.dto';
import { AllowAllRoles, AllowRoles } from 'src/guards/roles.guard';
import { UserRole } from 'src/database/entities/user.roles';
import { AllowAllDept, AllowDept } from 'src/guards/department.guard';
import { CompanyDepartment } from 'src/database/entities/company-departments';

@Controller('procurement')
@AllowDept(CompanyDepartment.PROCUREMENT)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get('/machines')
  @AllowAllDept()
  @AllowAllRoles()
  async getMachines(@Query('q') q: string = '') {
    return await this.procurementService.getMachines(q);
  }

  @Get('/machine-imports')
  @AllowAllDept()
  @AllowAllRoles()
  async getAllMachineImports() {
    return await this.procurementService.getAllMachineImports();
  }

  @Get('/raw-materials')
  @AllowAllDept()
  @AllowAllRoles()
  async getRawMaterials(@Query('q') q: string = '') {
    return await this.procurementService.getRawMaterials(q);
  }

  @Get('/raw-material-imports')
  @AllowAllDept()
  @AllowAllRoles()
  async searchRawMaterialImports() {
    return await this.procurementService.getRawMaterialImports();
  }

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
