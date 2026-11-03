import { Form } from 'react-bootstrap'

export default function FileField({ label = 'Imagen', onChange, accept = 'image/*', inputKey }) {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        key={inputKey}
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </Form.Group>
  )
}
