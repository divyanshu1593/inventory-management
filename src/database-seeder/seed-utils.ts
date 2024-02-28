import { Repository } from 'typeorm';

export class SeedUtils {
  static randomIntFromInterval(min: number, max: number): number {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static xProd = <T, U>(a: T[], b: U[]) =>
    a.reduce((acc, x) => acc.concat(b.map((y) => [x, y])), []) as [T, U][];

  static randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum);
    const randomIndex = this.randomIntFromInterval(0, enumValues.length - 1);
    const randomEnumValue = enumValues[randomIndex];
    return randomEnumValue;
  }

  static async getRandomEntriesFromRepo<TEntity>(
    repo: Repository<TEntity>,
    count: number,
  ) {
    const allEntries = await repo.find();
    const startOffset = this.randomIntFromInterval(
      0,
      allEntries.length - count,
    );

    return allEntries.slice(startOffset, startOffset + count);
  }

  static async getRandomEntryFromRepo<TEntity>(repo: Repository<TEntity>) {
    const allEntries = await repo.find();
    const randomIndex = this.randomIntFromInterval(0, allEntries.length - 1);

    return allEntries[randomIndex];
  }
}
