export interface ICreateDoctorSchedulePayload {
    schedule: string[]
}
export interface IUpdateDoctorSchedulePayload {
    scheduleIds: {
        shouldDelete: boolean;
        id: string
    }[]
} 