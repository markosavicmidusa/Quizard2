"use client"

import { useState, useEffect } from 'react';

const wordCollection = [
    'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'PEACH',
    'KIWI', 'LEMON', 'MELON', 'PEAR', 'PLUM',
    'CHERRY', 'APRICOT', 'FIG', 'LIME', 'MANGO',
    'PINEAPPLE', 'BLUEBERRY', 'RASPBERRY', 'STRAWBERRY', 'BLACKBERRY',
    'COCONUT', 'PAPAYA', 'PEANUT', 'WATERMELON', 'NECTARINE',
    'APRICOT', 'AVOCADO', 'CANTALOUPE', 'CRANBERRY', 'DATE',
    'ELDERBERRY', 'GOOSEBERRY', 'GUAVA', 'HONEYDEW', 'JACKFRUIT',
    'KUMQUAT', 'LYCHEE', 'PASSIONFRUIT', 'PERSIMMON', 'POMEGRANATE',
    'QUINCE', 'STARFRUIT', 'TANGERINE', 'BOYSENBERRY', 'RHUBARB',
    'MULBERRY', 'TAMARIND', 'SOURSOP', 'DRAGONFRUIT', 'ACAI',
    'LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'ZEBRA',
    'MONKEY', 'GORILLA', 'HIPPO', 'RHINO', 'KANGAROO',
    'CHEETAH', 'LEOPARD', 'CROCODILE', 'ALLIGATOR', 'SNAKE',
    'LIZARD', 'TURTLE', 'FROG', 'TOAD', 'SALAMANDER',
    'FISH', 'SHARK', 'WHALE', 'DOLPHIN', 'OCTOPUS',
    'PENGUIN', 'BEAR', 'WOLF', 'FOX', 'DEER',
    'HORSE', 'DOG', 'CAT', 'RABBIT', 'HAMSTER',
    'BIRD', 'EAGLE', 'OWL', 'HAWK', 'SPARROW',
    'SOCCER', 'BASKETBALL', 'FOOTBALL', 'TENNIS', 'VOLLEYBALL',
    'GOLF', 'SWIMMING', 'CYCLING', 'RUNNING', 'BOXING',
    'HIKING', 'SKATING', 'SKIING', 'SURFING', 'WRESTLING'
  ];

  const letterCollection = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];
  
  



export default function Hangman() {
  const [selectedWord, setSelectedWord] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [lettersPicked, setLettersPicked] = useState(new Set());
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState("")

  useEffect(() => {
    // Select a random word when the component mounts
    const randomIndex = Math.floor(Math.random() * wordCollection.length);
    setSelectedWord(wordCollection[randomIndex]);
  }, []);

  useEffect(() => {
    // Initialize the display word with underscores
    setDisplayWord('_'.repeat(selectedWord.length));
  }, [selectedWord]);

  const handleLetterPick = (letter: string) => {
    /*console.log(letter);
    console.log(selectedWord);
    console.log(displayWord);
    console.log(lettersPicked);
    console.log(attemptsRemaining);
*/
    // First, update the attempts remaining
    let newAttemptsRemaining = attemptsRemaining;
    if (attemptsRemaining > 0 && !finished) {
        const newLettersPicked = new Set(lettersPicked);
        newLettersPicked.add(letter);
        setLettersPicked(newLettersPicked);

        if (selectedWord.includes(letter)) {
            const newDisplayWord = selectedWord
                .split('')
                .map((char, index) => (char === letter ? letter : displayWord[index]))
                .join('');
            setDisplayWord(newDisplayWord);
        } else {
            //console.log("Attempts");
            newAttemptsRemaining -= 1;
            //console.log("newAttemptsRemaining", newAttemptsRemaining);
            setAttemptsRemaining(newAttemptsRemaining);
        }
    }

    // Now, check for end of game
    if (newAttemptsRemaining === 0) {
        //console.log("attemptsRemaining === 0", newAttemptsRemaining);
        setResult(displayWord.includes('_') ? "You Lose!" : "You Won!");
        setFinished(true);
    } else if (newAttemptsRemaining > 0 && !displayWord.includes('_')) {
        //console.log("attemptsRemaining > 0 && !displayWord.includes('_')", newAttemptsRemaining);
        setResult("You Won!");
        setFinished(true);
    }
};



  const handlePlayAgain = () =>{
    // Select a random word when the component mounts
    const randomIndex = Math.floor(Math.random() * wordCollection.length);
    setSelectedWord(wordCollection[randomIndex]);

    // Initialize the display word with underscores
    setDisplayWord('_'.repeat(selectedWord.length));

    setAttemptsRemaining(3);
    setLettersPicked(new Set())
    setFinished(false)
    setResult("")

  }



  return (
    <div className="flex flex-col p-10 items-center justify-center w-full h-2/8">
      <p className="text-xl font-bold text-center mb-4">Hangman</p>
      {!finished ?
      <div className='flex flex-col gap-4 items-center'>
        
        <p className="text-lg font-bold text-center mb-4">{`Word: ${displayWord}`}</p>
        <div className='flex flex-row flex-wrap'>
           {letterCollection.map(letter => (
               <div key={letter} className="flex text-xs">
                   {lettersPicked.has(letter) ? (
                       <button 
                           key={letter} 
                           onClick={() => handleLetterPick(letter)}  
                           className={`bg-transparent hover:bg-blue-700 text-blue-500 font-bold py-2 px-4 rounded mr-2 mb-2 ${lettersPicked.has(letter) ? 'text-transparent' : ''}`}
                           disabled={lettersPicked.has(letter)}
                       >
                           {letter}
                       </button> 
                   ) : (
                       <button 
                           key={letter} 
                           onClick={() => handleLetterPick(letter)}  
                           disabled={lettersPicked.has(letter)}
                           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2"
                       >
                           {letter}
                       </button>
                   )}
                  </div>
              ))}
        </div>
        <p className='text-green-500'>{`Attempts remaining: ${attemptsRemaining}`}</p>
        
      </div>
      :<div className="mt-8">
      <p className={`text-lg font-bold ${result === 'You Won!' ? 'text-green-500' : 'text-red-500'}`}>{result}</p>
      <p className="mt-2">Secret word was the word <span className="font-bold">{selectedWord}</span></p>
      <div className="mt-4">
          <button onClick={handlePlayAgain} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Play Again
          </button>
      </div>
  </div>}
    </div>
  );
};


