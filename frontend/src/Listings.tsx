import { useInfiniteQuery } from "@tanstack/react-query";
import type { Listing } from "../../backend/src/generated/prisma/client.js";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

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
    const data: { error: string } = await response.json();
    throw new Error(data.error);
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return response.json();
}

function ListingComponent({ listing, uniqueRef }: ListingComponentType) {
  const [isClicked, setIsClicked] = useState(false);
  const toggle = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <div
      ref={uniqueRef}
      data-id={listing.id}
      style={{
        border: "1px solid black",
        margin: "10px",
        padding: "10px",
        height: !isClicked ? "230px" : "480px",
      }}
      onClick={toggle}
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
  const seenListings = useRef<string[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isScrollTop, setIsScrollTop] = useState(false);

  const virtualizer = useVirtualizer({
    count: allListings.length,
    estimateSize: () => 270,
    getScrollElement: () => scrollRef.current,
  });

  const virtualizedItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      {
        root: scrollRef.current,
      },
    );

    if (everyRef.current[allListings.length - 1]) {
      observer.observe(everyRef.current[allListings.length - 1]!);
    }
    return () => observer.disconnect();
  }, [virtualizedItems, allListings.length, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    setIsScrollTop(!everyRef.current[0]);
  }, [virtualizedItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            seenListings.current.push(entry.target.getAttribute("data-id")!);
            observer.unobserve(entry.target);
            console.log(seenListings);
          }
        });
      },
      { root: scrollRef.current },
    );

    everyRef.current.forEach((listing) => {
      if (
        listing &&
        !seenListings.current.includes(listing.getAttribute("data-id")!)
      )
        observer.observe(listing);
    });

    return () => observer.disconnect();
  }, [allListings.length, virtualizedItems]);

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
            zIndex: "2",
          }}
          type="button"
          onClick={() => {
            scrollRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          Idź na góre
        </button>
      )}

      <div
        ref={scrollRef}
        style={{
          height: "70vh",
          width: "90vw",
          overflow: "auto",
          margin: "100px 0 0 0 ",
          border: "2px solid green",
        }}
      >
        <div
          style={{
            position: "relative",
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          <div
            style={{
              position: "absolute",
              transform: `translateY(${virtualizedItems[0]?.start ?? 0}px)`,
              width: "100%",
            }}
          >
            {virtualizedItems.map((vItem) => {
              const listing = allListings[vItem.index];
              return (
                <div
                  key={vItem.key}
                  data-index={vItem.index}
                  ref={virtualizer.measureElement}
                >
                  <ListingComponent
                    key={listing.id}
                    listing={listing}
                    uniqueRef={(el) => {
                      everyRef.current[vItem.index] = el;
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {isFetchingNextPage && (
          <div
            style={{
              border: "1px solid black",
              margin: "50px 0 0 0",
              padding: "10px",
              height: "230px",
              width: "80vw",
            }}
          >
            Wczytywanie kolejnych ogłoszeń...
          </div>
        )}
      </div>
    </>
  );
}
