import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()  /*coneção com o bd*/

async function main() {
  const user = await prisma.user.create({
    data: {      
      nome: 'john Doe',
      email: 'john.Doe@gmail.com',
      avatarUrl: 'https://github.com/diego3g.png'
    }
  })
  
  const pool = await prisma.pool.create({
    data:{
      title: 'example pool',
      code: 'BOL123',
      ownerId: user.id,
      participants:{
        create:{
          userId: user.id
        }
      }
      
    }
  })

  await prisma.game.create({
    data:{
      date: '2022-11-02T12:00:00.153Z',
      /*ir no spec elemento, console, digita new Date().toISOString() para buscar exatemnte o dia e a hora  */
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })
  await prisma.game.create({
    data:{
      date: '2022-11-03T12:00:00.153Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses:{
        create:{
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant:{
            connect:{
              userId_poolId:{
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    },
  })
}

main()