
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
export const authService = {
    registerPatient
}