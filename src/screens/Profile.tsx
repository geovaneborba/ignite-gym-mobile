import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

const PHOTO_SIZE = 33

type FormDataProps = {
  name: string
  email: string
  old_password: string
  password: string
  password_confirm: string
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => (!!value ? value : null)),
  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref('password')], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => (!!value ? value : null)),
    }),
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { user, updateUserProfile } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const toast = useToast()

  const handleUserPhotoSelected = async () => {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()

        userPhotoUploadForm.append('avatar', photoFile)

        const { data } = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        const userUpdated = { ...user, avatar: data.avatar }
        await updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500',
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  const handleProfileUpdate = async (data: FormDataProps) => {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)
      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })
    } catch (error) {
      if (error instanceof AppError) {
        const title =
          error.message ??
          'Não foi possível atualizar os dados. Tente novamente mais tarde.'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 36,
        }}
      >
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded={'full'}
              startColor={'gray.500'}
              endColor={'gray.400'}
            />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelected}>
            <Text
              color={'green.500'}
              fontWeight={'bold'}
              fontSize={'md'}
              mt={'2'}
              mb={'8'}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Heading
            fontFamily={'heading'}
            color={'gray.200'}
            fontSize={'md'}
            mb={'2'}
            alignSelf={'flex-start'}
            mt={12}
          >
            Alterar senha
          </Heading>

          <Controller
            name="old_password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={
                  errors.old_password && errors.old_password.message
                }
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password && errors.password.message}
              />
            )}
          />

          <Controller
            name="password_confirm"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={
                  errors.password_confirm && errors.password_confirm.message
                }
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
