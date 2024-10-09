"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getQuizById } from '@/lib/actions/quiz.actions';
import { IQuiz } from '@/lib/models/quiz.model';
import MainContent from '@/components/shared/MainContent';
import Link from 'next/link';

export default function ActiveQuiz({ params }: { params: { id: string }}) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<IQuiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [resultName, setResultName] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [active, setActive] = useState<number>(0);

    useEffect(() => {
        
        const fetchQuiz = async () => {
            try {
                const fetchedQuiz = await getQuizById(params.id);
                if (fetchedQuiz) {
                    setQuiz(fetchedQuiz);
                    setLoading(false);
                    setActive(fetchedQuiz.active)
                    //console.log("FETCHEDQUIZ: ",fetchedQuiz)
                } else {
                    setError('Quiz not found.');
                    setLoading(false);
                    
                }
            } catch (error) {
                setError('Error fetching quiz.');
                setLoading(false);
                
            }
        };

        fetchQuiz();
    }, [params.id]);

    const handleAnswerSelect = (selectedAnswer: string) => {
        setUserAnswers(prevAnswers => [...prevAnswers, selectedAnswer]);
        if (currentQuestionIndex < (quiz?.questions.length ?? 0) - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    };
    
    useEffect(() => {
        if (userAnswers.length === quiz?.questions.length) {
            let score = 0;
            userAnswers.forEach((answer, index) => {
                const correctAnswer = quiz?.questions[index].answers.find(a => a.isCorrect);
                if (correctAnswer && answer === correctAnswer.value) {
                    score++;
                }
            });
            const percentage = (score / (quiz?.questions.length ?? 1)) * 100;
            setResult(`Your score: ${score}/${quiz?.questions.length} (${percentage.toFixed(2)}%)`);
            setResultName(`${score < 3 ? quiz?.results[0].result : score < 6 ? quiz?.results[1].result : quiz?.results[2].result}`);
        }
    }, [userAnswers, quiz]);

    const handleRetry = () => {
        setUserAnswers([]);
        setCurrentQuestionIndex(0);
        setResult(null);
    };

    const handleGoToHome = () => {
        router.push('/');
    };
    const shuffleArray = (array: any[]) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const renderQuestions = () => {
        if (!quiz) return null;
        const question = quiz.questions[currentQuestionIndex];
        const shuffledAnswers = shuffleArray(question.answers); // Shuffle the answers
        return (
            <div className="bg-zinc-800 text-white rounded-lg shadow-md p-6 w-full ">
                <h2 className="xl:text-2xl lg:text-2xl md:text-lg sm:text-sm font-semibold mb-4">{question.question}</h2>
                <ul>
                    {shuffledAnswers.map((answer, index) => (
                        <li key={index} className="mb-2">
                            <button 
                                className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded xl:text-lg lg:text-lg md:text-sm "
                                onClick={() => handleAnswerSelect(answer.value)}
                            >
                                {answer.value}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const getQuizActiveStructure = () => {
       
        //console.log('ACTIVE:', active)
        
        return(
            <div className="flex flex-col items-center justify-center mt-10 mb-10">
            
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && !quiz && <p>No quiz found.</p>}
            {!loading && !error && quiz && !result && (
                <>
                    {renderQuestions()}
                </>
            )}
            {result && (
                <div className='flex flex-col items-center '>
                    <div className="bg-zinc-800 rounded-lg shadow-md p-6 text-center w-full">
                        <p className="xl:text-2xl lg:text-2xl md:text-lg sm:text-sm font-semibold mb-4">{result}</p>
                        <p className="text-blue-500 text-lg xl:text-2xl lg:text-2xl md:text-lg sm:text-sm font-semibold mb-4">{resultName}</p>
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 text-sm rounded mr-2 mb-2 sm:mb-0"
                            onClick={handleRetry}
                        >
                            Play Again
                        </button>
                        <button 
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 text-sm rounded"
                            onClick={handleGoToHome}
                        >
                            Go Home
                        </button>
                    </div>
                    <button 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 text-sm rounded mt-4"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Quiz link copied to clipboard!");
                        }}
                    >
                        Copy Quiz Link
                    </button>

                </div>
            )}
            
            <MainContent/>
        </div>
        )
    }

    const getQuizPendingStructure = () => {
        
        //console.log('ACTIVE:', active)
        return (
            <div className='flex flex-col items-center'>
                <h2 className='m-10'>
                    Quiz under revision.
                </h2>
                <Link href="/" className="text-blue-500 underline">
                    Go back to home
                </Link>
                <MainContent/>
            </div>
        );
    }

    const getQuizRejectStructure = () => {
        //console.log('ACTIVE:', active)
        return (
            <div className='flex flex-col items-center '>
                <h2 className='text-red-500 m-10'>
                    Quiz rejected.
                </h2>
                <Link href="/" className="text-blue-500 underline">
                    Go back to home
                </Link>
                <MainContent/>
            </div>
        );
    }

    return (
        <div>
            {loading ? <p>Loading...</p> : active === 1 ? getQuizActiveStructure() : active === 0 ? getQuizPendingStructure() : getQuizRejectStructure()}
        </div>
    );
}
