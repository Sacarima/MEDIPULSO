import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import doctorSignupReducer from './doctor/doctorSignupSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import themeReducer from './theme/themeSlice'

// Combine all reducers
const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
    doctorSignup: doctorSignupReducer,
  })


// Create a persist configuration
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
  }

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create a store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
})


export const persistor = persistStore(store)