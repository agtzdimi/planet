import { LOGIN_WITH_EMAIL, NEW_USER, RESET_NEW_ACCOUNT, UPDATE_USER } from '../actions/UserActions'

function user(state = {}, action) {

  switch (action.type) {

    case LOGIN_WITH_EMAIL:

      const { login_token, user } = action.params

      return {
        ...state,
        login_token: login_token,
        user: user,
      }

    case NEW_USER:

      return {
        ...state,
        newAccount: true
      }

    case RESET_NEW_ACCOUNT:

      return {
        ...state,
        newAccount: false
      }

    case UPDATE_USER:
      const userInfo = { ...action.params }

      return {
        ...state,
        userInfo: userInfo
      }


    default:
      return state
  }
}

export default user
