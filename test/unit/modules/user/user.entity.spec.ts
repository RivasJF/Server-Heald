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

  describe('updateData', () => {
    it('actualiza nombre, email, password y phoneNumber', () => {
      const user = User.create(
        'Jonatan',
        'jonatan@mail.com',
        '123456',
        Role.CLIENT,
      );

      user.updateData({
        name: 'Jonathan Rivas',
        email: '  JONATHAN@MAIL.COM  ',
        password: 'abcdef',
        phoneNumber: '+57-300-000-0000',
      });

      expect(user.getName()).toBe('Jonathan Rivas');
      expect(user.getEmail()).toBe('jonathan@mail.com');
      expect(user.getPassword()).toBe('abcdef');
      expect(user.getPhoneNumber()).toBe('+57-300-000-0000');
    });

    it('lanza error si se intenta actualizar con nombre corto', () => {
      const user = User.create(
        'Jonatan',
        'jonatan@mail.com',
        '123456',
        Role.CLIENT,
      );

      expect(() => user.updateData({ name: 'Jo' })).toThrow(
        'Name must be longer than 3 letters',
      );
    });

    it('lanza error si se intenta actualizar con password corto', () => {
      const user = User.create(
        'Jonatan',
        'jonatan@mail.com',
        '123456',
        Role.CLIENT,
      );

      expect(() => user.updateData({ password: '123' })).toThrow(
        'Password must be at least 6 characters long',
      );
    });

    it('no modifica campos no enviados', () => {
      const user = User.create(
        'Jonatan',
        'jonatan@mail.com',
        '123456',
        Role.CLIENT,
        '3001112233',
      );

      user.updateData({ email: 'nuevo@mail.com' });

      expect(user.getName()).toBe('Jonatan');
      expect(user.getEmail()).toBe('nuevo@mail.com');
      expect(user.getPassword()).toBe('123456');
      expect(user.getPhoneNumber()).toBe('3001112233');
    });
  });
});