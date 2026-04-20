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
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError('Correo o contraseña incorrectos')
      return
    }

    navigate('/')
  }

  return (
    <AuthLayout title="Bienvenido" subtitle="Ingresa a tu cuenta para continuar">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-4 w-full text-center">
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
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="mt-2">
          Iniciar sesión
        </Button>

        <div className="text-center">
          <Link to="/recuperar-password" className="text-sm text-purple-500 hover:text-purple-700 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="pt-4 border-t border-purple-100 text-center">
          <p className="text-sm text-purple-400">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-purple-600 font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
