import { DeepPartial, Repository } from 'typeorm';

export abstract class BaseSeeder<TEntity> {
  constructor(private readonly repo: Repository<TEntity>) {}

  abstract generate(index: number): DeepPartial<TEntity>;

  async seed() {
    for (let i = 0; i < 100; i++) {
      const mock_entry = this.generate(i);
      const db_entry = this.repo.create(mock_entry);
      await this.repo.save(db_entry);
    }
  }
}
