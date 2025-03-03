import { useState } from "react";

const ThreeDotMenuBtn = ({ menuItems, Children }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <></>
    )
}

export default ThreeDotMenuBtn;
