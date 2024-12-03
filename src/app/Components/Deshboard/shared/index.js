import Loadable from '@app/Components/Loadable.jsx'
import { lazy } from 'react'
export const PropertyList = Loadable(lazy(() => import('./PropertyList.jsx')))
export const StackCards = Loadable(lazy(() => import('./StatCards.jsx')))