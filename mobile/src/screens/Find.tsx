import {useState} from 'react'
import { Heading, Text, useToast, VStack } from "native-base";
import {useNavigation} from '@react-navigation/native'

import { api } from '../services/api';

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function Find(){
  const [isLoading, setIsLoadgin] = useState(false);
  const [code, setCode] = useState('');

  const toast = useToast();

  const {navigate} = useNavigation();

  async function handleJoinPool() {
    try{
      setIsLoadgin(true)
      
      if(!code.trim()){
        return toast.show({
          title: 'informe o codigo',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/pools/join', { code });

      toast.show({
        title: 'voce entrou no bolao com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      });

      navigate('pools');

    }catch (error) {
      console.log(error)
      setIsLoadgin(false)

      if(error.response?.data?.message === 'pool not found.'){
        return toast.show({
          title: 'Bolao nao encontrado',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      if(error.response?.data?.message === 'you already joined this pool.'){
        return toast.show({
          title: 'voce ja esta nesse bolao',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      toast.show({
        title: 'nao foi possivel encontrar o bolao',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }
  return(
    <VStack flex={1} bgColor='gray.900' >
      <Header title="Buscar por codigo" showBackButton/>
      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão atraves de {'\n'}seu codigo unico
        </Heading>
        <Input 
          mb={2}
          placeholder="Qual o codigo do bolão?"
          onChangeText={setCode}
          autoCapitalize="characters"
        />

        <Button 
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
        
      </VStack>
    </VStack>
  )
}