import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";
import { ExpertsPage } from "@/pages/ExpertsPage";
import { ContactPage } from "@/pages/ContactPage";
import { BookingPage } from "@/pages/BookingPage";
import { KvkkPage } from "@/pages/KvkkPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { AdminPage } from "@/pages/AdminPage";
import { DoctorPage } from "@/pages/DoctorPage";
import { DoctorPanelPage } from "@/pages/DoctorPanelPage";
import { MyAppointmentsPage } from "@/pages/MyAppointmentsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function DepartmentBookingRedirect() {
  const { department } = useParams();
  if (department === "dietitian" || department === "psychologist") {
    return <Navigate to={`/randevu?department=${department}`} replace />;
  }
  return <Navigate to="/randevu" replace />;
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="uzmanlar" element={<ExpertsPage />} />
        <Route path="kadromuz" element={<Navigate to="/uzmanlar" replace />} />
        <Route path="iletisim" element={<ContactPage />} />
        <Route path="randevu" element={<BookingPage />} />
        <Route path="randevu/:department" element={<DepartmentBookingRedirect />} />
        <Route path="kvkk" element={<KvkkPage />} />
        <Route path="gizlilik" element={<PrivacyPage />} />
        <Route path="cerez-politikasi" element={<Navigate to="/kvkk" replace />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="doktor" element={<DoctorPage />} />
        <Route path="doktor/panel" element={<DoctorPanelPage />} />
        <Route path="doktor/dashboard" element={<Navigate to="/doktor/panel" replace />} />
        <Route path="giris" element={<Navigate to="/" replace />} />
        <Route path="randevularim" element={<MyAppointmentsPage />} />
        <Route path="randevu-sorgula" element={<Navigate to="/randevularim" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
