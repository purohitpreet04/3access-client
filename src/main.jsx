import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { store, persistor } from './app/Redux/Store.js'
import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from './redux/store';
import SettingsProvider from '@app/contexts/SettingsContext.jsx';
import CustomSnackbar from '@app/CommonComponents/CustomSnackbar.jsx';




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <SettingsProvider>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        {/* <CustomSnackbar> */}
          <BrowserRouter >
            <App />
          </BrowserRouter>
        {/* </CustomSnackbar> */}
        {/* </PersistGate> */}
      </Provider>
    </SettingsProvider>

  </React.StrictMode>,
)
