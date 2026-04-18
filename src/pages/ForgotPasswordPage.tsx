import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/nueva-password`,
    })
    // Siempre mostrar éxito para no revelar si el correo existe
    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout title="Correo enviado" subtitle="Revisa tu bandeja de entrada">
        <div className="text-center flex flex-col gap-4">
          <div className="text-5xl">✉️</div>
          <p className="text-gray-600 text-sm">
            Si ese correo está registrado, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link to="/login" className="text-blue-600 text-sm font-medium hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recuperar contraseña" subtitle="Te enviamos un enlace a tu correo">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" loading={isSubmitting} className="mt-2">
          Enviar enlace
        </Button>
      </form>

      <div className="mt-5 pt-5 border-t border-gray-100 text-center">
        <Link to="/login" className="text-sm text-blue-600 hover:underline">
          ← Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  )
}
