/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGame = /* GraphQL */ `
  mutation CreateGame($myself: String!) {
    createGame(myself: $myself) {
      id
      status
      host
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
      highlightedNodes {
        username
        targetNodeId
      }
    }
  }
`;
export const startGame = /* GraphQL */ `
  mutation StartGame($id: ID!) {
    startGame(id: $id) {
      id
      status
      host
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
      highlightedNodes {
        username
        targetNodeId
      }
    }
  }
`;
export const joinGame = /* GraphQL */ `
  mutation JoinGame($id: ID!, $myself: String!) {
    joinGame(id: $id, myself: $myself) {
      id
      status
      host
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
      highlightedNodes {
        username
        targetNodeId
      }
    }
  }
`;
export const makeMove = /* GraphQL */ `
  mutation MakeMove(
    $id: ID!
    $myself: String!
    $targetNodeId: String!
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
      host
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
      highlightedNodes {
        username
        targetNodeId
      }
    }
  }
`;
export const highlightNode = /* GraphQL */ `
  mutation HighlightNode($id: ID!, $myself: String!, $targetNodeId: String) {
    highlightNode(id: $id, myself: $myself, targetNodeId: $targetNodeId) {
      id
      status
      host
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
      highlightedNodes {
        username
        targetNodeId
      }
    }
  }
`;
