import type { Request, Response } from "express";
import {
  MaterialCategory,
  ProductionScale,
  Urgency,
  ClientType,
  DeliveryMethod,
} from "../generated/prisma/client.js";

type CategoriesResponse = {
  materialCategories: MaterialCategory[];
  productionScales: ProductionScale[];
  urgencies: Urgency[];
  clientTypes: ClientType[];
  deliveryMethods: DeliveryMethod[];
};

export const getCategories = async (
  _req: Request,
  res: Response<CategoriesResponse | { error: string }>,
) => {
  try {
    res.json({
      materialCategories: Object.values(MaterialCategory),
      productionScales: Object.values(ProductionScale),
      urgencies: Object.values(Urgency),
      clientTypes: Object.values(ClientType),
      deliveryMethods: Object.values(DeliveryMethod),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się pobrać kategorii" });
  }
};
