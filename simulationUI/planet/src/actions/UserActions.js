export const LOGIN_WITH_EMAIL = 'LOGIN_WITH_EMAIL'
export const NEW_USER = "NEW_USER"
export const RESET_NEW_ACCOUNT = "RESET_NEW_ACCOUNT"
export const UPDATE_USER = "UPDATE_USER"

export function loginWithEmailRedux({ params }) {


    return {
        type: LOGIN_WITH_EMAIL,
        params
    }
}

export function newUser() {

    return {
        type: NEW_USER
    }
}

export function resetNewAccount() {

    return {
        type: RESET_NEW_ACCOUNT
    }
}

export function updateUserAccount({ params }) {

    return {
        type: UPDATE_USER,
        params
    }
}
