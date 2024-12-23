// import { MatxSuspense } from "../MatxSuspense";
import { MatxSuspense } from "../index";
import useSettings from "../../hooks/useSettings";
import { MatxLayouts } from "./index";
import { lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "@app/Redux/Sclice/AuthSclice";

const Layout1 = lazy(() => import("./Layout1/Layout1"))
const MatxLayout = (props) => {
  const { settings } = useSettings();
  // const { user, status, loading } = useSelector(state => state.auth)
  // const dispatch = useDispatch()
  
  
  
  const Layout = MatxLayouts[settings?.activeLayout];
  // console.log(settings)

  return (
    <MatxSuspense>
      <Layout {...props} />
      {/* <Layout1 {...props} /> */}
    </MatxSuspense>
  );
}
export default MatxLayout