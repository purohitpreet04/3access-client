import { staffnavigations, usernavigations } from "@app/navigations";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const DynamicTitle = ({ title }) => {
    const location = useLocation();
    const { user } = useSelector(state => state.auth)
    const navigationArray = ['staff', 'company-agent'].includes(user.role) ? staffnavigations : usernavigations
    const currentNav = navigationArray.find((nav) => nav.path === location.pathname);
    const dynamicTitle = currentNav?.title
    useEffect(() => {
        document.title = (title || dynamicTitle) != ('' || undefined || null) ? `${title || dynamicTitle} - 3Access | Real Estate` : '3 Access | Real Estate'; // Update the document title
    }, [title, dynamicTitle]);

    return null;
};

export default DynamicTitle;
