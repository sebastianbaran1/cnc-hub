import App from "./App.tsx";
import Listings from "./Listings.tsx";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Listings />,
      },
    ],
  },
];

export default routes;
