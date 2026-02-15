
import { Status } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";

interface IRegisterPatiendPayload {
    name: string,
    email: string,
    password: string
}

const registerPatient = async (payload: IRegisterPatiendPayload) => {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({

        body: {
            name, email, password
        }
    })
    if (!data.user) {
        throw new Error("Failed To register patiend")
    }
    //TODO const patient = await prisma.$transaction(async (tx) => {
    //     await  tx.p
    //  })
    return data
}
interface ILoginPatient {
    email: string
    password: string
}
const loginPatient = async (payload: ILoginPatient) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email, password
        }
    })
    if (!data.user) {
        throw new Error("You are not Patient")
    }
    if (data.user.status === Status.BLOCKED) {
        throw new Error("Patient is Blooked")
    }
    if (data.user.isDeleted || data.user.status === Status.DELETED) {
        throw new Error("Patient is Deleted")
    }
    return data
}
export const authService = {
    registerPatient,
    loginPatient
}