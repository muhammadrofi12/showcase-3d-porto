import { defineConfig } from "vite";
import type { Plugin, Connect } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";

function attachRofiullPortfolioMiddleware(middlewares: Connect.Server) {
  const rofiullRoot = path.resolve(process.cwd(), "../rofiull");
  const apiPortfolioFile = path.join(rofiullRoot, "api", "portfolio.js");
  const assetsDir = path.join(rofiullRoot, "src", "assets", "portofolio");

  middlewares.use(
    "/assets/portofolio",
    async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const cleanUrl = (req.url || "").split("?")[0];
      const filePath = path.join(assetsDir, decodeURIComponent(cleanUrl));
      if (
        fs.existsSync(assetsDir) &&
        fs.existsSync(filePath) &&
        fs.statSync(filePath).isFile()
      ) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          ".webp": "image/webp",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".svg": "image/svg+xml",
        };
        if (mimeTypes[ext]) {
          res.setHeader("Content-Type", mimeTypes[ext]);
        }
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // Fallback: Proxy ke produksi jika ../rofiull tidak ada di filesystem (misal di runner CI/CD)
      try {
        const remoteUrl = `https://rofiull.vercel.app/assets/portofolio${cleanUrl}`;
        const response = await fetch(remoteUrl);
        if (response.ok) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          const cType = response.headers.get("content-type");
          if (cType) res.setHeader("Content-Type", cType);
          const buf = await response.arrayBuffer();
          res.end(Buffer.from(buf));
          return;
        }
      } catch {
        // Abaikan dan teruskan ke middleware berikutnya jika remote tidak terjangkau
      }

      next();
    },
  );

  middlewares.use(
    "/api/portfolio",
    async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (fs.existsSync(apiPortfolioFile)) {
        const originalCwd = process.cwd();
        try {
          const parsedUrl = new URL(
            req.url || "",
            `http://${req.headers.host || "127.0.0.1:5173"}`,
          );
          const query = Object.fromEntries(parsedUrl.searchParams.entries());
          const fileUrl = pathToFileURL(apiPortfolioFile).href;
          const mod = (await import(fileUrl)) as {
            default: (
              reqObj: Record<string, unknown>,
              resObj: Record<string, unknown>,
            ) => Promise<void>;
          };

          const mockRes = {
            setHeader: (k: string, v: string) => res.setHeader(k, v),
            status: (code: number) => {
              res.statusCode = code;
              return mockRes;
            },
            json: (data: unknown) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            },
            end: () => res.end(),
          };

          process.chdir(rofiullRoot);
          await mod.default(
            {
              method: req.method,
              headers: req.headers,
              query,
            },
            mockRes,
          );
          return;
        } catch (err) {
          console.error("[3D Gallery Dev API Error]:", err);
        } finally {
          process.chdir(originalCwd);
        }
      }

      // Fallback: Proxy ke https://rofiull.vercel.app/api/portfolio jika ../rofiull tidak ada (di CI/CD)
      try {
        const remoteUrl = `https://rofiull.vercel.app/api/portfolio${req.url || ""}`;
        const response = await fetch(remoteUrl);
        if (response.ok) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Content-Type", "application/json");
          const json = await response.text();
          res.end(json);
          return;
        }
      } catch {
        // Abaikan jika fetch remote gagal
      }

      next();
    },
  );
}

function rofiullPortfolioApiPlugin(): Plugin {
  return {
    name: "rofiull-portfolio-api",
    configureServer(server) {
      attachRofiullPortfolioMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachRofiullPortfolioMiddleware(server.middlewares);
    },
  };
}

export default defineConfig({
  plugins: [react(), rofiullPortfolioApiPlugin()],
  build: { chunkSizeWarningLimit: 1200 },
});
