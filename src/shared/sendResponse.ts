import { Response } from "express"

interface IResponseData<T> {
    httpStatusCode: number
    success: boolean
    message: string
    data?: T
}
export const sendResposne = <T>(res: Response, responseData: IResponseData<T>) => {
    const { httpStatusCode, message, success, data } = responseData;
    res.status(httpStatusCode).json({
        success,
        message,
        data
    })
}