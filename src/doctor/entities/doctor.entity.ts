import { DoctorServiceStatus } from 'src/doctor-status/entities/doctor-service-status.entity';
import { User } from 'src/user/entities/user.entity';

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
    private readonly user?: User;
    private readonly serviceStatus?: DoctorServiceStatus;

    private constructor(
        userid: string,
        speciality?: string,
        biography?: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        user?: User,
        serviceStatus?: DoctorServiceStatus
    ) {
        this.id = id;
        this.userId = userid;
        this.speciality = speciality;
        this.biography = biography;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.serviceStatus = serviceStatus;
    }

    static create(
        userid: string,
        speciality?: string,
        biography?: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        user?: User,
        serviceStatus?: DoctorServiceStatus
    ) {

        return new Doctor(userid, speciality, biography, id, createdAt, updatedAt, user, serviceStatus);
    
    }

    updateData(updateData: UpdateDoctorData,){
        if (updateData.speciality !== undefined) {
            this.speciality = updateData.speciality;
        }

        if (updateData.biography !== undefined) {
            this.biography = updateData.biography;
        }
    }

    serviceIsActive(){
        return this.serviceStatus?.getActive();
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

    getUser(){
        return this.user;
    }

    getServiceStatus(){
        return this.serviceStatus;
    }
}
