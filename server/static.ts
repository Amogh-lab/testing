import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  const assetsPath = path.resolve(__dirname, "..", "assets");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files from the public directory
  app.use(express.static(distPath));
  
  // Serve static files from the assets directory
  if (fs.existsSync(assetsPath)) {
    app.use('/assets', express.static(assetsPath));
  } else {
    console.warn('Assets directory not found:', assetsPath);
  }

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
