"use client";

import Header from "./header";
import { DynamicSystemStatusDashboard } from "./systemStatus";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header />
      <DynamicSystemStatusDashboard />
      {/* Rest of your content */}
    </div>
  );
}
