import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { FeaturesPage } from "./pages/FeaturesPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { TemplateDetailPage } from "./pages/TemplateDetailPage";
import { PricingPage } from "./pages/PricingPage";
import { FAQPage } from "./pages/FAQPage";
import { GiftWizard } from "./pages/GiftWizard";
import { GiftViewPage } from "./pages/GiftViewPage";
import { Admin } from "./components/admin/Admin";
import { AdminTemplatePreviewPage } from "./pages/AdminTemplatePreviewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AIChibiPage } from "./pages/AIChibiPage";
import { OrderFormPage } from "./pages/OrderFormPage";
import { PaymentPage } from "./pages/PaymentPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { TrackOrderPage } from "./pages/TrackOrderPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { RefundPolicyPage } from "./pages/RefundPolicyPage";
import { SupportCenterPage } from "./pages/SupportCenterPage";
import { TutorialsPage } from "./pages/TutorialsPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { ContactPage } from "./pages/ContactPage";

export const router = createBrowserRouter([
  {
    path: "create",
    Component: GiftWizard,
  },
  {
    path: "gift/:giftId",
    Component: GiftViewPage,
  },
  {
    path: "order",
    Component: OrderFormPage,
  },
  {
    path: "payment/:orderId",
    Component: PaymentPage,
  },
  {
    path: "order-success/:orderId",
    Component: OrderSuccessPage,
  },
  {
    path: "adminWemo",
    Component: Admin,
  },
  {
    path: "adminWemo/preview/:templateId",
    Component: AdminTemplatePreviewPage,
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
      { path: "ai-chibi", Component: AIChibiPage },
      { path: "track", Component: TrackOrderPage },
      { path: "track/:orderId", Component: TrackOrderPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "terms-of-service", Component: TermsOfServicePage },
      { path: "refund-policy", Component: RefundPolicyPage },
      { path: "support-center", Component: SupportCenterPage },
      { path: "tutorials", Component: TutorialsPage },
      { path: "about-us", Component: AboutUsPage },
      { path: "contact", Component: ContactPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
