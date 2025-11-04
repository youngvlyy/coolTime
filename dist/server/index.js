"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", user_1.default);
app.use("/api/user", user_1.default);
// app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});
// SPA 처리: React 빌드의 index.html을 반환
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
// });
const PORT = 4000;
if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined!");
    process.exit(1); // 아예 서버 실행 중단
}
// const MONGO_URI = "mongodb://localhost:27017/cooltimeDB";
console.log(process.env.MONGO_URI);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
