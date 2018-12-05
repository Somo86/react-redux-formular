import validations from './validations';

describe('test text lenght validators', () => {

  test('should not allow pass 4 characters', () => {
    const maxLength4 = validations.maxLength(4);
    expect(maxLength4('test1')).toBeFalsy();
  });

  test('should allow pass 4 characters', () => {
    const maxLength4 = validations.maxLength(4);
    expect(maxLength4('tes')).toBeTruthy();
  });

  test('should allow minimum of 4 characters', () => {
    const maxLength4 = validations.minLength(4);
    expect(maxLength4('test1')).toBeTruthy();
  });
});

describe('test text format', () => {

  test('should accept email format', () => {
    expect(validations.emailFormat('a.test@test.com')).toBeTruthy();
  });

  test('should not accept any other format', () => {
    expect(validations.emailFormat('testeo')).toBeFalsy();
  });
});
