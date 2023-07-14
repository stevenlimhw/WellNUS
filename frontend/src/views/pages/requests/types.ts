import { UserDetails } from "../../../types/authentication/types";

export type Applicant = {
    user: {
        email: string,
        faculty: string,
        first_name: string,
        last_name: string,
        gender: string,
        id: number,
        user_role: string
    }
} | null;

export type Booking = {
    approve_by: number,
    details: string,
    start_time: string,
    end_time: string,
    id: number,
    nickname: string,
    provider_id: number,
    recipient_id: number,
} | null;

export type BookingUser = {
    booking: Booking,
    user: UserDetails
} | null;