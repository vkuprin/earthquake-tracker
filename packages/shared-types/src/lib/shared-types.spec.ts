import { Earthquake } from './shared-types';

describe('shared-types', () => {
  it('should validate earthquake interface', () => {
    const earthquake: Earthquake = {
      id: '1',
      location: 'Test Location',
      magnitude: 5.5,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(earthquake).toBeDefined();
    expect(earthquake.id).toBe('1');
    expect(typeof earthquake.magnitude).toBe('number');
  });
});
