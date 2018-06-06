import * as sessionService from '../services/sessionService'
import * as currentUserService from '../services/currentUserService'
export const login = ({ email, password, rememberMe }) => async dispatch => {
  try {
    const sessionResult = await sessionService.login({ email, password })
    const account = sessionService.getCurrentAccountFromLocalStorage()
    if (sessionResult.data.success) {
      sessionService.setAccessToken(sessionResult.data.data)
      const currentUserResult = await currentUserService.getCurrentUser()
      const currentAccountResult = await currentUserService.getCurrentUserAccount()
      if (!account) sessionService.setCurrentAccount(currentAccountResult.data.data)
      dispatch({
        type: 'LOGIN/SUCCESS',
        currentUser: currentUserResult.data.data,
        currentAccount: currentAccountResult.data.data
      })
    } else {
      dispatch({ type: 'LOGIN/FAILED' })
    }
    return sessionResult
  } catch (error) {
    console.log(error)
    dispatch({ type: 'LOGIN/FAILED' })
  }
}

export const resetPassword = ({ email, redirectUrl }) => async dispatch => {
  try {
    const result = await sessionService.resetPassword({
      email,
      redirectUrl: `${redirectUrl}?token={token}&email={email}`
    })
    if (result.data.success) {
      dispatch({ type: 'RESET_PASSWORD/SUCCESS' })
    } else {
      dispatch({ type: 'RESET_PASSWORD/FAILED' })
    }
    return result
  } catch (error) {
    console.log(error)
    dispatch({ type: 'RESET_PASSWORD/FAILED' })
  }
}
