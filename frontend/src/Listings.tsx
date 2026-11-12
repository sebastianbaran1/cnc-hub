import { useInfiniteQuery } from "@tanstack/react-query";
import type { Listing } from "../../backend/src/generated/prisma/client.js";
import { useEffect, useRef, useState } from "react";

type FetchListingsResponse = { nextCursor: string | null; listings: Listing[] };
type ListingComponentType = {
  listing: Listing;
  uniqueRef: (el: HTMLDivElement | null) => void;
};

async function fetchListings({
  pageParam,
}: {
  pageParam: string;
}): Promise<FetchListingsResponse> {
  const response = await fetch(
    `http://localhost:3000/api/listings?cursor=${pageParam}`,
  );
  if (!response.ok) {
    throw new Error("Nie udało się pobrać ogłoszeń");
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return response.json();
}

function ListingComponent({ listing, uniqueRef }: ListingComponentType) {
  return (
    <div
      ref={uniqueRef}
      style={{
        border: "1px solid black",
        margin: "10px",
        padding: "10px",
        height: "230px",
      }}
    >
      <p>{listing.id}</p>
      <p>{listing.title}</p>
      <p>{listing.description}</p>
      <p>{listing.materialCategory}</p>
      <p>{listing.productionScale}</p>
      <p>{listing.phone}</p>
    </div>
  );
}

export default function Listings() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allListings = data?.pages.flatMap((page) => page.listings) ?? [];

  const everyRef = useRef<(HTMLDivElement | null)[]>([]);
  const seenListings = useRef<Element[]>([]);

  const [isScrollTop, setIsScrollTop] = useState(false);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      {
        rootMargin: "300px",
      },
    );

    if (everyRef.current[allListings.length - 1]) {
      observer.observe(everyRef.current[allListings.length - 1]!);
    }
    return () => observer.disconnect();
  }, [allListings.length, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsScrollTop(!entries[0].isIntersecting);
      },
      {
        rootMargin: "300px",
      },
    );

    if (everyRef.current[0]) {
      observer.observe(everyRef.current[0]);
    }
    return () => observer.disconnect();
  }, [allListings.length]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(entry.target.textContent);
          seenListings.current.push(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    everyRef.current.forEach((listing) => {
      if (listing && !seenListings.current.includes(listing))
        observer.observe(listing);
    });

    return () => observer.disconnect();
  }, [allListings.length]);

  if (isLoading) return <p>Ładowanie ogłoszeń...</p>;
  if (isError) return <p>Wystąpił błąd: {error.message}</p>;

  return (
    <>
      {isScrollTop && (
        <button
          style={{
            position: "fixed",
            top: "100px",
            right: "100px",
            padding: "10px",
          }}
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          Idź na góre
        </button>
      )}
      {allListings.map((listing, index) => {
        return (
          <ListingComponent
            key={listing.id}
            listing={listing}
            uniqueRef={(el) => {
              everyRef.current[index] = el;
            }}
          />
        );
      })}
      {isFetchingNextPage && (
        <div
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
            height: "230px",
          }}
        >
          Wczytywanie kolejnych ogłoszeń...
        </div>
      )}
    </>
  );
}
