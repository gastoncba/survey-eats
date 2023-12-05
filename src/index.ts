import express, { Request, Response } from "express";
import cors from "cors";

import { routerApi } from "./routes";
import { logError, boomErrorHandler, errorHandler } from "./middleware/error.handler";
import { initialize } from "./database/database";
import { initializeStrategies } from "./utils/auth";

(async () => {
  try {
    await initialize();
    console.log("Conexión exitosa!");
  } catch (error) {
    console.log("Error en la conexión:", error);
  }
})();

const app = express();
app.use(express.json());
app.use(cors());

initializeStrategies();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Survey Eats!");
});

routerApi(app);
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(8080, () => {});
