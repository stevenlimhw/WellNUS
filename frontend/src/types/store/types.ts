import { UserDetails } from "../authentication/types"

export type StoreState = {
    user: {
        loggedIn: boolean,
        details: UserDetails | null,
    }
}

