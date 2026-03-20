import { useParams } from 'react-router-dom'
import MFEFrame from '../components/layout/MFEFrame'

export default function PatientsEmbed() {
  const { id } = useParams()
  const src = id ? `http://localhost:5174/${id}` : 'http://localhost:5174/'

  return <MFEFrame src={src} title="Patients" />
}
