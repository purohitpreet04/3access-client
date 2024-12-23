// export { default as Chatbox } from "./Chatbox";

import { lazy } from "react";
import Loadable from "./Loadable";

// export { default as ChatHead } from "./ChatHead";
export { default as MatxMenu } from "./MatxMenu";
// export { default as Breadcrumb } from "./Breadcrumb";
// export { default as ChatAvatar } from "./ChatAvatar";
// export { default as SimpleCard } from "./SimpleCard";
export { default as MatxLoading } from "./MatxLoading";
export { default as MatxSuspense } from "./MatxSuspense";
export { default as MatxSearchBox } from "./MatxSearchBox";
export { default as MatxTheme } from "./MatxTheme/MatxTheme";
// export { default as MatxProgressBar } from "./MatxProgressBar";
export { default as MatxLayout } from "./MatxLayout/MatxLayout";
// export { default as ConfirmationDialog } from "./ConfirmationDialog";
export { default as MatxVerticalNav } from "./MatxVerticalNav/MatxVerticalNav";

export const ActivityLogs = Loadable(lazy(() => import('./ActivityLog.jsx')))
export const DocumentCom = Loadable(lazy(() => import('./Tenant-pdfs/Document.jsx')))
