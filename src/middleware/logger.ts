import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

const isDev = process.env.NODE_ENV === "development";

let logFilePath = "";

if (isDev) {
    const logsDir = path.join(process.cwd(), "logs");

    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    logFilePath = path.join(logsDir, "access.log");
}

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

        // local development logging
        if (isDev) {
            fs.appendFile(logFilePath, log, (err) => {
                if (err) {
                    console.error("Logger Error:", err);
                }
            });
        }

        // vercel logs
        console.log(log);

    });

    next();
};

export default logger;