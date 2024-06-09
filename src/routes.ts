import { IncomingMessage, ServerResponse } from "http";
import { parse } from "querystring";
import dotenv from "dotenv";
import PayerClient from "./payer-client";
import { generateSignature } from "./utils";
import { renderFile } from "ejs";
import { join } from "path";

dotenv.config();

const secret = process.env.PAYER_API_SECRET || "";
const apiClient = new PayerClient(
  process.env.PAYER_API_HOST || "https://api.nonprod.payer.app"
);

export const handleForm = async (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    // Parse the request body
    const { amount, title, reference } = parse(body);

    // Generate the HMAC signature
    const signature = generateSignature(
      Number(amount),
      reference as string,
      secret
    );

    // Create a checkout session
    try {
      const response = await apiClient.createCheckoutSession({
        title: title as string,
        amount: Number(amount),
        reference: reference as string,
        signature,
      });

      // The response contains the URL to redirect the user to
      res.writeHead(302, { Location: response.url.trim() });
      res.end();
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  });
};

export const handleResponse = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    // Parse the response body and extract the relevant fields
    const { status, reference, remarks, signature } = parse(body);

    // Render the response page
    const templatePath = join(__dirname, "views", "response.ejs");
    renderFile(
      templatePath,
      { data: { status, reference, remarks, signature } },
      (err, str) => {
        if (err) {
          console.log(err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
      }
    );
  });
};

export const renderFormPage = (res: ServerResponse) => {
  const templatePath = join(__dirname, "views", "form.ejs");
  renderFile(templatePath, {}, (err, str) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(str);
  });
};
