
export class Verification {
    private readonly id?: string;
    private readonly email: string;
    private code: string;
    private attempts: number;
    private resendAttempts: number;
    private lastResendAt: Date;
    private isVerified: boolean;
    private expiresAt: Date;

    private static MAX_ATTEMPTS: number = 3;
    private static MAX_RESEND_ATTEMPTS: number = 3;
    private static RESEND_COOLDOWN_MS: number = 30 * (60 * 1000);
    private static CODE_EXPIRATION_MS: number = 5 * (60 * 1000);
    private static INITIAL_ATTEMPTS: number = 0;
    private static INITIAL_RESEND_ATTEMPTS: number = 0;
    private static INITIAL_IS_VERIFIED: boolean = false;

    private constructor(
        email: string,
        code: string,
        attempts: number,
        resendAttempts: number,
        isVerified: boolean,
        expiresAt: Date,
        lastResendAt: Date,
        id?: string
    ) {
        this.id = id;
        this.email = email;
        this.code = code;
        this.attempts = attempts;
        this.resendAttempts = resendAttempts;
        this.lastResendAt = lastResendAt;
        this.isVerified = isVerified;
        this.expiresAt = expiresAt;
    }

    static create(
        email: string,
        code: string,
        id?: string,
        attempts?: number,
        resendAttempts?: number,
        isVerified?: boolean,
        expiresAt?: Date,
        lastResendAt?: Date
    ) {
        if (id && code !== undefined && attempts !== undefined && resendAttempts !== undefined && isVerified !== undefined && expiresAt !== undefined && lastResendAt !== undefined) {
            return new Verification(
                email,
                code,
                attempts,
                resendAttempts,
                isVerified,
                expiresAt,
                lastResendAt,
                id
            );
        }
        return new Verification(
            email,
            code,
            Verification.INITIAL_ATTEMPTS,
            Verification.INITIAL_RESEND_ATTEMPTS,
            Verification.INITIAL_IS_VERIFIED,
            new Date(new Date().getTime() + Verification.CODE_EXPIRATION_MS),
            new Date(),
            id
        );
    }

    public validateCode(inputCode: string): boolean {
        if (this.isVerified) {
            return true;
        }

        if (this.expiresAt < new Date()) {
            return false;
        }

        if (this.code === inputCode) {
            this.markAsVerified();
            return true;
        }

        this.incrementAttempts();
        return false;
    }

    public static generateCode(): string {
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        return newCode;
    }

    public generateNewCode(newCode: string) {
        const now = new Date();
        
        if (this.resendAttempts >= Verification.MAX_RESEND_ATTEMPTS) {
            const cooldownPassed = this.lastResendAt.getTime() + Verification.RESEND_COOLDOWN_MS <= now.getTime();
            
            if (!cooldownPassed) {
                throw new Error('Debe esperar antes de solicitar un nuevo código');
            }
            
            // Si el cooldown pasó, reiniciar intentos de reenvío
            this.resendAttempts = Verification.INITIAL_RESEND_ATTEMPTS;
        }

        this.code = newCode;
        this.increaseResendAttempts();
        this.addExpiration();
        this.lastResendAt = now;
    }

    
    addExpiration() {
        this.expiresAt = new Date(new Date().getTime() + Verification.CODE_EXPIRATION_MS);
    }

    incrementAttempts() {
        if (this.attempts < Verification.MAX_ATTEMPTS) {
            this.attempts += 1;
            return;
        }

        throw new Error('Exedio el numero de intentos permitidos');
    }

    increaseResendAttempts() {
        if (this.resendAttempts < Verification.MAX_RESEND_ATTEMPTS) {
            this.resendAttempts += 1;
            this.attempts = Verification.INITIAL_ATTEMPTS;
            return;
        }

        throw new Error('Exedio el numero de reenvios permitidos');
    }

    public static formatForEmail(code: string): string {
        return `Tu código de verificación es: ${code}`;
    }

    markAsVerified() {
        this.isVerified = true;
    }

    getId() {
        return this.id;
    }
    
    getEmail() {
        return this.email;
    }
    
    getCode() {
        return this.code;
    }
    getAttempts() {
        return this.attempts;
    }
    
    getResendAttempts() {
        return this.resendAttempts;
    }
    
    getLastResendAt() {
        return this.lastResendAt;
    }
    
    getIsVerified() {
        return this.isVerified;
    }
    
    getExpiresAt() {
        return this.expiresAt;
    }
}