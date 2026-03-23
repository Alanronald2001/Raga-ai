import MFEFrame from '../components/layout/MFEFrame'
import { MFE_URLS } from '../config/mfe'

export default function DashboardEmbed() {
  return <MFEFrame src={MFE_URLS.DASHBOARD} title="Dashboard" />
}
