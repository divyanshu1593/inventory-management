import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachineInfoDto } from './dto/machine-info.req.dto';
import { Machine } from 'src/database/entities/machine.entity';
import { tryWith } from 'src/database/error-handling/error-handler.adapter';
import { SqliteForeignConstraint } from 'src/database/error-handling/handlers/foreign-key-constraint.handler';
import { SqliteUniqueConstraint } from 'src/database/error-handling/handlers/unique-constraint.handler';
import { RawMaterialInfoDto } from './dto/raw-material-info.req.dto';
import { RawMaterial } from 'src/database/entities/raw-material.entity';
import { RawMaterialImport } from 'src/database/entities/raw-material-import.entity';
import { RawMaterialImportDto } from './dto/raw-material-import.req.dto';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,

    @InjectRepository(RawMaterial)
    private readonly rawMaterialRepo: Repository<RawMaterial>,

    @InjectRepository(RawMaterialImport)
    private readonly rawMaterialImportRepo: Repository<RawMaterialImport>,
  ) {}

  async importNewMachine(machineInfoDto: MachineInfoDto) {
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

  async createRawMaterialEntry(rawMaterialInfoDto: RawMaterialInfoDto) {
    const createdMaterial = this.rawMaterialRepo.create(rawMaterialInfoDto);

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