"use server"
import QuizModel, { IQuiz } from "../models/quiz.model";
import QuizMetadataModel, { IQuizMetadata } from "../models/quiz_metadata.model";
import { connectToDB } from "../mongoose";



// quiz-metadata collection

// POST 
export async function CreateQuizMetadata(quizMetadata: IQuizMetadata){
    connectToDB();
    try {
        // Create a new quiz metadata document using the provided model
        const newQuizMetadata = await QuizMetadataModel.create(quizMetadata)
        
        // Return the newly created quiz metadata document
        return newQuizMetadata;
    } catch (error) {
        // Handle any errors that occur during the creation process
        console.error("Error creating quiz metadata:", error);
        throw error; // Rethrow the error for handling in the caller function
    }
}

// GET 

export default async function GetQuizMetadataListByUserId(dbUserId: string): Promise<IQuizMetadata[]> {
    connectToDB();

    try {
        const quizMetadataList = await QuizMetadataModel.find({createdBy: dbUserId});
        //console.log("dbUserId:",dbUserId)
       // console.log("Quizmetadata list successfully retrieved",quizMetadataList);
        // Manually convert each document to a plain object
        const plainObjects: IQuizMetadata[] = quizMetadataList.map(quiz => ({
            id: quiz.id,
            name: quiz.name,
            title: quiz.title,
            category: quiz.category,
            createdBy: quiz.createdBy,
            timesClicked: quiz.timesClicked,
            timesFinished: quiz.timesFinished,
            active: quiz.active
        })) as IQuizMetadata[]; // Explicit cast to IQuizMetadata[];


        return plainObjects;
        //return quizMetadataList || []; // Return quizMetadataList if truthy, otherwise return an empty array
    } catch (error) {
        console.error("Quizmetadata retrieve error: ", error);
        return []; // Return an empty array in case of error
    }
}

// POST quiz collection
export async function CreateQuizCollection(quiz:IQuiz){
    await connectToDB();
    try {
        // Create a new quiz document using the provided model
        const newQuiz = await QuizModel.create(quiz)
        
        // Return the newly created quiz
        return newQuiz
    } catch (error) {
        // Handle any errors that occur during the creation process
       // console.error("Error creating quiz metadata:", error);
        throw error; // Rethrow the error for handling in the caller function
    }
}

