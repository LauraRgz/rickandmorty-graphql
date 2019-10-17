import chalk from 'chalk'
import { fetchData } from './fetchdata';
import { GraphQLServer } from 'graphql-yoga'

// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

/**
 * Main App
 * @param data all rickyandmorty database
 */

const runApp = data => {

  const typeDefs = `
    type Query {
      character(id: Int!): Character!
      characters(page: Int, pageSize: Int, name: String, status: String, planet: String): [Character!]!
      planets: [String!]!
    }

    type Character {
      id: Int!
      name: String!
      status: String!
      planet: String!
    }
  `

  const resolvers = {

    Query: {
      character: (parent, args, ctx, info) => {

        const result = data.find(obj => obj.id === args.id)

        console.log(chalk.green(`---------------------------------------`))
        console.log(chalk.green(`REQUEST MADE TO 'character'`))
        console.log(`ID: ${args.id}`)
        console.log(chalk.green(`---------------------------------------`))

        return {
          id: result.id,
          name: result.name,
          status: result.status,
          planet: result.location.name
        }
      },
    
      characters: (parent, args, ctx, info) => {

        const page = args.page || 1;
        const pageSize = args.pageSize || 20;
        
        const init = (page-1)*pageSize;
        const end = init + pageSize;

        const filteredData = data.filter(elem => elem.name.includes(args.name || elem.name))
                                 .filter(elem => elem.status.includes(args.status || elem.status))
                                 .filter(elem => elem.location.name.includes(args.planet || elem.location.name))
                                 .slice(init, end)
                                 .map(obj => {
                                    return {
                                      id: obj.id,
                                      name: obj.name,
                                      status: obj.status,
                                      planet: obj.location.name
                                    }
                                 })

        console.log(chalk.yellow(`----------------------------------------`))
        console.log(chalk.yellow(`REQUEST MADE TO 'characters'`))
        console.log(`Page: ${page}`)
        console.log(`Page Size: ${pageSize}`)
        console.log(`Name: ${args.name}`)
        console.log(`Status: ${args.status}`)
        console.log(`Planet: ${args.planet}`)
        console.log(chalk.yellow(`----------------------------------------`))
                                                
        return filteredData;
      },

      planets: () => {

        const planetList = [] 
        data.forEach(elem => {
          planetList.push(elem.location.name);
        });

        console.log(chalk.blue(`----------------------------------------`))
        console.log(chalk.blue(`REQUEST MADE TO 'planets'`))
        console.log(chalk.blue(`----------------------------------------`))

        return [... new Set(planetList)];
      }

    }
  }

  const server = new GraphQLServer({typeDefs, resolvers})

  console.log(chalk.bgRed("\n----------------------------------------------------------"))
  console.log(chalk.bgRed("-------------------- SERVER LISTENING --------------------"))
  console.log(chalk.bgRed("----------------------------------------------------------\n"))

  server.start()
};

// main program
fetchData(runApp, url);