import { Suspense } from "react";
import { MatxLoading } from "./index";
// import MatxLoading  from "app/Component";

export default function MatxSuspense({ children }) {
  return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
}
