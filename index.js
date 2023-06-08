import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { getPipedInstances, getInvInstances, PipedVidious, updateInstances } from './functions.js';



const port = process.env.PORT;
const publicDir = path.join(process.cwd(), 'webp');

const server = http.createServer(async (req, res) => {
  try {
    const reqPath = path.join(publicDir, req.url);

    if (req.url === '/reload') {
      const updateMessage = await updateInstances();
      res.end(updateMessage);
      return;
    }

    // Check if the requested file is a directory
    const isDirectory = (await fs.stat(reqPath)).isDirectory();

    if (isDirectory) {
      // Redirect to index.html if the requested file is a directory
      res.statusCode = 302;
      res.setHeader('Location', '/index.html');
      res.end();
      return;
    }

    // Determine if the requested file exists
    const fileExists = await fs.access(reqPath).then(() => true).catch(() => false);

    if (!fileExists) {
      // Redirect to index.html if the requested file does not exist
      res.statusCode = 302;
      res.setHeader('Location', '/index.html');
      res.end();
      return;
    }

    // Determine the MIME type of the requested file based on its extension
    const fileExtension = path.extname(reqPath);
    let mimeType = '';
    switch (fileExtension) {
      case '.html':
        mimeType = 'text/html';
        break;
      case '.css':
        mimeType = 'text/css';
        break;
      case '.js':
        mimeType = 'application/javascript';
        break;
      case '.json':
        mimeType = 'application/json';
        break;
      default:
        mimeType = 'application/octet-stream';
        break;
    }

    // Read the file contents and send them as the response
    const fileContents = await fs.readFile(reqPath);
    res.setHeader('Content-Type', mimeType);
    res.end(fileContents);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal server error');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});