import prisma from "../config/db.js";
import type { Request, Response } from "express";
import type { Listing } from "../generated/prisma/client.js";

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
    res.status(500).json({ error: "Błąd podczas pobierania danych" });
  }
};
