export class SeedUtils {
  static randomIntFromInterval(min: number, max: number): number {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum);
    const randomIndex = this.randomIntFromInterval(0, enumValues.length - 1);
    const randomEnumValue = enumValues[randomIndex];
    return randomEnumValue;
  }
}
