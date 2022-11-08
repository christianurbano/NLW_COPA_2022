import { HStack, useToast, VStack } from "native-base";
import { Share } from 'react-native'
import {useState, useEffect } from 'react'
import {useRoute} from '@react-navigation/native'

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolPros } from "../components/Poolcard"
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}
export function Details() {
  const [optionSelected, setOptionSelected] = useState<'seus palpites' | 'Rankimg do grupo'>('seus palpites')
  const [isLoading, setIsLoadgin] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);

  const toast = useToast();
  const route = useRoute();

  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setIsLoadgin(true)

    const response = await api.get(`/pools/${id}`);
    setPoolDetails(response.data.pool);
      
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'nao foi possivel carregar os detalhes do bolao',
        placement: 'top',
        bgColor: 'red.500'
      })
      
    }finally{
      setIsLoadgin(false)
    }
  }
  async function handleCodeShare() {
   await Share.share({
      message: poolDetails.code
    })
  }
  useEffect(() => {
    fetchPoolDetails();  
  }, [id])
  

  if(isLoading){
    return (<Loading/>)
  }

  return(
    <VStack flex={1} bgColor='gray.900' >
      <Header 
        title={poolDetails.title} 
        showBackButton 
        showShareButton
        onShare={handleCodeShare}
      /> 

      {
        poolDetails._count?.participants > 0 ? 
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails}/>
          <HStack bgColor="gray.800" p={1} rounded='sm' mb={5}>
            <Option 
              title="seus palpites" 
              isSelected={optionSelected === 'seus palpites'}
              onPress={() => setOptionSelected('seus palpites')}
              />
            <Option 
              title="Ranking do grupo" 
              isSelected={optionSelected === 'Rankimg do grupo'}
              onPress={() => setOptionSelected('Rankimg do grupo')}
            />

          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
        </VStack>
        : <EmptyMyPoolList code={poolDetails.code}/>
      }

    </VStack>
  );
}