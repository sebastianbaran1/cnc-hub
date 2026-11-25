import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis.js";

export const alertQueue = new Queue("alerts", {
  connection: createRedisConnection(),
});

export async function addListingAlertJob(listingId: string) {
  await alertQueue.add("listingAlert", { listingId });
  console.log("kolejka dodano");
}
