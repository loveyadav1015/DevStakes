import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import SyllabusPage from './pages/SyllabusPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NewNodePage from './pages/NewNodePage';
import NewProjectPage from './pages/NewProjectPage';

/* ──────────────────────────────────────────────────────────
   App — Root component with routing
   All pages render inside the DashboardLayout shell
   ────────────────────────────────────────────────────────── */

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/syllabus/new" element={<NewNodePage />} />
          <Route path="/project/new" element={<NewProjectPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
