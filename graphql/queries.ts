/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const waitingRoom = /* GraphQL */ `
  query WaitingRoom {
    waitingRoom {
      id
      status
      gameStatus {
        status
        winner
      }
      thiefMoves {
        type
        nodeId
      }
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
          fx
          fy
          x
          y
          players {
            name
            type
          }
        }
      }
    }
  }
`;
