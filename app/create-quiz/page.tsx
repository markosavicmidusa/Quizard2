"use client"

import { useEffect, useState } from 'react';
import { IQuiz } from '@/lib/models/quiz.model'; // Import the interface for the quiz
import { IQuizMetadata } from '@/lib/models/quiz_metadata.model';
import { getCategories } from '@/data/controller';
import { ICategory } from '@/data/categories/categories';
import { CreateQuizCollection, CreateQuizMetadata } from '@/lib/actions/quiz.actions';
import { useUser } from '@clerk/nextjs';
import { GetUserByClerkID } from '@/lib/actions/user/user.actions';
import { IUser } from '@/lib/models/user/user.model';
import Link from 'next/link';
import MainContent from '@/components/shared/MainContent';


export default function CreateQuiz() {
 
    const initialQuizState: IQuiz = {
        questions: Array.from({ length: 6 }, () => ({
            question: '',
            answers: [
                { value: '', isCorrect: true },
                { value: '', isCorrect: false },
                { value: '', isCorrect: false }
            ]
        })),
        results: [
            { from: 0, to: 2, result: '' },
            { from: 3, to: 5, result: '' },
            { from: 6, to: 6, result: '' }
        ]
    } as IQuiz;

    const initialQuizMetadataState:IQuizMetadata = {
        id: '',
        name: '',
        title: '',
        category: '/other',
        createdBy: 'CreatedBy Id',
        timesClicked: 0,
        timesFinished: 0,
        active: 0
    } as IQuizMetadata


    

    const [quiz, setQuiz] = useState(initialQuizState);
    const [quizMetadata, setQuizMetadata] = useState(initialQuizMetadataState);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [quizMetadataVisibility, setQuizMetadataVisibility] = useState(true)
    const [questionsVisibility, setquestionsVisibility] = useState(false)
    const [resultsVisibility, setResultsVisibility] = useState(false)

    const { isLoaded, isSignedIn, user } = useUser();
    const [DbUser, setDbUser] = useState<IUser|null>(null)

    const [submitted, setSubmitted] = useState(false);
    
    const [errorSubmiting, setErrorSubmiting] = useState(false);

    const categories: ICategory[] = getCategories()


    const [errorMessageName, setErrorMessageName] = useState('');
    const [hasErrorName, setHasErrorName] = useState(true);
    const [errorMessageDescription, setErrorMessageDescription] = useState('');
    const [hasErrorDescription, setHasErrorDescription] = useState(true);


    const [errorMessageQuestion, setErrorMessageQuestion] = useState('');
    const [hasErrorQuestion, setHasErrorQuestion] = useState(true);
    const [errorMessageAnswer, setErrorMessageAnswer] = useState('');
    const [hasErrorAnswer, setHasErrorAnswer] = useState(true);

    const [errorMessageResult, setErrorMessageResult] = useState('');
    const [hasErrorResult, setHasErrorResult] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            
            if (user && user.id) { // Check if user and user.id are defined
                const dbUser = await GetUserByClerkID(user.id);
                setDbUser(dbUser);
                //console.log("DB-user: ", dbUser)
            }
        }
        fetchUser()
    },[user])
   
    const handleNextQuestion = () => {

        //console.log("NEXT")
        if (currentQuestionIndex < quiz.questions.length - 1) {
            
            //console.log("NEXT 2")
            const question = quiz.questions[currentQuestionIndex+1]

            //console.log("Question: ", question.question)

            if(question.question == '' || question.question.length >= 50){
                setHasErrorQuestion(true)
                setErrorMessageQuestion("Check/fill Question content")
            }else{
                setHasErrorAnswer(false)
                setErrorMessageAnswer("")
            }

            //console.log("Answers: ", question.answers)

            if((question.answers[0].value == '' || question.answers[0].value.length >=50 ) ||
            (question.answers[1].value == '' || question.answers[1].value.length >=50 ) || 
            (question.answers[2].value == '' || question.answers[2].value.length >=50 )){
                setHasErrorAnswer(true)
                setErrorMessageAnswer("Check/fill Answers content")
            }else{
                setHasErrorAnswer(false)
                setErrorMessageAnswer("")
            }


            
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            
                setHasErrorQuestion(false)
                setHasErrorAnswer(false)
                setErrorMessageQuestion("")
                setErrorMessageAnswer("")
            
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleQuestionChange = (field: string, value: any, answerIndex: number) => {
        
        setQuiz((prevState: IQuiz) => {
            const newQuestions = [...prevState.questions];
            newQuestions[currentQuestionIndex].answers[answerIndex] = {
                ...newQuestions[currentQuestionIndex].answers[answerIndex],
                [field]: value
            };
            const question : IQuiz = {
                ...prevState,
                questions: newQuestions
            } as IQuiz

            return question
        });


        if(value.length <= 0){
            setErrorMessageAnswer(`Please enter the value for: Answer ${answerIndex + 1}`)
            setHasErrorAnswer(true)
        }else if(value.length >=50){
            setErrorMessageAnswer(`Answer ${answerIndex + 1} content too long`)
            setHasErrorAnswer(true)
        }else{

            const question = quiz.questions[currentQuestionIndex]


            if((question.answers[0].value == '' || question.answers[0].value.length >=50 ) ||
            (question.answers[1].value == '' || question.answers[1].value.length >=50 ) || 
            (question.answers[2].value == '' || question.answers[2].value.length >=50 )){
                
                setErrorMessageAnswer('Check/fill Answers content')
                setHasErrorAnswer(true)
            }else{
                setErrorMessageAnswer("")
                setHasErrorAnswer(false)
            }
            
        }

        
    };

    const handleQuestionContentChange = (value: any) => {
        
        if(value.length <= 0){
            setErrorMessageQuestion(`Please enter the value for: Question ${currentQuestionIndex + 1}`)
            setHasErrorQuestion(true)
        }else if(value.length >=50){
            setErrorMessageQuestion(`Question ${currentQuestionIndex + 1} content too long`)
            setHasErrorQuestion(true)
        }else{
            setErrorMessageQuestion("")
            setHasErrorQuestion(false)
        }
        
        
        setQuiz((prevState: IQuiz) => {
            const newQuestions = [...prevState.questions];
            newQuestions[currentQuestionIndex].question = value;
            const question : IQuiz = {
                ...prevState,
                questions: newQuestions
            } as IQuiz

            return question
        });
    };
    
    const handleResultChange = (index: number, field: string, value: any) => {
        
        if(value.length <= 0){
            setErrorMessageResult(`Please enter the value for: Result ${index + 1}`)
            setHasErrorResult(true)
        }else if(value.length >=50){
            setErrorMessageResult(`Result ${index + 1} content too long`)
            setHasErrorResult(true)
        }else{

            const result0 = quiz.results[0].result
            const result1 = quiz.results[1].result
            const result2 = quiz.results[2].result

            if((result0 == '' || result0.length >=50 ) ||
            (result1 == '' || result1.length >=50 ) || 
            (result2 == '' || result2.length >=50 )){
                
                setErrorMessageResult(`Check/fill Results`)
                setHasErrorResult(true)
            }else{
                setErrorMessageResult("")
                setHasErrorResult(false)
            }
            
        }
        
        
        setQuiz((prevState: IQuiz) => {
            const newResults = [...prevState.results];
            newResults[index] = { ...newResults[index], [field]: value };
            
            const result = {
                ...prevState, 
                results: newResults 
            } as IQuiz
            
            return result;
        });
    };

    const handleNameContentChange = (value:string) => {
       
        if(value.length <= 0){
            setErrorMessageName("Please enter the value: Quiz name")
            setHasErrorName(true)
        }else if(value.length >=15){
            setErrorMessageName('Quiz name must be 15 chars long')
            setHasErrorName(true)
        }else{
            setErrorMessageName("")
            setHasErrorName(false)
        }
        /*console.log("Name change", value)
        console.log(quizMetadata.name)*/
        setQuizMetadata((prevState: IQuizMetadata) => {
            
            const currentQuizMetadataState = {
                id: prevState.id,
                name: value,
                title: prevState.title,
                category: prevState.category,
                createdBy: prevState.createdBy,
                timesClicked: prevState.timesClicked,
                timesFinished: prevState.timesFinished,
                active: prevState.active
            } as IQuizMetadata;
            return currentQuizMetadataState;
        });
        
        setQuizMetadata((prevState: IQuizMetadata) => {
            const currentQuizMetadataState = prevState;
            currentQuizMetadataState.name = value;
            
            return currentQuizMetadataState;
    });
    };

    const handleTitleContentChange = (value:string) => {
        
        if(value.length <= 0){
            setErrorMessageDescription("Please enter the value: Short description")
            setHasErrorDescription(true)
        }else if(value.length >=15){
            setErrorMessageDescription('Short description name must be under 30 chars long')
            setHasErrorDescription(true)
        }else{
            setErrorMessageDescription("")
            setHasErrorDescription(false)
        }
        
        setQuizMetadata((prevState: IQuizMetadata) => {
            
            const currentQuizMetadataState = {
                id: prevState.id,
                name: prevState.name,
                title: value,
                category: prevState.category,
                createdBy: prevState.createdBy,
                timesClicked: prevState.timesClicked,
                timesFinished: prevState.timesFinished,
                active: prevState.active
            } as IQuizMetadata;
            return currentQuizMetadataState;
        });
        
        setQuizMetadata((prevState: IQuizMetadata) => {
            const currentQuizMetadataState = prevState;
            currentQuizMetadataState.title = value;
            
            return currentQuizMetadataState;
    });
    };

    const handleCategoryChange = (value: string) => {
        //console.log(value)
        //console.log(quizMetadata)
        
        setQuizMetadata((prevState: IQuizMetadata) => {
            const currentQuizMetadataState = prevState;
            currentQuizMetadataState.category = value;
             
            return currentQuizMetadataState;
        });
        //console.log(quizMetadata)
    };
    const handleChangeQuizMetadataVisibility = () => {
        

        setQuizMetadataVisibility(prevState => !prevState )
        setquestionsVisibility(prevState => !prevState)
    
    }
    const handleResultVisibility = () => {
        setResultsVisibility(prevState => !prevState)
        setquestionsVisibility(prevState => !prevState)
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission
        quiz.active = 0;        // Setting quiz to not-active - pending status 0

        // create Quiz

        try {
        
           const newQuiz = await CreateQuizCollection(quiz)
           //const newQuiz = await CreateQuizCollectionTest(initialQuizStateTest)

            if(!newQuiz){
              //console.log('Error creating quiz')
              setErrorSubmiting(true)
            } else {
                
                //console.log('Quiz submitted:', quiz);

                // Updating quizesMetadata object
                quizMetadata.id = newQuiz._id
                quizMetadata.createdBy = DbUser ? DbUser.id : "Unknown"

                // creating the quizMetadata
                const newQuizMetadata = CreateQuizMetadata(quizMetadata)

                if(!newQuizMetadata){
                    //console.log('Error creating quizMetadata')
                    setErrorSubmiting(true)
                } else {
                    //console.log('Quiz metadata:', quizMetadata);

                    // Set submitted to true to trigger the info popup
                    setSubmitted(true);
               }
            }

        } catch (error) {
            //console.log("Error: ",error)
            setErrorSubmiting(true)
        }
    };


    const resetConditions = () => {
        setQuiz(initialQuizState);
        setQuizMetadata(initialQuizMetadataState);
        setCurrentQuestionIndex(0);

        setQuizMetadataVisibility(true)
        setquestionsVisibility(false)
        setResultsVisibility(false)

        setSubmitted(false);
        
        setErrorSubmiting(false);
    }


    return (

    <div>    
        <div className="max-w-md mx-auto mt-8 p-5">
             <h1 className="text-3xl font-bold mb-4">Create Quiz</h1>
             {!submitted && (
                 <form onSubmit={handleSubmit}>

                 {/** Metadata div */}
                 {quizMetadataVisibility && ( <div>
                     <div className="mb-8">
                         <h3 className="text-lg font-semibold mb-2">Question metadata</h3>
                    <div className="mb-2">
                         <input
                            type="text"
                            placeholder="Quiz name"
                            value={quizMetadata.name}
                            onChange={e => handleNameContentChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                         />
                         
                    </div>
                    <div className="mb-2">
                         <input
                            type="text"
                            placeholder="Short description"
                            value={quizMetadata.title}
                            onChange={e => handleTitleContentChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                         />
                    </div>
                    <div className="mb-2">
                                <select
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                                >
                                    <option defaultValue={""} >{quizMetadata.category.substring(1).toUpperCase()}</option>
                                    {categories.map((category) => (
                                        <option key={category.link} value={category.link}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                    </div>
                    <div className='mb-2'>
                    { (hasErrorDescription || hasErrorName) ? 
                            <div className="text-red-500">
                                <p>{errorMessageName}</p>
                                <p>{errorMessageDescription}</p>
                            </div> :
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={handleChangeQuizMetadataVisibility}>
                                    Next Section 
                            </button>
                    }
                    </div>
                    
                   
                </div>
            </div>)}
            {/** Questions div */}
            {questionsVisibility && (
            <div>    
                <div key={currentQuestionIndex} className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1}</h3>
                    <div className="mb-2">
                        <input
                            type="text"
                            placeholder={`Question ${currentQuestionIndex + 1} content`}
                            value={quiz.questions[currentQuestionIndex].question}
                            onChange={e => handleQuestionContentChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    {quiz.questions[currentQuestionIndex].answers.map((answer, answerIndex) => (
                        <div key={answerIndex} className="mb-2">
                            <input
                                type="text"
                                placeholder={`Answer ${answerIndex + 1} ${answerIndex === 0 ? ' (true answer)':''}`}
                                value={answer.value}
                                onChange={e => handleQuestionChange('value', e.target.value, answerIndex)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    ))}
                     <div className='text-red-500'>
                        <p className=''>{errorMessageQuestion}</p>
                        <p>{errorMessageAnswer}</p>
                    </div>
                </div>
                <div className="flex flex-row justify-between mb-4 pr-10 pl-10">
                    {currentQuestionIndex == 0 && (
                        <button
                            type="button"
                            onClick={handleChangeQuizMetadataVisibility}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            {"<"} Metadata
                        </button>
                    )}
                    {currentQuestionIndex > 0 && (
                        <button
                            type="button"
                            onClick={handlePrevQuestion}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            {"<"} Previous
                        </button>
                    )}
                    {(currentQuestionIndex < quiz.questions.length - 1) ? 
                        (!hasErrorQuestion && !hasErrorAnswer) ? 
                        <button
                            type="button"
                            onClick={handleNextQuestion}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Next {">"}
                        </button> :
                        <div>
                        </div>
                        :<div></div>}
                        
                       
                    {currentQuestionIndex == 5 && !hasErrorQuestion && !hasErrorAnswer && (
                        <button
                            type="button"
                            onClick={handleResultVisibility}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Results {">"} 
                        </button>
                    )}
                </div>
            </div>)}
            {/** Results div */}
            {resultsVisibility && ( 
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Results</h2>
                        {quiz.results.map((result, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    placeholder={`ex. ${index == 0 ? '"Looser" (0-50%' : index == 1 ? '"Not bad at all !" (50%-90%': '"The REAL DEAL :) !" (90%-100%'} score)`}
                                    value={result.result}
                                    onChange={e => handleResultChange(index, 'result', e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        ))}
                        <p className='text-red-500'>{errorMessageResult}</p> 
                    <div className='flex gap-4 mt-5'>   
                        <button
                            type="button"
                            onClick={handleResultVisibility}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >{"<"} Questions</button>
                        {!hasErrorResult && (
                             <button
                             type="submit"
                             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                         >
                             Submit
                         </button>
                        )}
                       
                    </div>
                    
                </div>)}
            </form>
            
        )}
        {!submitted && (
                <MainContent/>
            )}
        {submitted && (
            <div className="z-10 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-700 bg-opacity-80">
                <div className="flex flex-col items-center bg-zinc-800 p-8 gap-10 rounded-md shadow-md">
                    <p className="text-lg text-green-500 font-semibold mb-2">Quiz submitted successfully!</p>
                    <Link href={'/user'} className="text-red-500 hover:text-blue-500 underline">Close</Link>
                </div>
            </div>
        )}
        {submitted && (
                <MainContent/>
            )}

        {errorSubmiting && (
            <div className="z-10 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-700 bg-opacity-80">
                <div className="bg-zinc-800 text-red-500 p-8 rounded-md shadow-md flex flex-col inline-center justify-center">
                    <p className="text-lg font-semibold mb-2 text-red-500">Quiz not submited.Error ocured</p>
                    <div className='flex flex-row gap-16 justify-center p-5'>
                        <button onClick={resetConditions} className="text-green-500 hover:text-blue-500 underline">Try again</button>
                        <Link href={'/user'} className="text-red-500 hover:text-blue-500">Close</Link>
                    </div>
                    
                </div>
            </div>
        )}
        {errorSubmiting && (
            <MainContent/>
        )}
        </div>
    </div>
    );
}
