//Limipaiar user excliyendo password to login response
export function excludePassword<TUser extends { password?: string }>(user: TUser): Omit<TUser, 'password'> {
        const { password, ...result } = user;
        return result;
      }