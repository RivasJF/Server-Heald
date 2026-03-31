
export type UpdateDoctorData = {
    speciality?: string;
    biography?: string;
};

export class Doctor {
    private readonly id?: string;
    private readonly userId: string;
    private speciality?: string;
    private biography?: string ;
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    private constructor(userid: string, speciality?: string, biography?: string, id?: string, createdAt?: Date, updatedAt?: Date){
        this.id = id;
        this.userId = userid
        this.speciality = speciality
        this.biography = biography
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    static create(userid: string, speciality?: string, biography?: string, id?: string, createdAt?: Date, updatedAt?: Date) {
        if (!userid || userid.trim().length === 0) {
            throw new Error('User id is required');
        }

        return new Doctor(userid, speciality, biography, id, createdAt, updatedAt);
    }

        updateData(data: UpdateDoctorData) {
        if (data.speciality !== undefined) {
            this.speciality = data.speciality;
        }

        if (data.biography !== undefined) {
            this.biography = data.biography;
        }
    }

    getId(){
        return this.id;
    }

    getUserId(){
        return this.userId;
    }

    getSpeciality(){
        return this.speciality;
    }

    getBiography(){
        return this.biography;
    }

    getCreatedAt(){
        return this.createdAt;
    }

    getUpdatedAt(){
        return this.updatedAt;
    }

}
