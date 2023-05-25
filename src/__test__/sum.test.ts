import {describe, expect, test} from '@jest/globals';
import {sum, mul} from '../sum';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

describe('mul module', () => {
  test('multiplies 2 * 4 to equal 8', () => {
    expect(mul(2, 4)).toBe(8);
  });
});