// you can change the port number at server/index.js
const api = "http://localhost:8000";

const API_KEY = "__api_key__";

const headers = {
    Accept: "application/json",
    Authorization: API_KEY
};

// create an account
const createAccount = async (params) =>
    await fetch(`${api}/create_user`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then(res => res.json());

export { createAccount }

// create an account
const updateAccount = async (params) =>
    await fetch(`${api}/update_user`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then(res => res.json());

export { updateAccount }

// signin
const signinWithPassword = async (params) =>
    await fetch(`${api}/login_with_email_password`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then(res => res.json());

export { signinWithPassword }

// get user list
const getUserList = async () =>
    await fetch(`${api}/get_user_list`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        }
    }).then(res => res.json());

export { getUserList }

// remove user from list
const removeUser = async (userID) => {
    let user = { userId: userID }
    await fetch(`${api}/remove_user`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(res => res.json());
}

export { removeUser }

// upload
export const upload = data =>
    fetch(`${api}/files`, {
        method: "POST",
        body: data
    }).then(res => res.json());

// signin with token
const signinWithToken = async (params) =>
    await fetch(`${api}/login_with_token`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then(res => res.json());

export { signinWithToken }

// logout
export const logout = params =>
    fetch(`${api}/logout`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    }).then(res => res.json());