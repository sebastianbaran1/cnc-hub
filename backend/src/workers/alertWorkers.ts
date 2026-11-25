import { Worker, Job } from "bullmq";
import { createRedisConnection } from "../config/redis.js";

const worker = new Worker(
  "alerts",
  async (job: Job<{ listingId: string }>) => {
    console.log("dodano", job.data.listingId);
  },
  {
    connection: createRedisConnection(),
  },
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

console.log("Worker started!");
