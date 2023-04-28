/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState } from "react"
import confetti from "canvas-confetti"


const TURNS = {
  X : 'x',
  O : 'o'
}

const Square = ({children, isSelected, updateBoard, index}) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () =>{
    updateBoard(index)
  }

  return(
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

const WINNER_COMBOS = [
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]


function App(){

  const [board, setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage
    ?JSON.parse(boardFromStorage)
    :Array(9).fill(null)
  })


  const [turn, setTurn] = useState(TURNS.X)
  const [winner, setWinner]= useState(null) //null no hay ganador, false es empate

  const checkWinner = (boardToCheck) =>{
    for(const combo of WINNER_COMBOS){
      const [a,b,c] = combo
      if(boardToCheck[a] && //
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c])
        {
          return boardToCheck[a]
        }
    }
    // alert('No hay ganador');
    return null; //Si no hay ganador
  }

  const updateBoard = (index) =>{
    //Se deja de actualizar si ya hay ganador o se lleno
    if(board[index] || winner)return
    //Actualizar tablero
    const newBoard = [...board]
    //Se puede hacer una copia profunda con structureClone
    //Pero no es necesario en este caso 
    newBoard[index] = turn

    setBoard(newBoard)

    const newTurn = turn === TURNS.X? TURNS.O: TURNS.X
    setTurn(newTurn)

    //Guardar Partida
    window.localStorage.setItem('board',JSON.stringify(newBoard))
    window.localStorage.setItem('turn', turn)

    //Obtener ganador
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      confetti();
      setWinner((prevWinner)=>{
        return newWinner
      })
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  const resetGame =() =>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const checkEndGame =(newBoard) =>{
    return newBoard.every((square)=> square !== null)
  }


  return (
    <main className="board">
      <h1> Tic tac toe </h1>
      <section className="game">
        {
          board.map((square, index)=>{
            return(
              <Square
              key={index}
              index={index}
              updateBoard={updateBoard}

              >
                {square}
              </Square>
            )
          })
        }
      </section>

        <section className="turn">
           <Square isSelected={turn === TURNS.X}>
            {TURNS.X}
           </Square>

           <Square isSelected={turn === TURNS.O}>
            {TURNS.O}
           </Square>
        </section>
        <button onClick={resetGame}>
            Reiniciar partida
           </button>
        
        {
          winner !== null && (
            <section className="winner">
              <div className="text">
                <h2>
                  {
                    winner == false
                    ?'Empate'
                    :'Ganó'
                  }  
                </h2>

                  <header className="win">
                    {
                      winner && <Square>{winner}</Square>
                    }
                  </header>
                    <footer>
                      <button onClick={resetGame}>Nueva partida</button>
                    </footer>
              </div>
            </section>
          ) 
        }

    </main>
  )
}

export default App