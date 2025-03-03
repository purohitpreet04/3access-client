import React, { useEffect, lazy } from 'react';
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MatxTheme from './Components/MatxTheme/MatxTheme.jsx';
import MatxLayout from './Components/MatxLayout/MatxLayout.jsx';
import SettingsProvider from './contexts/SettingsContext.jsx';
import { fetchUserDetails } from './Redux/Sclice/AuthSclice.js';
import CustomSnackbar from './CommonComponents/CustomSnackbar.jsx';
import LoadingOverlay from './Components/LoadingOverlay.jsx';
import DynamicTitle from './CommonComponents/DynamicTitle.jsx';

import { AddNewProperty, AddRsl, AddTenants, AgentPermmision, Agents, ArchiveStaffList, Assessment, DeshboardCom, ExistingTenants, ListRsl, LoginScreen, NotFound, Notificaiton, OtpInput, OTPpage, PendingTenants, Profile, PropertyList, SettingEmails, SignOutTenants, StaffList, TenantDetails, Tenants } from './Components/Services/index.js';
import { ActivityLogs, DocumentCom, MatxLoading } from './Components/index.js';
import { allUsers } from './Utils/constant.js';


function App() {




  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticate, token } = useSelector((state) => state.auth);
  const { isloading } = useSelector((state) => state.utils);

  const PrivateRoute = ({ children }) => {

    return isAuthenticate ? <>{children}</> : <Navigate to="/auth/login" />;
  };




  // Fetch user details on app load
  useEffect(() => {
    dispatch(fetchUserDetails({ navigate }));
  }, []);


  useEffect(() => {
    if (document.visibilityState === "visible") {
      dispatch(fetchUserDetails({ navigate }));
    }
  }, [document.visibilityState])


  const authRoutes = [
    { path: '/', element: <Navigate to={isAuthenticate ? '/dashboard' : '/auth/login'} replace /> },
    { path: '/auth/login', element: !isAuthenticate ? <LoginScreen /> : <Navigate to='/dashboard' /> },
    { path: '/auth/verify-user/:id/:token', element: !isAuthenticate ? <OtpInput /> : <Navigate to='/dashboard' /> },
    { path: '/auth/verify-otp', element: !isAuthenticate ? <OTPpage /> : <Navigate to='/dashboard' /> },

  ];

  const appRoutes = [
    ...authRoutes,
    { path: '/', element: <Navigate to={isAuthenticate ? '/dashboard' : '/auth/login'} replace /> },
    {
      element: isAuthenticate ? <MatxLayout /> : <Navigate to="/auth/login" replace />,
      children: [
        { path: '/dashboard', element: <DeshboardCom /> },
        { path: '/services/staff', element: allUsers.includes(user?.role) ? <StaffList /> : <Navigate to="*" /> },
        { path: '/services/archive-staff', element: allUsers.includes(user?.role) ? <ArchiveStaffList /> : <Navigate to="*" /> },
        { path: '/services/property', element: allUsers.includes(user?.role) ? <PropertyList /> : <Navigate to="*" /> },
        { path: '/services/tenants', element: allUsers.includes(user?.role) ? <Tenants /> : <Navigate to="*" /> },
        { path: '/services/pending-tenants', element: allUsers.includes(user?.role) ? <PendingTenants /> : <Navigate to="*" /> },
        { path: '/services/existing-tenants', element: allUsers.includes(user?.role) ? <ExistingTenants /> : <Navigate to="*" /> },
        { path: '/services/sign-out-tenants', element: allUsers.includes(user?.role) ? <SignOutTenants /> : <Navigate to="*" /> },
        { path: '/services/addtenants', element: allUsers.includes(user?.role) ? <AddTenants /> : <Navigate to="*" /> },
        { path: '/services/addproperty', element: allUsers.includes(user?.role) ? <AddNewProperty /> : <Navigate to="*" /> },
        { path: '/services/tenetdetails', element: allUsers.includes(user?.role) ? <TenantDetails /> : <Navigate to="*" /> },
        { path: '/services/tenetdetails/assesment', element: allUsers.includes(user?.role) ? <Assessment /> : <Navigate to="*" /> },
        { path: '/services/settings', element: ['company', 'agent'].includes(user?.role) ? <SettingEmails /> : <Navigate to="*" /> },
        { path: '/services/notifications', element: ['company', 'agent'].includes(user?.role) ? <Notificaiton /> : <Navigate to="*" /> },
        { path: '/services/agents', element: ['agent'].includes(user?.role) ? <Agents /> : <Navigate to="*" /> },
        { path: '/services/agents/permission', element: ['agent'].includes(user?.role) ? <AgentPermmision /> : <Navigate to="*" /> },
        { path: '/services/listrsl', element: ['company', 'agent'].includes(user?.role) ? <ListRsl /> : <Navigate to="*" /> },
        { path: '/services/listrsl/add-new-rsl', element: ['company', 'agent'].includes(user?.role) ? <AddRsl /> : <Navigate to="*" /> },
        { path: '/logs', element: <ActivityLogs /> },
        { path: "/user/profile", element: <Profile /> },
      ],
    },

    { path: '/document', element: <DocumentCom /> },
    { path: '*', element: <NotFound /> },
  ];

  const content = useRoutes(appRoutes);
  // const content = useRoutes(!isAuthenticate ? authRoutes : appRoutes);

  return (
    <MatxTheme>
      <DynamicTitle />
      <LoadingOverlay loading={isloading}>
        <CustomSnackbar />
        {/* <PrivateRoute> */}
        {(!user?._id && isAuthenticate) ? <MatxLoading /> : content}
        {/* </PrivateRoute> */}
      </LoadingOverlay>
    </MatxTheme>
  );
}

export default App;
