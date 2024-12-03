import Loadable from "./Components/Loadable"
import React, { lazy } from "react"
import { AddNewProperty, PropertyList, StaffList } from "./Components/Services"


export const ServicesRoutes = [
    {path:"/services/staff", element:<StaffList/>},
    {path:"/services/property", element:<PropertyList/>},
    {path:"/services/addproperty", element:<AddNewProperty/>}
]

