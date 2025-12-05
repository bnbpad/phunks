import { app, server } from "./app";
import { open } from "./database";

open();

const port = app.get("port");
server.listen(port, () => console.log(`Server started on port ${port}`));
