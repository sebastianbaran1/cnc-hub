import express from "express";
import cors from "cors";

import listingRoutes from "./routes/listingRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/listings", listingRoutes);
app.use("/api/alert", alertRoutes);

app.listen(PORT, () => {
  console.log(`Serwer wystartował na porcie ${PORT}`);
});
