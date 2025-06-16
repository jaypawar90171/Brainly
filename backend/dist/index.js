"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const db_2 = require("./db");
const zod_1 = __importDefault(require("zod"));
const middleware_1 = require("./middleware");
const db_3 = require("./db");
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importDefault(require("crypto"));
const db_4 = require("./db");
const User = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string().min(8)
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_1.dbConnection)();
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('hello');
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = User.parse(req.body);
    if (!body) {
        res.status(401).json({ message: "Invalid user input" });
    }
    try {
        const hashedPassword = yield db_2.userModel.hashPassword(body.password);
        if (!hashedPassword) {
            res.json({ message: "Errorin hashing the password" });
        }
        const users = yield db_2.userModel.create({
            username: req.body.username,
            password: hashedPassword
        });
        res.json(users);
    }
    catch (error) {
        res.status(411).json({ err: error });
    }
}));
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        res.status(400).json({ msg: "No user input privided" });
        return;
    }
    try {
        const result = yield db_2.userModel.findOne({ username: username });
        if (!result) {
            res.status(401).json({ msg: "No user found" });
            return;
        }
        console.log(result);
        const isMatchPassword = yield (result === null || result === void 0 ? void 0 : result.isValidPassword(password));
        if (!isMatchPassword) {
            res.status(401).json({ msg: "Password not match" });
            return;
        }
        console.log(isMatchPassword);
        const token = result === null || result === void 0 ? void 0 : result.generateJWT();
        res.json({ result, token });
    }
    catch (error) {
        res.status(411).json({ msg: error });
    }
}));
app.put('/api/v1/content', middleware_1.authUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    try {
        const result = yield db_3.contentModel.create({
            link, type, title, tags: [], userId: req.user.id
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error); // Use console.error for better visibility
        if (error instanceof Error) {
            console.error(error.stack); // Log stack trace if available
        }
        res.status(411).json({ msg: error });
    }
}));
app.get('/api/v1/content', middleware_1.authUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const contents = yield db_3.contentModel.find({
            userId: userId
        }).populate("userId", "username"); //populate on username
        res.status(200).json(contents);
    }
    catch (error) {
        console.log(error);
        res.status(411).json({ err: error });
    }
}));
app.delete('/api/v1/content', middleware_1.authUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.id;
    try {
        //to ensure that it can only delete its own content not of others
        const result = yield db_3.contentModel.deleteMany({
            _id: contentId,
            userId: req.user.id
        });
        res.status(200).json({ msg: result });
    }
    catch (error) {
        res.status(411).json({ err: error });
    }
}));
app.post('/api/v1/brainly/share', middleware_1.authUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    try {
        if (share) {
            // Generate a unique hash for the link
            const hash = crypto_1.default.randomBytes(16).toString("hex");
            const userId = req.user.id;
            // Save the link in the database
            yield db_4.linkModel.create({ hash, userId });
            res.status(200).json({
                link: "/share/" + hash
            });
            return;
        }
        else {
            yield db_4.linkModel.deleteOne({
                userId: req.user.id
            });
            res.status(200).json({ msg: "remove link" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ err: "Failed to create shareable link" });
    }
}));
app.get('/api/v1/brainly/:shareLink', middleware_1.authUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hashId = req.params.shareLink;
    try {
        const link = yield db_4.linkModel.findOne({
            hash: hashId
        });
        if (!link) {
            res.status(211).json({ msg: "wrong hashId" });
            return;
        }
        const content = yield db_3.contentModel.find({
            userId: link.userId
        });
        if (!content) {
            res.status(211).json({ msg: "No content found" });
            return;
        }
        const user = yield db_2.userModel.findOne({
            _id: link.userId
        });
        if (!user) {
            res.status(211).json({ msg: "No user found" });
            return;
        }
        res.status(200).json({
            username: user.username,
            content: content
        });
    }
    catch (error) {
        res.status(400).send({ err: error });
    }
}));
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});
