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
        tickets {
          slow
          medium
          fast
          black
        }
      }
      currentTurn {
        name
        type
        tickets {
          slow
          medium
          fast
          black
        }
      }
      map {
        links {
          source
          target
        }
        nodes {
          id
          types
          x
          y
        }
      }
    }
  }
`;
