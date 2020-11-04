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
          fx
          fy
          x
          y
          players {
            name
            type
          }
          type
        }
      }
    }
  }
`;
export const makeMove = /* GraphQL */ `
  mutation MakeMove($id: ID!, $myself: String!, $targetNodeId: Int!) {
    makeMove(id: $id, myself: $myself, targetNodeId: $targetNodeId) {
      id
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
          players {
            name
            type
          }
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
          players {
            name
            type
          }
        }
      }
    }
  }
`;
