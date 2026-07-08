import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { AuthLayout } from "../layouts/AuthLayout";
import { EntryLayout } from "../layouts/EntryLayout";
import { RestaurantLayout } from "../layouts/RestaurantLayout";
import { LoginPage } from "../pages/auth/Login";
import { UnauthorizedPage } from "../pages/Unauthorized";
import { Funcionarios } from "../pages/admin/Funcionarios";
import { EntryPOS } from "../pages/entry/EntryPOS";
import { EntryPayment } from "../pages/entry/EntryPayment";
import { EntryReports } from "../pages/entry/EntryReports";
import { RestaurantPOS } from "../pages/restaurant/RestaurantPOS";
import { RestaurantPayment } from "../pages/restaurant/RestaurantPayment";
import { RestaurantReports } from "../pages/restaurant/RestaurantReports";
import { RestaurantStock } from "../pages/restaurant/RestaurantStock";
import { KitchenPanel } from "../pages/restaurant/KitchenPanel";

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>
    <Route element={<PrivateRoute allowedModules={["ENTRADA"]} />}>
      <Route element={<EntryLayout />}>
        <Route path="/entrada" element={<EntryPOS />} />
        <Route path="/entrada/pagamento" element={<EntryPayment />} />
        <Route
          element={
            <PrivateRoute allowedModules={["ENTRADA"]} requireRelatorios />
          }
        >
          <Route path="/entrada/relatorios" element={<EntryReports />} />
          <Route path="/entrada/funcionarios" element={<Funcionarios />} />
        </Route>
      </Route>
    </Route>
    <Route element={<PrivateRoute allowedModules={["LANCHONETE"]} />}>
      <Route element={<RestaurantLayout />}>
        <Route path="/lanchonete" element={<RestaurantPOS />} />
        <Route path="/lanchonete/estoque" element={<RestaurantStock />} />
        <Route path="/lanchonete/cozinha" element={<KitchenPanel />} />
        <Route path="/lanchonete/pagamento" element={<RestaurantPayment />} />
        <Route
          element={
            <PrivateRoute allowedModules={["LANCHONETE"]} requireRelatorios />
          }
        >
          <Route
            path="/lanchonete/relatorios"
            element={<RestaurantReports />}
          />
          <Route path="/lanchonete/funcionarios" element={<Funcionarios />} />
        </Route>
      </Route>
    </Route>

    <Route path="/sem-permissao" element={<UnauthorizedPage />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);
