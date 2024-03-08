import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MachineInfoDto } from './dto/machine-info.req.dto';
import { Machine } from 'src/database/entities/machine.entity';
import { tryWith } from 'src/database/error-handling/error-handler.adapter';
import { SqliteForeignConstraint } from 'src/database/error-handling/handlers/foreign-key-constraint.handler';
import { SqliteUniqueConstraint } from 'src/database/error-handling/handlers/unique-constraint.handler';
import { RawMaterialInfoDto } from './dto/raw-material-info.req.dto';
import { RawMaterial } from 'src/database/entities/raw-material.entity';
import { RawMaterialImport } from 'src/database/entities/raw-material-import.entity';
import { RawMaterialImportDto } from './dto/raw-material-import.req.dto';
import { MachineImportDto } from './dto/machine-import.req.dto';
import { MachineImport } from 'src/database/entities/machine-import.entity';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,

    @InjectRepository(MachineImport)
    private readonly machineImportRepo: Repository<MachineImport>,

    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,

    @InjectRepository(RawMaterialImport)
    private readonly rawMaterialImportRepo: Repository<RawMaterialImport>,
  ) {}

  async getMachines(q: string) {
    return await this.machineRepo.find({
      relations: {
        consumes: true,
      },
      where: {
        name: Like(`%${q}%`),
      },
    });
  }

  async getRawMaterials(q: string) {
    return await this.rawMaterialRepo.find({
      where: {
        name: Like(`%${q}%`),
      },
    });
  }

  async getRawMaterialImports() {
    return await this.rawMaterialImportRepo.find({
      relations: { raw_material: true },
    });
  }

  async getAllMachineImports() {
    return await this.machineImportRepo.find({
      relations: {
        machine: true,
      },
    });
  }

  async addNewMachine(machineInfoDto: MachineInfoDto) {
    const createdMachine = this.machineRepo.create({
      name: machineInfoDto.name,
      consumes: machineInfoDto.consumes,
    });

    return tryWith(this.machineRepo.save(createdMachine))
      .onError(
        SqliteForeignConstraint,
        () =>
          new BadRequestException('Specified raw materials are not available'),
      )
      .onError(
        SqliteUniqueConstraint,
        () => new BadRequestException('Machine with that name Already Exists'),
      )
      .execute();
  }

  async importMachine(machineImportDto: MachineImportDto) {
    const { machine_id, ...rest } = machineImportDto;

    const created = this.machineImportRepo.create({
      ...rest,
      machine: { id: machine_id },
    });

    return tryWith(this.machineImportRepo.save(created))
      .onError(
        SqliteForeignConstraint,
        () => new BadRequestException('Machine does not exist'),
      )
      .execute();
  }

  async createRawMaterialEntry(rawMaterialInfoDto: RawMaterialInfoDto) {
    const createdMaterial = this.rawMaterialRepo.create({
      ...rawMaterialInfoDto,
      amount: 0,
    });

    return tryWith(this.rawMaterialRepo.save(createdMaterial))
      .onError(
        SqliteUniqueConstraint,
        () => new BadRequestException('Raw Material already exists'),
      )
      .execute();
  }

  async importRawMaterial(rawMaterialImportDto: RawMaterialImportDto) {
    const { raw_material_id, ...rest } = rawMaterialImportDto;
    const createdImportRecord = this.rawMaterialImportRepo.create({
      ...rest,
      raw_material: { id: raw_material_id },
    });
    return tryWith(this.rawMaterialImportRepo.save(createdImportRecord))
      .onError(
        SqliteForeignConstraint,
        () =>
          new BadRequestException('No such Raw material exists in database'),
      )
      .execute();
  }
}
