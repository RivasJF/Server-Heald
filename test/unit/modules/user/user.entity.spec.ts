import { User } from '../../../../src/user/entities/user.entity';
import { Role } from '../../../../src/user/entities/user.enum';

describe('User Entity', () => {
  it('crea un usuario válido', () => {
    const user = User.create(
      'Jonatan',
      'jonatan@mail.com',
      '123456',
      Role.CLIENT
    );

    expect(user.getName()).toBe('Jonatan');
    expect(user.getEmail()).toBe('jonatan@mail.com');
    expect(user.getPassword()).toBe('123456');
    expect(user.getRole()).toBe(Role.CLIENT);
  });

  it('lanza error si el nombre es muy corto', () => {
    expect(() =>
      User.create('Jo', 'jo@mail.com', '123456', Role.CLIENT)
    ).toThrow('Name must be longer than 3 letters');
  });

  it('lanza error si el password es corto', () => {
    expect(() =>
      User.create('Jonatan', 'jonatan@mail.com', '123', Role.CLIENT)
    ).toThrow('Password must be at least 6 characters long');
  });

  it('deja opcionales como undefined si no se envían', () => {
    const user = User.create('Jonatan', 'jonatan@mail.com', '123456', Role.CLIENT);

    expect(user.getPhoneNumber()).toBeUndefined();
    expect(user.getBirthDate()).toBeUndefined();
    expect(user.getCreatedAt()).toBeUndefined();
    expect(user.getUpdatedAt()).toBeUndefined();
  });
});