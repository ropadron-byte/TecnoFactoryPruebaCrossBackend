import { usuariosApi } from '../api/services'
import { useFetch } from '../hooks/useFetch'
import { ErrorBox, Loading } from '../components/Status'
import UserCard from '../components/UserCard'

export default function Profile() {
  const { data, error, loading, reload } = useFetch(() => usuariosApi.me(), [])
  return (
    <div className="tf-form">
      <h1 className="mb-4">Mi perfil</h1>
      {loading && <Loading />}
      <ErrorBox error={error} onRetry={reload} />
      {data && <UserCard u={data} />}
    </div>
  )
}
