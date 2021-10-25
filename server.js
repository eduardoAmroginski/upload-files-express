import express, { request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

/// Solução para captura do __dirname usando ES6
const __dirname = path.resolve();
//Fim da solução

const app = express();

const host = "localhost";
const port = 3000;

app.use(express.json());
//Faz o papel do BodyParser
app.use(express.urlencoded({ extended: true }));

const verifyFolderUploads = () => {
  const dir = "./uploads";
  console.log(!fs.existsSync(dir));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log("Pasta de Uploads não existe, por isso foi criada");
  } else {
    console.log("Pasta de Uploads já Existe");
  }
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.post("/upload", upload.single("file"), (request, response, next) => {
  const file = request.file;

  if (!file) {
    const err = new Error("Por favor, selecione um arquivo");
    err.httpStatusCode = 400;
    return next(err);
  }
  response.send(file);
});

app.listen(port, host, () => {
  verifyFolderUploads();
  console.log(`Server Running on: http://${host}:${port}`);
});
