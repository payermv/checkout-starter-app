import http from "http";
import { handleForm, handleResponse, renderFormPage } from "./routes";
import { IncomingMessage, ServerResponse } from "http";

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/") {
    renderFormPage(res);
  } else if (req.method === "POST" && req.url === "/checkout") {
    handleForm(req, res);
  } else if (req.method === "POST" && req.url === "/response") {
    handleResponse(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
};

const server = http.createServer(requestHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
