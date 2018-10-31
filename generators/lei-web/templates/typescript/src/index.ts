/**
 * @file 入口文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import app from "./app";
import { config, mysql, redis } from "./global";
const pjson = require("../package.json");
const projectName = pjson.name;

const PORT = config.port || process.env.PORT || 3001;
const HOST = config.host || process.env.HOST || "127.0.0.1";
app.listen({ port: PORT, host: HOST }, () => {
  // tslint:disable-next-line no-console
  console.log(`${projectName} is listening on ${HOST}:${PORT}`);
  if (process.send) {
    process.send("ready");
  }
});

process.on("uncaughtException", err => {
  // tslint:disable-next-line no-console
  console.log((err && err.stack) || err);
  process.exit(-1);
});

process.on("unhandledRejection", err => {
  // tslint:disable-next-line no-console
  console.error("unhandledRejection", err);
});

// Graceful shutdown
process.on("SIGINT", () => {
  // Clean up other resources like DB connections
  function cleanUp(cb?: any) {
    redis && redis.disconnect();
    if (mysql) {
      mysql.end(cb);
    } else {
      cb();
    }
  }

  app.server.close(() => {
    cleanUp(() => {
      process.exit();
    });
  });

  // Force close server after 5secs
  setTimeout(e => {
    // tslint:disable-next-line no-console
    console.log("Forcing server close !!!", e);
    cleanUp();
    process.exit(1);
  }, 5000);
});

