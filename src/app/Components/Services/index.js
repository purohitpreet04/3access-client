import Loadable from "../Loadable";
import { lazy } from "react";

export const LoginScreen = Loadable(lazy(() => import("../Auth/LoginScreen.jsx")))
export const NotFound = Loadable(lazy(() => import("../NotFound.jsx")))
export const DeshboardCom = Loadable(lazy(() => import("../Deshboard/DeshboardCom.jsx")))
// const StaffList = Loadable(lazy(() => import("./Components/Services/Staff/StaffList.jsx")))


export const StaffList = Loadable(lazy(() => import("./Staff/StaffList.jsx")))
export const PropertyList = Loadable(lazy(() => import("./Property/PropertyList.jsx")))
export const AddNewProperty = Loadable(lazy(() => import("./Property/AddProperty.jsx")))
export const Tenants = Loadable(lazy(() => import("./Tenants/Tenants.jsx")))
export const AddTenants = Loadable(lazy(() => import("./Tenants/AddTenants.jsx")))
export const Assessment = Loadable(lazy(() => import("./Tenants/Assessment.jsx")))
export const TenantDetails = Loadable(lazy(() => import("./Tenants/TenantDetails.jsx")))
export const SettingEmails = Loadable(lazy(() => import("./Settings/Email.jsx")))