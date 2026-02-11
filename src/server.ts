import express, { Application, Request, Response } from "express";

const app: Application = express();
const port = 5000; 


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});