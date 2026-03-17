"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const error_handler_1 = require("./middleware/error-handler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.corsOrigin
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), 'uploads')));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/applications', application_routes_1.default);
app.use(error_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
async function startServer() {
    try {
        await (0, database_1.connectDatabase)(env_1.env.mongoUri);
        app.listen(env_1.env.port, () => {
            console.log(`Backend server running on http://localhost:${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error('Failed to start backend:', error);
        process.exit(1);
    }
}
void startServer();
