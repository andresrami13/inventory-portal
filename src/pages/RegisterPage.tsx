import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const schema = z.object({
  full_name: z.string().min(2, 'Ingresa tu nombre completo'),
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('Este correo ya está registrado')
      } else {
        setServerError('Ocurrió un error. Intenta de nuevo.')
      }
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <AuthLayout title="¡Registro exitoso!" subtitle="Revisa tu correo para confirmar tu cuenta">
        <div className="text-center flex flex-col gap-4">
          <div className="text-5xl">📧</div>
          <p className="text-gray-600 text-sm">
            Te enviamos un correo de confirmación. Una vez que confirmes, podrás iniciar sesión.
          </p>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Ir al inicio de sesión
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Completa los datos para registrarte">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nombre completo"
          type="text"
          autoComplete="name"
          placeholder="Ana García"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="mt-2">
          Crear cuenta
        </Button>
      </form>

      <div className="mt-5 pt-5 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
