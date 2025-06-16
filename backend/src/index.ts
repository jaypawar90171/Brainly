import express, {Request, Response} from 'express';
import { dbConnection } from './db';
import { userModel } from './db';
import zod from 'zod'
import {authUser}  from './middleware';
import { contentModel } from './db';
import cors from 'cors'
import crypto from 'crypto'
import { linkModel } from './db';
import { useMap } from '@vis.gl/react-google-maps';

const User = zod.object({
    username: zod.string(),
    password: zod.string().min(8)
})

const app = express();
app.use(express.json());
app.use(cors());
dbConnection();

app.post('/', async (req, res) => {
    res.send('hello');
})

app.post('/api/v1/signin', async (req, res)  => {
    const body =  User.parse(req.body);

    if(!body) 
    {
        res.status(401).json({message: "Invalid user input"});
    }

    try{
        const hashedPassword = await userModel.hashPassword(body.password)
        if(!hashedPassword)
        {
            res.json({message: "Errorin hashing the password"})
        }

        const users = await userModel.create({
            username: req.body.username,
            password: hashedPassword
        })

        res.json(users);
    }
    catch(error)
    {
        res.status(411).json({err: error})
    }
});

app.post('/api/v1/signup', async(req, res) => {
    const {username, password} = req.body;
    console.log(username, password);
    if(!username || !password)
    {
        res.status(400).json({msg: "No user input privided"})
        return;
    }
    try
    {
        const result = await userModel.findOne({username: username});
        if(!result)
        {
            res.status(401).json({msg: "No user found"});
            return;
        }
        console.log(result);

        const isMatchPassword = await result?.isValidPassword(password);
        if(!isMatchPassword)
        {
            res.status(401).json({msg: "Password not match"});
            return;
        }
        console.log(isMatchPassword);

        const token = result?.generateJWT()
        res.json({result, token})
    }
    catch(error)
    {
        res.status(411).json({msg: error});
    }
});

app.put('/api/v1/content', authUser, async(req: Request, res: Response) => {
    const {link, type, title} = req.body;
    try
    {   
       const result =  await contentModel.create({
            link, type, title, tags: [], userId: req.user.id
        })
        res.status(200).json(result);
    } catch(error)
    {
        console.error(error); // Use console.error for better visibility
        if (error instanceof Error) {
            console.error(error.stack); // Log stack trace if available
        }
        res.status(411).json({msg: error});
    }
});

app.get('/api/v1/content', authUser, async(req, res) => {
    const userId = req.user.id;
    try
    {
        const contents = await contentModel.find({
            userId: userId
        }).populate("userId" , "username"); //populate on username
        res.status(200).json(contents);
    } catch(error)
    {
        console.log(error);
        res.status(411).json({err: error})
    }
});

app.delete('/api/v1/content', authUser, async(req, res) => {
    const contentId = req.body.id;

    try{
        //to ensure that it can only delete its own content not of others
        const result = await contentModel.deleteMany({
            _id: contentId,
            userId: req.user.id
        });
        res.status(200).json({msg: result});
    }catch(error)
    {
        res.status(411).json({err: error})
    }
});

app.post('/api/v1/brainly/share', authUser, async (req, res) => {
    const share = req.body.share;
    try {
        if (share) {
            // Generate a unique hash for the link
            const hash = crypto.randomBytes(16).toString("hex");
            const userId = req.user.id;

            // Save the link in the database
            await linkModel.create({ hash, userId });

            res.status(200).json({
                link: "/share/" + hash
            });
            return;
        } else {
            await linkModel.deleteOne({
                userId: req.user.id
            });

            res.status(200).json({ msg: "remove link" });
            return;
        }
    } catch (error) {
        res.status(500).json({ err: "Failed to create shareable link" });
    }
});

app.get('/api/v1/brainly/:shareLink', authUser, async(req, res) => {
    const hashId = req.params.shareLink;

    try{
        const link = await linkModel.findOne({
        hash: hashId
        })

        if(!link)
        {
            res.status(211).json({msg: "wrong hashId"});
            return;
        }

        const content = await contentModel.find({
            userId: link.userId
        })

        if(!content)
        {
            res.status(211).json({msg: "No content found"});
            return;
        }
        const user = await userModel.findOne({
            _id: link.userId
        })


        if(!user)
        {
            res.status(211).json({msg: "No user found"});
            return;
        }

        res.status(200).json({
            username: user.username,
            content: content
        })
    }
    catch(error)
    {
        res.status(400).send({err: error})
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})