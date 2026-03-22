
export class Doctor {
    private id?: string;
    private userId: string;
    private speciality?: string;
    private biography?: string ;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(userid: string, speciality?: string, biography?: string, id?: string, createdAt?: Date, updatedAt?: Date){
        this.id = id;
        this.userId = userid
        this.speciality = speciality
        this.biography = biography
        this.createdAt = createdAt
        this.updatedAt = updatedAt
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
