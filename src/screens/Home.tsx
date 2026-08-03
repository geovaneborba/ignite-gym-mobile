import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { Loading } from '@components/Loading'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { HStack, VStack, FlatList, Heading, Text, useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'

export function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState('antebraço')
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  const handleOpenExerciseDetail = (exerciseId: string) =>
    navigation.navigate('exercise', {
      exerciseId,
    })

  const fetchGroups = async () => {
    try {
      setIsLoading(true)

      const response = await api.get('/groups')

      setGroups(response.data)
    } catch (error) {
      if (error instanceof AppError) {
        const title =
          error.message ?? 'Não foi possível carregar os grupos musculares'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExercisesByGroup = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/bygroup/${groupSelected}`)

      setExercises(response.data)
    } catch (error) {
      if (error instanceof AppError) {
        const title = error.message ?? 'Não foi possível carregar os exercícios'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected])
  )

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: '8',
        }}
        my={'10'}
        maxHeight={10}
        minHeight={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent={'space-between'} mb={'5'}>
            <Heading color={'gray.200'} fontSize={'md'} fontFamily={'heading'}>
              Exercícios
            </Heading>

            <Text color={'gray.200'} fontSize={'sm'}>
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenExerciseDetail(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: '20',
            }}
          />
        </VStack>
      )}
    </VStack>
  )
}
