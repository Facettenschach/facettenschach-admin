import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '../hooks/useApi'

export interface User {
  token: string
  type: string
  id: string
  username: string
  email: string
  roles: string[]
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password })
      const user: User = response.data
      
      if (!user.roles.includes('ADMIN')) {
        return rejectWithValue('Only admins can access this application')
      }

      localStorage.setItem('auth_token', user.token)
      localStorage.setItem('auth_user', JSON.stringify(user))
      return user
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await apiClient.post('/auth/logout')
  } catch (error) {
    console.error('Logout error:', error)
  }
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
})

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const stored = localStorage.getItem('auth_user')
  if (stored) {
    return JSON.parse(stored) as User
  }
  return null
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: any) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.user = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.error = null
      })
      .addCase(restoreSession.fulfilled, (state, action: any) => {
        if (action.payload) {
          state.user = action.payload
        }
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
