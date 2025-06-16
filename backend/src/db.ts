import mongoose, { model, Schema, Model } from "mongoose";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import { JWT_SECRET } from "./config";
import { DATABASE_URL } from "./config";

export async function dbConnection() {
    try{
        await mongoose.connect(DATABASE_URL);
        console.log('Connected to the Database successfully');
    }
    catch(error)
    {
        console.log(error);
    }
} 

// Instance methods (on documents)
interface IUser extends Document {
  username: string;
  password: string;
  isValidPassword(password: string): Promise<boolean>;
  generateJWT(): string;
}

// Static methods (on model)
interface IUserModel extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.hashPassword =  async function (password: string): Promise<string>  {
    return bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function(): string  {
    if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: "24h" });
}

export const userModel = model<IUser, IUserModel>("users", userSchema);

const contentTypes = ['image', 'video', 'article', 'audio'];
const ContentSchema = new Schema({
    link: {
        required: true,
        type: String
    },
    type: {
        type: String,
        enum: contentTypes,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag'
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        validate: async function(value: any) {
            const user = await userModel.findById(value);
            if (!user) {
                throw new Error('User does not exist');
            }
        }
    }
})

export const contentModel = model("contents", ContentSchema);


const tagSchema = new Schema({
    title: {
        type: String, 
        required: true, 
        unique: true
    }
});


export const tagModel = model('tag', tagSchema);

const linkSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export const linkModel = model("link", linkSchema);
