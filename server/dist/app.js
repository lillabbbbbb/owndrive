"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config"); //if this line is not HERE, the google oauth passport runs into an error
const google_passport_config_1 = __importDefault(require("./middleware/google-passport-config"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const user_1 = __importDefault(require("./routes/user"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const file_1 = __importDefault(require("./routes/file"));
const session_1 = __importDefault(require("./routes/session"));
console.log("🔥 ENTRY FILE LOADED");
//backbone of the backend
//Configure environment variables
dotenv_1.default.config();
//Establish server with Express
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 8001;
//Connect server to DB
const mongoDB = "mongodb://127.0.0.1:27017/OwnDrive";
mongoose_1.default.connect(mongoDB);
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
//Set up what the app should use
app.use(google_passport_config_1.default.initialize());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/api", index_1.default);
app.use("/api", user_1.default);
app.use("/api", file_1.default);
app.use("/api", session_1.default);
//Server listens to port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//Enable cross-origin resource sharing
if (process.env.NODE_ENV === "development") {
    const corsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    };
    app.use((0, cors_1.default)(corsOptions));
}
else if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.resolve("../..", "client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve("../..", "client", "build", "index.html"));
    });
}
//# sourceMappingURL=app.js.map