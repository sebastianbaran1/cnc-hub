import prisma from "../config/db.js";
import type { Request, Response } from "express";
import type { Listing } from "../generated/prisma/client.js";
import { addListingAlertJob } from "../queues/alertQueue.js";
export const getListings = async (
  req: Request<{}, unknown, {}, { cursor?: string }>,
  res: Response<
    { nextCursor: string | null; listings: Listing[] } | { error: string }
  >,
) => {
  try {
    const cursor = req.query.cursor || undefined;
    const limit = 5;

    const listings = await prisma.listing.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: "desc" },
    });

    const lastListing = listings[listings.length - 1];
    const nextCursor =
      listings.length === limit && lastListing ? lastListing.id : null;

    res.json({ nextCursor, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas pobierania danych" });
  }
};

export const postListing = async (req: Request, res: Response) => {
  try {
    const listingData = {
      title: req.body.title,
      description: req.body.description,
      materialCategory: req.body.materialCategory,
      productionScale: req.body.productionScale,
      urgency: req.body.urgency,
      clientType: req.body.clientType,
      deliveryMethod: req.body.deliveryMethod,
      postalCode: req.body.postalCode,
      phone: req.body.phone,
      email: req.body.email,
    };

    const listing = await prisma.listing.create({ data: listingData });

    try {
      await addListingAlertJob(listing.id);
    } catch (queueError) {
      console.error(
        "Ogłoszenie zapisane, ale nie dodano do kolejki:",
        queueError,
      );
    }

    res.json({ listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas zapisywania danych" });
  }
};
