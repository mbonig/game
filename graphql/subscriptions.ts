/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onGameStateChange = /* GraphQL */ `
  subscription OnGameStateChange($id: ID!) {
    onGameStateChange(id: $id) {
      id
      status
      gameStatus {
        status
        winner
      }
      thiefMoves
      players {
        name
        type
      }
      currentTurn {
        name
        type
      }
      map {
        links {
          source
          target
        }
        nodes {
          id
          type
        }
      }
    }
  }
`;
