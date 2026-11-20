import prisma from "../config/db.js";
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

export const updateCategories = async (
  req: Request<{}, unknown, CategoriesResponse>,
  res: Response,
) => {
  try {
    const alertData = {
      materialCategories: req.body.materialCategories,
      productionScales: req.body.productionScales,
      urgencies: req.body.urgencies,
      clientTypes: req.body.clientTypes,
      deliveryMethods: req.body.deliveryMethods,
    };
    const companyId = "1";

    const alert = await prisma.alertSettings.upsert({
      where: { companyId },
      create: { companyId, ...alertData },
      update: alertData,
    });

    res.json({ alert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas zapisywania danych" });
  }
};
