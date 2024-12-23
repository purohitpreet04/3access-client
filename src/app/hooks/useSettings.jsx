import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

const useSettings = () => useContext(SettingsContext);
// console.log(useSettings)
export default useSettings;
