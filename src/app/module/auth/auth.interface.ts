export interface IRegisterPatiendPayload {
    name: string,
    email: string,
    password: string
}

export interface ILoginPatient {
    email: string
    password: string
}
export interface IChangePassword {
    currentPassword: string,
    newPassword: string
}