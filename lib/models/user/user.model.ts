import mongoose, { Document } from "mongoose";

export interface IUser extends Document{
    clerkId: string,
    email: string, 
    name: string,
    surname: string
    sportsClicked: number, 
    popularClicked: number,
    funClicked: number,
    scienceClicked: number,
    otherClicked: number
}

const UserSchema = new mongoose.Schema({

    clerkId: {type: String, required:true},
    email: {type: String, required:false},
    name: {type: String, required:false},
    surname: {type: String, required:false},
    sportsClicked: {type: Number, default:0},
    popularClicked: {type: Number, default:0},
    funClicked: {type: Number, default:0},
    scienceClicked: {type: Number, default:0},
    otherClicked: {type: Number, default:0}
})

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)

export default UserModel