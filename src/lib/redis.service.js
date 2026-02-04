/* eslint-disable no-console */
import { createClient } from "redis";

export class RedisService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    console.log("REDIS SERVER:", process.env.REDIS_SERVER);

    this._client.on("error", (err) => console.error("Redis Client Error", err));
    this._client.connect();
  }
}
