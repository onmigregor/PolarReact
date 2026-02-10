// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'
import toast from 'react-hot-toast'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/configs/axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Utils
import { formatUserData } from 'src/@core/utils/auth'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)

        // Optimistic Load: If we have userData, load it immediately to prevent flicker
        const storedUser = window.localStorage.getItem('userData')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setLoading(false)
        }

        await axios
          .get(authConfig.meEndpoint)
          .then(async response => {
            const user = response.data.data // Access the user object inside data wrapper

            // Map API data to frontend expectation
            const mappedUser = formatUserData(user)

            window.localStorage.setItem('userData', JSON.stringify(mappedUser))
            setLoading(false)
            setUser(mappedUser)
          })
          .catch(err => {
            console.error('AuthContext: InitAuth Error', err)
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const { token, user } = response.data.data

        // Map API data to frontend expectation
        const mappedUser = formatUserData(user)

        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, token)
          : null
        const returnUrl = router.query.returnUrl

        setUser(mappedUser)
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(mappedUser)) : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        const message = err.response?.data?.message || 'Login failed'
        toast.error(message)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    // Notify backend
    if (storedToken) {
        axios.post(authConfig.logoutEndpoint, {}, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }).catch(err => {
            console.error('AuthContext: Logout Error', err)
        })
    }

    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
