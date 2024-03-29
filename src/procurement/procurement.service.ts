import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
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
import { UUID } from 'crypto';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

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
        makes: true,
      },
      where: {
        name: Like(`%${q}%`),
      },
    });
  }

  async getRawMaterials(q: string, machine: UUID | undefined) {
    return await this.rawMaterialRepo.find({
      where: {
        consumed_by: {
          id: machine,
        },
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
      count: 0,
      makes: {
        id: machineInfoDto.makes,
      },
    });

    return await tryWith(this.machineRepo.save(createdMachine))
      .onError(
        SqliteForeignConstraint,
        () =>
          new BadRequestException(
            'Specified product or raw-material is not available',
          ),
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

    await this.dataSource.transaction(async (entityManager) => {
      await tryWith(entityManager.getRepository(MachineImport).save(created))
        .onError(
          SqliteForeignConstraint,
          () => new BadRequestException('Machine does not exist'),
        )
        .execute();

      await entityManager
        .createQueryBuilder()
        .update(Machine)
        .whereInIds(machine_id)
        .set({ count: () => 'count + :x' })
        .setParameter('x', rest.count)
        .execute();
    });

    return 'Machine Imported Successfully';
  }

  async createRawMaterialEntry(rawMaterialInfoDto: RawMaterialInfoDto) {
    const createdMaterial = this.rawMaterialRepo.create({
      ...rawMaterialInfoDto,
      amount: 0,
    });

    return await tryWith(this.rawMaterialRepo.save(createdMaterial))
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

    await this.dataSource.transaction(async (entityManager) => {
      await tryWith(this.rawMaterialImportRepo.save(createdImportRecord))
        .onError(
          SqliteForeignConstraint,
          () =>
            new BadRequestException('No such Raw material exists in database'),
        )
        .execute();

      await entityManager
        .createQueryBuilder()
        .update(RawMaterial)
        .whereInIds(raw_material_id)
        .set({ amount: () => 'amount + :x' })
        .setParameter('x', rest.count)
        .execute();
    });

    return 'Raw Material Imported Succesfully';
  }
}
