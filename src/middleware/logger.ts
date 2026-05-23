import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

// logs directory
const logsDir = path.join(process.cwd(), "logs");

// create logs directory if not exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// log file path
const logFilePath = path.join(logsDir, "access.log");

const logger = (req: Request, res: Response, next: NextFunction) => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        const log = `
    [${new Date().toISOString()}]
    METHOD  : ${req.method}
    URL     : ${req.originalUrl}
    STATUS  : ${res.statusCode}
    IP      : ${req.ip}
    TIME    : ${duration}ms
    ----------------------------------------
    `;

        fs.appendFile(logFilePath, log, (err) => {
            if (err) {
                console.error("Logger Error:", err);
            }
        });

    });

    next();
};

export default logger;