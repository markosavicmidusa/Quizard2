import { useState, useEffect } from 'react';

export default function TicTacToe() {
    
    
    // Define the state for the Tic-Tac-Toe board and the current player
    const [board, setBoard] = useState<string[]>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState("")
    const [finished, setFinished] = useState(false)

    // Handle a click on a square
    const handleClick = (index: number) => {
        if (!board[index] && currentPlayer === 'X') {
            const newBoard = [...board];
            newBoard[index] = currentPlayer;
            setBoard(newBoard);
            setCurrentPlayer('O');
            makeCPUMove(newBoard);
        }
    };

    // Function to make a CPU move
    const makeCPUMove = (currentBoard: string[]) => {
        //console.log(currentBoard)
        const availableMoves = currentBoard.reduce<number[]>((acc, value, index) => {
            /*console.log("Acc:",acc)
            console.log("Value:",value)
            console.log("Index:",index)*/
            if (!value) acc.push(index);
            return acc;
        }, []);

        //console.log(currentBoard)
        //console.log(availableMoves)
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const newBoard = [...currentBoard];
        newBoard[availableMoves[randomIndex]] = 'O';
        setBoard(newBoard);
        setCurrentPlayer('X');
    };

    // Determine the winner
    useEffect(() => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(`Player ${board[a]} wins!`)
                setFinished(true)
                return;
            }
        }

        if (board.every(square => square !== null)) {
            setWinner('It\'s a draw!')
                setFinished(true)
        }
    }, [board]);

    // Render the Tic-Tac-Toe board
    const renderSquare = (index: number) => (
        <button
            className="w-16 h-16 border border-gray-400 flex justify-center items-center text-4xl font-bold"
            onClick={() => handleClick(index)}
            style={{ backgroundColor: board[index] === 'X' ? 'blue' : 'red' }}
            key={index}
        >
            {board[index]}
        </button>
    );

    const handlePlayAgain = () => {
        
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner("")
        setFinished(false)
    }

    return (
        <>
            {!finished ? 
            <div className="flex flex-col p-10 items-center justify-center w-full">
                <p className="text-xl font-bold text-center mb-4">Tic-Tac-Toe</p>
                <div className="board grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }, (_, index) => renderSquare(index))}
                </div>
            </div> : 
            <div className="mt-8">
                <p className={`text-lg font-bold ${winner === 'Player X wins!' ? 'text-green-500' : 'text-red-500'}`}>{winner}</p>
                <div className="mt-4">
                    <button onClick={handlePlayAgain} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Play Again
                    </button>
                </div>
            </div>}
        </>
    );
}
