import "dotenv/config";

import { app } from "./server/index.js";

app.listen(Number(process.env.PORT) || 3000);
