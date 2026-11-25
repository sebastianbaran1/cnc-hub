import App from "./App.tsx";
import Listings from "./Listings.tsx";
import Alert from "./Alert.tsx";
import Listing from "./Listing.tsx";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Listings />,
      },
      { path: "/alert", element: <Alert /> },
      { path: "/listing", element: <Listing /> },
    ],
  },
];

export default routes;
