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
export const startGame = /* GraphQL */ `
  mutation StartGame($id: ID!) {
    startGame(id: $id) {
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
export const joinGame = /* GraphQL */ `
  mutation JoinGame($id: ID!, $myself: String!) {
    joinGame(id: $id, myself: $myself) {
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
export const makeMove = /* GraphQL */ `
  mutation MakeMove(
    $id: ID!
    $myself: String!
    $targetNodeId: Int!
    $ticket: String
  ) {
    makeMove(
      id: $id
      myself: $myself
      targetNodeId: $targetNodeId
      ticket: $ticket
    ) {
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
