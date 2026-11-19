import App from "./App.tsx";
import Listings from "./Listings.tsx";
import Alert from "./Alert.tsx";
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
    ],
  },
];

export default routes;
