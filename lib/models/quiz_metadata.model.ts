import mongoose, { Document } from "mongoose";

// Define the schema
const QuizMetadataSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    createdBy: { type: String, required: true },
    timesClicked: { type: Number, required: true },
    timesFinished: { type: Number, required: true },
    active: { type: Number, required: true }
});

// Define the interface for Quiz Metadata
export interface IQuizMetadata extends Document {
    id: string;
    name: string;
    title: string;
    category: string;
    createdBy: string;
    timesClicked: number;
    timesFinished: number;
    active:number;
}

// Define the model
const QuizMetadataModel = mongoose.models.QuizMetadata || mongoose.model('QuizMetadata', QuizMetadataSchema);

export default QuizMetadataModel;
