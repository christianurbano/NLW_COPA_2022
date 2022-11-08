import { Heading, Text, VStack, useToast } from "native-base";
import {useState} from 'react'

import Logo from '../assets/logo.svg'

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function New(){
  const [title, setTitle] = useState('');
  const [ isLoading, setIsLoadgin] = useState(false);

  const toast =useToast()

  async function handlePoolsCreate(){
    if(!title.trim()){
      return toast.show({
        title: 'informe o nome para seu bolao',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    try{
      setIsLoadgin(true);
      
      await api.post('/pools', {title: title})
      toast.show({
        title: 'Bolao criado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      setTitle('');

    }catch(error) {
      console.log(error)
      toast.show({
        title: 'nao foi possivel criar seu bolao',
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally {
      setIsLoadgin(false);
    }
  }
  return(
    <VStack flex={1} bgColor='gray.900'>
      <Header title="Criar novo bolão"/>
      <VStack mt={8} mx={5} alignItems="center">
        <Logo/>
        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Crie seu próprio bolão da copa {'\n'}e compartilhe entre amigos!
        </Heading>
        <Input 
          mb={2}
          placeholder="Qual nome do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />

        <Button 
          title="CRIAR MEU BOLÃO"
          onPress={handlePoolsCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único 
          que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  )
}