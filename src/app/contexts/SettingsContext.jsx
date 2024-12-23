import { createContext, useState } from "react";
import merge from "lodash/merge";
// CUSTOM COMPONENT
import { MatxLayoutSettings } from "../Components/MatxLayout/settings";
// console.log(MatxLayoutSettings)
export const SettingsContext = createContext({
  settings: { ...MatxLayoutSettings },
  updateSettings: () => { }
});
// console.log(MatxLayoutSettings)
export default function SettingsProvider({ settings = MatxLayoutSettings, children }) {
  const [currentSettings, setCurrentSettings] = useState(settings);

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update);
    setCurrentSettings(marged);
  };

  // console.log(currentSettings)
  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, updateSettings: handleUpdateSettings, name: 'preet' }}>
      {children}
      {/* {console.log(currentSettings)} */}
    </SettingsContext.Provider>
  );
}
