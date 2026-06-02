import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { FeaturesPage } from "./pages/FeaturesPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { TemplateDetailPage } from "./pages/TemplateDetailPage";
import { PricingPage } from "./pages/PricingPage";
import { FAQPage } from "./pages/FAQPage";
import { GiftWizard } from "./pages/GiftWizard";

export const router = createBrowserRouter([
  {
    path: "create",
    Component: GiftWizard,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "features", Component: FeaturesPage },
      { path: "templates", Component: TemplatesPage },
      { path: "templates/:slug", Component: TemplateDetailPage },
      { path: "pricing", Component: PricingPage },
      { path: "faq", Component: FAQPage },
    ],
  },
]);
