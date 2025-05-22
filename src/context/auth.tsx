import { createContext, useContext, useState, useEffect } from "react"
import { apiService, localStorageService } from "../services"
import { UserRoleInfo } from "../types/UserRoleInfo"
import { API_URLS, TPATokenInput } from "../constants"
import { useRouter } from "next/router"
import { AxiosResponse } from "axios"

interface Props {
  children: React.ReactNode
}

interface AuthContextType {
  isAuthenticated: boolean
  user: UserRoleInfo | null
  loading: boolean
  playerId: number
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserRoleInfo | null>(null)
  const router = useRouter()
  const playerId = parseInt(router.query.playerId as string)
  const sk = router.query.sk as string | "0"
  const [loading, setLoading] = useState(true)

  const login = () => {
    throw new Error("login function not implemented")
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  useEffect(() => {
    async function setupTpaLogin() {
      try {
        const response: AxiosResponse =
          await apiService.common.postFormUrlEncoded(API_URLS.GetAccessToken, {
            username: TPATokenInput.user,
            password: TPATokenInput.secret,
            grant_type: "password",
          })
        localStorageService.trySetUserAuthInfo(response)
      } catch (error) {
      } finally {
      }
    }
    async function getUserDetails() {
      setLoading(true)
      await setupTpaLogin()
      //if we are missing the sk login variable then return
      if (!sk || sk === "") {
        setLoading(false)
        return
      }

      try {
        const response = await apiService.common.getByParams<UserRoleInfo>(
          API_URLS.GetUsersDetails,
          {
            aID: sk,
          }
        )
        if (
          response.accountEmail !== "" &&
          response.accountEmail !== undefined &&
          response.accountEmail !== null
        ) {
          setIsAuthenticated(true)
          setUser(response)
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
      setLoading(false)
    }
    getUserDetails()
  }, [sk])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        loading,
        logout,
        playerId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
