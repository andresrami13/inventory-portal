import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const schema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    const { error } = await supabase.auth.updateUser({ password: data.password })

    if (error) {
      setServerError('No se pudo actualizar la contraseña. El enlace puede haber expirado.')
      return
    }

    navigate('/')
  }

  return (
    <AuthLayout title="Nueva contraseña" subtitle="Elige una contraseña segura">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nueva contraseña"
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
          Guardar nueva contraseña
        </Button>
      </form>
    </AuthLayout>
  )
}
