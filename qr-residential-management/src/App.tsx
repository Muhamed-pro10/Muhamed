import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ResidentList from './components/Residents/ResidentList';
import QRScanner from './components/Scanner/QRScanner';

// Placeholder components for remaining routes
const QRCodes: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
      <p className="text-gray-600">Manage and generate QR codes for residents</p>
    </div>
    <div className="card p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">QR Code Management</h2>
      <p className="text-gray-600">This feature allows you to generate, view, and manage QR codes for all residents.</p>
    </div>
  </div>
);

const AccessLogs: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Access Logs</h1>
      <p className="text-gray-600">View detailed access history and reports</p>
    </div>
    <div className="card p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Log Viewer</h2>
      <p className="text-gray-600">This feature provides comprehensive access logs and reporting capabilities.</p>
    </div>
  </div>
);

const AddResident: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Add New Resident</h1>
      <p className="text-gray-600">Register a new resident in the system</p>
    </div>
    <div className="card p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Resident Registration Form</h2>
      <p className="text-gray-600">This feature provides a comprehensive form to add new residents with all required information.</p>
    </div>
  </div>
);

const Settings: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600">Configure system settings and preferences</p>
    </div>
    <div className="card p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">System Configuration</h2>
      <p className="text-gray-600">This feature allows administrators to configure system settings and user preferences.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/residents" element={<ResidentList />} />
          <Route path="/qr-codes" element={<QRCodes />} />
          <Route path="/scanner" element={<QRScanner />} />
          <Route path="/access-logs" element={<AccessLogs />} />
          <Route path="/add-resident" element={<AddResident />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
