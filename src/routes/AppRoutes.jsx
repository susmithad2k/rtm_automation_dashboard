import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Traceability from '../pages/Traceability';
import ImpactAnalysis from '../pages/ImpactAnalysis';
import Reports from '../pages/Reports';
import Ingestion from '../pages/Ingestion';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/traceability" element={<Traceability />} />
      <Route path="/impact-analysis" element={<ImpactAnalysis />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/ingestion" element={<Ingestion />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;