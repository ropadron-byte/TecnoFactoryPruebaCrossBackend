export default function UserCard({ u }) {
  const rows = [
    ['Id', u.id],
    ['RUN', `${u.run}-${u.runDv}`],
    ['Correo', u.correo],
    ['Fecha de nacimiento', u.fechaNacimiento],
    ['Teléfono', u.telefono],
    ['Dirección', [u.direccion, u.comuna, u.region].filter(Boolean).join(', ')],
    ['Rol', u.tipoUsuario],
    ['Estado', u.activo ? 'Activo' : 'Inactivo'],
  ]
  return (
    <div className="bg-white border rounded p-4">
      <h2 className="mb-3">{u.nombre} {u.apellidos}</h2>
      <dl className="tf-dl row mb-0">
        {rows.map(([k, v]) => (
          <div className="col-sm-6" key={k}>
            <dt>{k}</dt>
            <dd>{v ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
