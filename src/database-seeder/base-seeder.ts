import { DeepPartial, Repository } from 'typeorm';

export abstract class BaseSeeder<TEntity> {
  constructor(private readonly repo: Repository<TEntity>) {}

  abstract generate(index: number): Promise<DeepPartial<TEntity>[]>;

  async createEntry(index: number = 0): Promise<TEntity[]> {
    const mock_entries = await this.generate(index);
    const db_entries = mock_entries.map((e) => this.repo.create(e));
    return await Promise.all(db_entries.map((entry) => this.repo.save(entry)));
  }

  async seed() {
    for (let i = 0; i < 100; i++) {
      await this.createEntry(i);
    }
  }
}
