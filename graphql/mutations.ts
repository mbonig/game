/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGame = /* GraphQL */ `
  mutation CreateGame($myself: String!) {
    createGame(myself: $myself) {
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
          fx
          fy
          x
          y
        }
      }
    }
  }
`;
export const startGame = /* GraphQL */ `
  mutation StartGame($id: ID!) {
    startGame(id: $id) {
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
          fx
          fy
          x
          y
        }
      }
    }
  }
`;
export const joinGame = /* GraphQL */ `
  mutation JoinGame($id: ID!, $myself: String!) {
    joinGame(id: $id, myself: $myself) {
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
          fx
          fy
          x
          y
        }
      }
    }
  }
`;
export const makeMove = /* GraphQL */ `
  mutation MakeMove($id: ID!, $myself: String!, $targetNodeId: Int!) {
    makeMove(id: $id, myself: $myself, targetNodeId: $targetNodeId) {
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
          fx
          fy
          x
          y
        }
      }
    }
  }
`;
