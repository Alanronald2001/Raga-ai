import { useParams } from 'react-router-dom'
import MFEFrame from '../components/layout/MFEFrame'
import { MFE_URLS } from '../config/mfe'

export default function PatientsEmbed() {
  const { id } = useParams()
  const src = id ? `${MFE_URLS.PATIENTS}/${id}` : `${MFE_URLS.PATIENTS}/`

  return <MFEFrame src={src} title="Patients" />
}
