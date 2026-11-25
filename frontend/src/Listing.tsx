import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MaterialCategory,
  ProductionScale,
  Urgency,
  ClientType,
  DeliveryMethod,
} from "../../backend/src/generated/prisma/client.js";

type FetchCategoriesResponse = {
  materialCategories: MaterialCategory[];
  productionScales: ProductionScale[];
  urgencies: Urgency[];
  clientTypes: ClientType[];
  deliveryMethods: DeliveryMethod[];
};

type CategoryComponentType = {
  name: string;
  item: string[];
};

type ListingData = {
  title: string;
  description: string;
  materialCategory: MaterialCategory;
  productionScale: ProductionScale;
  urgency: Urgency;
  clientType: ClientType;
  deliveryMethod: DeliveryMethod;
  postalCode: string;
  phone: string;
  email: string;
};

async function fetchCategories(): Promise<FetchCategoriesResponse> {
  const response = await fetch(`http://localhost:3000/api/alert`);

  if (!response.ok) {
    const data: { error: string } = await response.json();
    throw new Error(data.error);
  }

  return response.json();
}

async function addListing(listingData: ListingData) {
  const response = await fetch(`http://localhost:3000/api/listings`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const data: { error: string } = await response.json();
    throw new Error(data.error);
  }

  return response.json();
}

function CategoryComponent({ name, item }: CategoryComponentType) {
  return (
    <fieldset style={{ border: "0px" }}>
      {item.map((item1, index) => (
        <div key={index}>
          <input
            type="radio"
            name={name}
            value={item1}
            id={`${name}-${index}`}
          />
          <label htmlFor={`${name}-${index}`}>{item1}</label>
        </div>
      ))}
    </fieldset>
  );
}

export default function Listing() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const listingMutate = useMutation({
    mutationFn: addListing,
    onSuccess: (a) => console.log(a),
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const listingData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      materialCategory: formData.get("materialCategories") as MaterialCategory,
      productionScale: formData.get("productionScales") as ProductionScale,
      urgency: formData.get("urgencies") as Urgency,
      clientType: formData.get("clientTypes") as ClientType,
      deliveryMethod: formData.get("deliveryMethods") as DeliveryMethod,
      postalCode: formData.get("postalCode") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    };

    listingMutate.mutate(listingData);
  }

  if (isLoading) return <p>Ładowanie kategorii...</p>;
  if (isError) return <p>Wystąpił błąd: {error.message}</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" id="title" required />
        <label htmlFor="title">Tytuł</label>
        <input type="text" name="description" id="description" required />
        <label htmlFor="description">Opis</label>
        <input type="text" name="postalCode" id="postalCode" required />
        <label htmlFor="postalCode">Kod pocztowy</label>
        <input type="tel" name="phone" id="phone" required />
        <label htmlFor="phone">Telefon</label>
        <input type="email" name="email" id="email" required />
        <label htmlFor="email">e-mail</label>
        {Object.entries(data ?? {}).map(([name, items]) => (
          <CategoryComponent name={name} item={items} key={name} />
        ))}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
