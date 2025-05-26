"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const config_1 = __importDefault(require("./app/config"));
const port = config_1.default.port || 5000;
const database_url = config_1.default.database_url;
let server;
async function main() {
    try {
        await mongoose_1.default.connect(database_url);
        server = app_1.default.listen(port, () => {
            console.log(`App Is Listening On Port ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}
main();
process.on('unhandledRejection', (err) => {
    console.log(`😈 unhandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});
