import { StatusCodes } from "../constants/constants";

export const successResponse = <T>(
    message: string,
    body?: T ,
    status = StatusCodes.SUCCESS
) => ({
    success: true,
    status,
    message,
    body: body ?? null,
});

export const errorResponse = (
    message: string,
    status = StatusCodes.INTERNAL_SERVER_ERROR
) => ({
    success: false,
    status,
    message,
    body: null,
});