import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { DocumentTitle } from "@/components/layout/DocumentTitle";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { QueryProvider } from "@/providers/QueryProvider";
import { AccessibilityProvider } from "@/providers/AccessibilityProvider";
import { ServiceAtmosphereProvider } from "@/providers/ServiceAtmosphereProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";

export function AppShell() {
  return (
    <QueryProvider>
      <AccessibilityProvider>
        <ServiceAtmosphereProvider>
          <ToastProvider>
            <AuthProvider>
              <ScrollToTop />
              <DocumentTitle />
              <div className="flex min-h-[100dvh] min-h-screen flex-1 flex-col">
                <SkipToContent />
                <Header />
                <main
                  id="ana-icerik"
                  tabIndex={-1}
                  className="shell-pad-x mx-auto w-full min-w-0 max-w-[85rem] flex-1 overflow-x-clip pb-6 focus:outline-none md:pb-8"
                >
                  <Outlet />
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </ToastProvider>
        </ServiceAtmosphereProvider>
      </AccessibilityProvider>
    </QueryProvider>
  );
}
