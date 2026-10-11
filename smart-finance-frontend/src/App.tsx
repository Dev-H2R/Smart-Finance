import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Recurring from "./pages/Recurring";
import Layout from "./components/Layout";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/transactions"
          element={
            <Layout title="Transactions">
              <Transactions />
            </Layout>
          }
        />
        <Route
          path="/budgets"
          element={
            <Layout title="Budgets">
              <Budgets />
            </Layout>
          }
        />
        <Route
          path="/goals"
          element={
            <Layout title="Goals">
              <Goals />
            </Layout>
          }
        />
        <Route
          path="/recurring"
          element={
            <Layout title="Recurring Transactions">
              <Recurring />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  );
}

export default App;