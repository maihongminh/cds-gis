export function createSeededRandom(seedValue: number) {
  let s = seedValue;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export class SeededRandomHelper {
  private rand: () => number;

  constructor(seed: number = 42) {
    this.rand = createSeededRandom(seed);
  }

  // Return a random number from 0 to 1
  next(): number {
    return this.rand();
  }

  // Return a number in the range [min, max) or [min, max] if integer
  range(min: number, max: number, isInteger: boolean = true): number {
    const r = this.rand() * (max - min) + min;
    return isInteger ? Math.floor(r) : r;
  }

  // Return a random element from the array
  element<T>(arr: T[]): T {
    const idx = Math.floor(this.rand() * arr.length);
    return arr[idx];
  }

  // Return several random elements from the array
  elements<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => this.rand() - 0.5);
    return shuffled.slice(0, count);
  }

  // Return random true/false based on a probability ratio
  boolean(trueChance: number = 0.5): boolean {
    return this.rand() < trueChance;
  }
}
