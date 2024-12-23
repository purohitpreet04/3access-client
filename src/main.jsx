import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { store, persistor } from './app/Redux/Store.js'
import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SettingsProvider from '@app/contexts/SettingsContext.jsx';

const queryClient = new QueryClient()



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <Provider store={store}>
          {/* <PersistGate loading={null} persistor={persistor}> */}
            <BrowserRouter >
              <App />
            </BrowserRouter>
          {/* </PersistGate> */}
        </Provider>
      </SettingsProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
