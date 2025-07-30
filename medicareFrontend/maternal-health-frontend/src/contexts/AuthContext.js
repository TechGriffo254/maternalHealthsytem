import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        
        if (authService.isAuthenticated()) {
          // First try to get stored user data
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            dispatch({ 
              type: AUTH_ACTIONS.LOGIN_SUCCESS, 
              payload: storedUser 
            });
          } else {
            // Fallback to API call if no stored user data
            try {
              const userData = await authService.getCurrentUser();
              if (userData && userData.user) {
                dispatch({ 
                  type: AUTH_ACTIONS.LOGIN_SUCCESS, 
                  payload: userData.user 
                });
              } else {
                throw new Error('Invalid user data returned from server');
              }
            } catch (apiError) {
              console.error('Failed to get user data:', apiError);
              // Clear invalid token
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await authService.login(email, password);
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: response.user 
      });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message || 'Login failed' 
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await authService.register(userData);
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: response.user 
      });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message || 'Registration failed' 
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };
  
  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.updateProfile(userData);
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: response.data 
      });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message || 'Profile update failed' 
      });
      throw error;
    }
  };
  
  // Change password
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.changePassword(passwordData);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message || 'Password change failed' 
      });
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUserProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
