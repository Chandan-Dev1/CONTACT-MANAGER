import express from "express";
import cors from "cors";
import ContactRouter from "./routers/contact.router.js";

const app = express();

app.use(cors({
    origin: "https://contact-manager-nine-teal.vercel.app",
    credentials: true
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Contact Manager API is running"
    });
});

app.use("/api/contact", ContactRouter);

export default app;