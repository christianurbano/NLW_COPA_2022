import {useState, useEffect} from 'react'
import { Box, useToast, FlatList } from 'native-base';

import { api } from '../services/api'

import { GameProps, Game} from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoadgin] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');


  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoadgin(true)

      const response = await api.get(`/pools/${poolId}/ga,es`);
      setGames(response.data.games)
      
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

  async function handleGuessConfirm(gameId: string) {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
        return toast.show({
          title: 'informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`,{
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: 'palpite enviado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })
      fetchGames();
      
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'nao foi possivel cenviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
      
    }
  }
  useEffect(() => {
    fetchGames()
  },[poolId])

  if(isLoading){
    return <Loading/>
  }
  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={()=>handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{pb:10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  );
}
