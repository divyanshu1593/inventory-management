import './extension-functions';

describe(`Extension Functions`, () => {
  describe('First or Fail Array Extension', () => {
    it(`Should return first value when called`, () => {
      const value = [1].getFirstOrFail();
      expect(value).toBe(1);
    });

    it(`Should throw when array is empty`, () => {
      expect(async () => [].getFirstOrFail()).rejects.toThrow();
    });
  });
});
