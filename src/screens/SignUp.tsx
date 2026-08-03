import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@services/api'
import axios from 'axios'
import { Alert } from 'react-native'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'
import { useState } from 'react'

type FormDataProps = yup.InferType<typeof signUpSchema>

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })
  const { signIn } = useAuth()
  const navigation = useNavigation()
  const toast = useToast()

  const handleGoBack = () => navigation.goBack()

  const handleSignUp = async ({ name, email, password }: FormDataProps) => {
    try {
      setIsLoading(true)
      await api.post('/users', { name, email, password })
      await signIn(email, password)
    } catch (error) {
      setIsLoading(false)

      if (error instanceof AppError) {
        const title =
          error.message ??
          'Não foi possível criar a conta. Tente novamente mais tarde.'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position={'absolute'}
        />

        <Center my={24}>
          <LogoSvg />
          <Text color={'gray.100'} fontSize={'sm'}>
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading
            color={'gray.100'}
            fontSize={'xl'}
            mb={'6'}
            fontFamily={'heading'}
          >
            Crie a sua conta
          </Heading>

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                placeholder="Nome"
                onChangeText={onChange}
                errorMessage={errors.name && errors.name.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email && errors.email.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password && errors.password.message}
              />
            )}
          />

          <Controller
            name="password_confirm"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                placeholder="Confirme a senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={
                  errors.password_confirm && errors.password_confirm.message
                }
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant={'outline'}
          mt={12}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  )
}
