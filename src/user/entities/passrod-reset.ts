export class PasswordReset {
    private readonly id: string
    private readonly email: string
    private code: string
    private expireAt: Date
    private attempts: number
    private verified: boolean

    private static CODE_EXPIRATION_MS: number = 15 * (60 * 1000);
    private static MAX_ATTEMPTS: number = 3;
    private static INITIAL_ATTEMPTS: number = 0;
    private static INITIAL_IS_VERIFIED: boolean = false;


    private constructor(email: string, code: string, expireAt: Date, attempts: number,verified: boolean, id?: string) {
        this.id = id
        this.email = email
        this.code = code
        this.expireAt = expireAt
        this.attempts = attempts
        this.verified = verified
    }

    public static create(email: string, code: string, id?: string,attempts?: number, expireAt?: Date, verified?: boolean): PasswordReset {
        if(id && code !== undefined && expireAt !== undefined && attempts !== undefined) {
            return new PasswordReset(email, code, expireAt, attempts, verified, id)
        }
        return new PasswordReset(email, code, new Date(new Date().getTime() + PasswordReset.CODE_EXPIRATION_MS), PasswordReset.INITIAL_ATTEMPTS, PasswordReset.INITIAL_IS_VERIFIED)
    }

    public validateCode(inputCode: string): boolean {

        if (this.expireAt < new Date()) {
            return false;
        }

        if (this.code === inputCode) {
            this.markAsVerified();
            return true;
        }

        this.incrementAttempts();
        return false;
    }

    public invalidate() {
        this.expireAt = new Date();
        this.verified = false;
    }

    public static generateCode(): string {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        return newCode;
    }
    
    public static formatForEmail(code: string): string {
        return `Tu código de verificación es: ${code}`;
    }

    private incrementAttempts() {
        if (this.attempts < PasswordReset.MAX_ATTEMPTS) {
            this.attempts += 1;
            return;
        }

        throw new Error('Exedio el numero de intentos permitidos');
    }

    private markAsVerified() {
        this.verified = true;
    }

    public getId(): string {
        return this.id
    }

    public getEmail(): string {
        return this.email
    }

    public getCode(): string {
        return this.code
    }

    public getExpireAt(): Date {
        return this.expireAt
    }

    public getAttempts(): number {
        return this.attempts
    }

    public getVerified(): boolean {
        return this.verified
    }

}