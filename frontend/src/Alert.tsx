import { useQuery } from "@tanstack/react-query";
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

type AlertData = {
  materialCategories: MaterialCategory[];
  productionScales: ProductionScale[];
  urgencies: Urgency[];
  clientTypes: ClientType[];
  deliveryMethods: DeliveryMethod[];
};

async function fetchCategories(): Promise<FetchCategoriesResponse> {
  const response = await fetch(`http://localhost:3000/api/alert`);

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
            type="checkbox"
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

function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const alertData: AlertData = {
    materialCategories: formData.getAll(
      "materialCategories",
    ) as MaterialCategory[],
    productionScales: formData.getAll("productionScales") as ProductionScale[],
    urgencies: formData.getAll("urgencies") as Urgency[],
    clientTypes: formData.getAll("clientTypes") as ClientType[],
    deliveryMethods: formData.getAll("deliveryMethods") as DeliveryMethod[],
  };
}

export default function Alert() {
  const { data, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {Object.entries(data ?? {}).map(([name, items]) => (
          <CategoryComponent name={name} item={items} key={name} />
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
