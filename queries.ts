export const onGameStateChange = /* GraphQL */ `
  subscription OnGameStateChange($id: ID!) {
    onGameStateChange(id: $id) {
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
      }
      highlightedNodes {
        username
        targetNodeId
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
      }
      map {
        links {
          source
          target
        }
        nodes {
          id
          x
          y
          types
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
      }
      highlightedNodes {
        username
        targetNodeId
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
          players {
            name
            type
          }
        }
      }
    }
  }
`;
export const makeMove = /* GraphQL */ `
  mutation MakeMove($id: ID!, $myself: String!, $targetNodeId: String!, $ticket: String) {
    makeMove(id: $id, myself: $myself, targetNodeId: $targetNodeId, ticket: $ticket) {
      id
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
      }
      highlightedNodes {
        username
        targetNodeId
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
          players {
            name
            type
          }
        }
      }
    }
  }
`;

export const highlightNode = /* GraphQL */ `
  mutation HighlightNode($id: ID!, $myself: String!, $targetNodeId: String!) {
    highlightNode(id: $id, myself: $myself, targetNodeId: $targetNodeId) {
      id
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
      }
      highlightedNodes {
        username
        targetNodeId
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
          players {
            name
            type
          }
        }
      }
    }
  }
`;
