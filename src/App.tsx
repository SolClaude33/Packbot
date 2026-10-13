import { LandingPage } from './LandingPage'
import { Workspace } from './Workspace'

export function App() {
  return window.location.pathname.startsWith('/workspace') ? <Workspace /> : <LandingPage />
}
