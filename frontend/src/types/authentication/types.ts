export type Field = {
    id: string;
    type: string;
    label: string;
    placeholder: string;
    notes: string;
    choices?: string[];
}

export type UserDetails = {
    id?: number;
    first_name: string;
    last_name: string;
    gender: string;
    faculty: string;
    email: string;
    password?: string;
    passwordConfirmation?: string; 
    user_role: string;
}