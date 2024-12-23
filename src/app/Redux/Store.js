import { configureStore } from '@reduxjs/toolkit'
import Authreducer from '../Redux/Sclice/AuthSclice'
import SnackbarReducer from '../Redux/Sclice/SnaackBarSclice'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import manageStateSlice from './Sclice/manageStateSclice';
import multiselectSlice from './Sclice/MultiSelectSlice';
import TenantSclice from './Sclice/TenantSclice';
import PropertySclice from './PropertySclice';
import ActivitySclice from './Sclice/ActivitiLogSclice'

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, Authreducer);


export const store = configureStore({
  reducer: {
    auth: Authreducer,
    snack: SnackbarReducer,
    utils: manageStateSlice,
    sideselect: multiselectSlice,
    tenants: TenantSclice,
    property: PropertySclice,
    activitylog:ActivitySclice
  },
  devTools: import.meta.env?.VITE_MODE === 'dev'
})
export const persistor = persistStore(store);




// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import Authreducer from '../Redux/Sclice/AuthSclice';
// import SnackbarReducer from '../Redux/Sclice/SnaackBarSclice';
// import manageStateSlice from './Sclice/manageStateSclice';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// // Configure persist only for the Auth reducer
// const authPersistConfig = {
//   key: 'auth',
//   storage,
// };

// const rootReducer = combineReducers({
//   auth: persistReducer(authPersistConfig, Authreducer),
//   snack: SnackbarReducer,
//   utils: manageStateSlice,
//   sideselect:multiselectSlice
// });

// // Set up the store with the root reducer
// export const store = configureStore({
//   reducer: rootReducer,
//   devTools: import.meta.env?.VITE_MODE !== 'pro',
// });

// export const persistor = persistStore(store);
