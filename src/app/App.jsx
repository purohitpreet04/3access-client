import { useState, useEffect, lazy, useCallback } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate, useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MatxTheme from './Components/MatxTheme/MatxTheme.jsx'
import MatxLayout from "./Components/MatxLayout/MatxLayout.jsx";
import SettingsProvider from './contexts/SettingsContext.jsx';
import { fetchUserDetails, logout } from './Redux/Sclice/AuthSclice.js';
import { ServicesRoutes } from './ServicesRoutes.jsx';
// import DeshboardCom from './Components/Deshboard/DeshboardCom.jsx';
import CustomSnackbar from './CommonComponents/CustomSnackbar.jsx';
import LoadingOverlay from './Components/LoadingOverlay.jsx';
import Loadable from './Components/Loadable.jsx';
import API from 'Constance.js';
import { setData } from './Redux/Sclice/MultiSelectSlice.js';
import { showSnackbar } from './Redux/Sclice/SnaackBarSclice.js';
import { AddNewProperty, AddTenants, DeshboardCom, LoginScreen, NotFound, PropertyList, SettingEmails, StaffList, TenantDetails, Tenants } from './Components/Services/index.js';
import DynamicTitle from './CommonComponents/DynamicTitle.jsx';
import Document from './Components/Tenant-pdfs/Document.jsx';
// import { StaffList } from './Components/Services/StaffList.jsx';



function App() {
  const dispatch = useDispatch()
  const { user, isAuthenticate, token } = useSelector((state) => state.auth);
  const { isloading } = useSelector((state) => state.utils);





  const routes = [
    { path: '/', element: <Navigate to={isAuthenticate ? "/desh" : "/auth/login"} replace /> },
    {
      element: (isAuthenticate ? <MatxLayout /> : <Navigate to="/auth/login" replace />),
      children: [
        { path: "/services/staff", element: ["company", 'agent'].includes(user.role) ? <StaffList /> : <Navigate to="*" replace /> },
        { path: "/services/property", element: ["company", 'agent', 'staff', 'company-agent'].includes(user.role) ? <PropertyList /> : <Navigate to="*" replace /> },
        { path: "/services/tenants", element: ["company", 'agent', 'staff', 'company-agent'].includes(user.role) ? <Tenants /> : <Navigate to="*" replace /> },
        { path: "/services/addtenants", element: ["company", 'agent', 'staff', 'company-agent'].includes(user.role) ? <AddTenants /> : <Navigate to="*" replace /> },
        { path: "/services/addproperty", element: ["company", 'agent', 'staff', 'company-agent'].includes(user.role) ? <AddNewProperty /> : <Navigate to="*" replace /> },
        { path: "/services/tenetdetails", element: ["company", 'agent', 'staff', 'company-agent'].includes(user.role) ? <TenantDetails /> : <Navigate to="*" replace /> },
        { path: "/services/settings", element: ["company"].includes(user.role) ? <SettingEmails /> : <Navigate to="*" replace /> },
        { path: '/desh', element: isAuthenticate ? <DeshboardCom /> : <Navigate to="/auth/login" replace /> },
      ]
    },
    { path: '/document', element: <Document /> },
    { path: '*', element: <NotFound /> }
  ];

  const authRoutes = [
    { path: '/', element: <Navigate to={isAuthenticate ? "/desh" : "/auth/login"} replace /> },
    { path: '/auth/login', element: !isAuthenticate ? <LoginScreen /> : <Navigate to="/desh" /> },
  ]

  const content = useRoutes((!isAuthenticate && !user?._id) ? authRoutes : routes);
  return (
    <MatxTheme>
      <DynamicTitle />
      <LoadingOverlay loading={isloading}>
        <CustomSnackbar />
        {content}
      </LoadingOverlay>
    </MatxTheme>
  );
}

export default App;
