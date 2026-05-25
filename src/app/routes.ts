import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { FeaturesPage } from "./pages/FeaturesPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { PricingPage } from "./pages/PricingPage";
import { FAQPage } from "./pages/FAQPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "features", Component: FeaturesPage },
      { path: "templates", Component: TemplatesPage },
      { path: "pricing", Component: PricingPage },
      { path: "faq", Component: FAQPage },
    ],
  },
]);