// GET quiz collection
export async function getQuizById(id: string): Promise<IQuiz | null> {
    try {
        connectToDB();
        // Find the quiz by ID
        const quiz:IQuiz|null = await QuizModel.findOne({ _id: id }).lean();
       // console.log(quiz)
        
        // Manually convert each document to a plain object
        if (quiz) {
        
            const plainObject: IQuiz = {
                questions: quiz.questions,
                results: quiz.results,
                active:quiz.active
            } as IQuiz; // Explicit cast to IQuizMetadata[];
        
            return plainObject
        } else{
           //console.log(" Error fetching quiz by ID: ", id)
           return null
        }
        
    } catch (error) {
        console.error("Error fetching quiz by ID:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
// Get Popular Quizes
export async function getMostPopular50Quizzes(): Promise<IQuizMetadata[] | []>{
    try {
        
        connectToDB();
        // Fetch the first 50 quizzes as plain JavaScript objects
        //console.log("getMostPopular50Quizzes")
        let quizzes = await QuizMetadataModel.find({active:1})
            .lean()
            .sort({ timesClicked: -1, timesFinished: -1 })
            .limit(50);

        //console.log(quizzes)
        // Manually convert each document to a plain object
        const plainObjects: IQuizMetadata[] = quizzes.map(quiz => ({
            id: quiz.id,
            name: quiz.name,
            title: quiz.title,
            category: quiz.category,
            createdBy: quiz.createdBy,
            timesClicked: quiz.timesClicked,
            timesFinished: quiz.timesFinished,
            active: quiz.active
        })) as IQuizMetadata[]; // Explicit cast to IQuizMetadata[];


        return plainObjects;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
         //throw error; // Rethrow the error to be handled by the caller
        return []
    }
}
// Get Current Page Quizes
export async function getRequestedQuizes(pathname:string): Promise<IQuizMetadata[] | []>{
    try {
        
        connectToDB();
        // Fetch the first 50 quizzes as plain JavaScript objects
        
        let quizzes = await QuizMetadataModel.find({category:pathname,active:1})
            .lean()
            .sort({ timesClicked: -1, timesFinished: -1 })
            .limit(50);


        // Manually convert each document to a plain object
        const plainObjects: IQuizMetadata[] = quizzes.map(quiz => ({
            id: quiz.id,
            name: quiz.name,
            title: quiz.title,
            category: quiz.category,
            createdBy: quiz.createdBy,
            timesClicked: quiz.timesClicked,
            timesFinished: quiz.timesFinished,
            active: quiz.active
        })) as IQuizMetadata[]; // Explicit cast to IQuizMetadata[];


        return plainObjects;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
         //throw error; // Rethrow the error to be handled by the caller
        return []
    }
}

//Get Random 50 Quizes
export async function getRandom50Quizes(): Promise<IQuizMetadata[] | []>{

    try {
        
        connectToDB();
        // Fetch the first 50 quizzes as plain JavaScript objects
        
        let quizzes = await QuizMetadataModel.find({active:1})
            .lean()
            .sort({ timesClicked: -1, timesFinished: -1 })
            .limit(50);


        // Manually convert each document to a plain object
        const plainObjects: IQuizMetadata[] = quizzes.map(quiz => ({
            id: quiz.id,
            name: quiz.name,
            title: quiz.title,
            category: quiz.category,
            createdBy: quiz.createdBy,
            timesClicked: quiz.timesClicked,
            timesFinished: quiz.timesFinished,
            active: quiz.active
        })) as IQuizMetadata[]; // Explicit cast to IQuizMetadata[];


        return plainObjects;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
         //throw error; // Rethrow the error to be handled by the caller
        return []
    }
}

// Get most clicked

export async function getMostClicked50Quizes(): Promise<IQuizMetadata[] | []> {
    try {
        //console.log("getMostClicked50Quizes")
        // Fetch the first 50 quizzes sorted by timesClicked in descending order
        const quizzes = await QuizMetadataModel.find({ active: 1 }) // Filter for active quizzes
            .sort({ timesClicked: -1 }) // Sort by timesClicked in descending order
            .limit(50); // Limit to 50 quizzes

        //console.log(quizzes)
        // Map the quizzes to plain objects
        const plainObjects: IQuizMetadata[] = quizzes.map(quiz => ({
            id: quiz.id.toString(), // Convert ObjectId to string
            name: quiz.name,
            title: quiz.title,
            category: quiz.category,
            createdBy: quiz.createdBy,
            timesClicked: quiz.timesClicked,
            timesFinished: quiz.timesFinished,
            active: quiz.active
        }))as IQuizMetadata[];

        return plainObjects;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return []; // Return an empty array if there's an error
    }
}

export async function getMostFinished50Quizes(): Promise<IQuizMetadata[] | []> {
    try {
        // Fetch the first 50 quizzes sorted by timesClicked in descending order
        const quizzes = await QuizMetadataModel.find({ active: 1 }) // Filter for active quizzes
            .sort({ timesFinished: -1 }) // Sort by timesClicked in descending order
            .limit(50); // Limit to 50 quizzes

        // Map the quizzes to plain objects
        const plainObjects: IQuizMetadata[] = quizzes.map(quiz => ({
            id: quiz.id.toString(), // Convert ObjectId to string
            name: quiz.name,
            title: quiz.title,
            category: quiz.category,
            createdBy: quiz.createdBy,
            timesClicked: quiz.timesClicked,
            timesFinished: quiz.timesFinished,
            active: quiz.active
        }))as IQuizMetadata[];

        return plainObjects;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return []; // Return an empty array if there's an error
    }
}

export async function getRecentlyAdded50Quizes(): Promise<IQuizMetadata[] | []> {
    try {
        // Fetch the first 50 quizzes sorted by _id in descending order
        const quizzes = await QuizMetadataModel.find({ active: 1 }) // Filter for active quizzes
            .sort({ _id: -1 }) // Sort by _id in descending order
            .limit(50); // Limit to 50 quizzes

        // Map the quizzes to plain objects
        const plainObjects: IQuizMetadata[] = quizzes.map(quiz => ({
            id: quiz.id.toString(), // Convert ObjectId to string
            name: quiz.name,
            title: quiz.title,
            category: quiz.category,
            createdBy: quiz.createdBy,
            timesClicked: quiz.timesClicked,
            timesFinished: quiz.timesFinished,
            active: quiz.active
        }))as IQuizMetadata[];

        return plainObjects;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return []; // Return an empty array if there's an error
    }
}
