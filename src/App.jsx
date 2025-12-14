import "./App.css";
import React from "react";
import { Layout } from "antd";
import AppHeader from "./components/layouts/AppHeader/AppHeader";
import AppSider from "./components/layouts/AppSider/AppSider";
import AppContent from "./components/layouts/AppContent/AppContent";

export default function App() {
  return (
    <Layout>
      <AppHeader />
      <Layout>
        <AppSider />
        <AppContent />
      </Layout>
    </Layout>
  );
}
