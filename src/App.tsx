/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { CheckInScreen } from './components/checkin/CheckInScreen';
import { WarrantiesScreen } from './components/warranties/WarrantiesScreen';
import { OrdersKanbanScreen } from './components/orders/OrdersKanbanScreen';
import { TeamScreen } from './components/team/TeamScreen';
import { UiKitScreen } from './components/styleguide/UiKitScreen';
import { PrintableTicketModal } from './components/ticket/PrintableTicketModal';
import { ExportModal } from './components/export/ExportModal';
import {
  INITIAL_CLIENT,
  INITIAL_MOTORCYCLE,
  MECHANICS,
  INITIAL_CHECKIN_PHOTOS,
  INITIAL_WARRANTY_ITEMS,
  INITIAL_ORDERS,
} from './data/mockData';
import { WorkOrder, WarrantyItem, WarrantyClaim } from './types/workshop';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('checkin');
  const [orders, setOrders] = useState<WorkOrder[]>(INITIAL_ORDERS);
  const [warranties, setWarranties] = useState<WarrantyItem[]>(INITIAL_WARRANTY_ITEMS);
  const [activeTicketOrder, setActiveTicketOrder] = useState<WorkOrder | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // When a new order is generated in Check-in screen
  const handleOrderCreated = (newOrder: WorkOrder) => {
    // Add or update in orders list
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
    setActiveTicketOrder(newOrder);
  };

  // When a warranty claim is filed (RF03)
  const handleRadicarGarantia = (claim: WarrantyClaim) => {
    // Also create a priority warranty work order in the shop
    const warrantyWorkOrder: WorkOrder = {
      id: `#GAR-${claim.orderNumber.replace('#OS-', '')}`,
      client: {
        id: 'CLI-GAR',
        name: 'Carlos Pérez',
        documentId: '1020304050',
        phone: '310 987 6543',
        email: 'carlos.perez@email.com',
      },
      motorcycle: INITIAL_MOTORCYCLE,
      odometerKm: 24150,
      fuelLevel: '3/4',
      issuesReport: `[GARANTÍA RF03 sobre ${claim.orderNumber}]: ${claim.reason}`,
      symptoms: ['Revisión Garantía', 'Prioridad Bahía 1'],
      assignedMechanicId: 'MEC-01',
      priority: 'Urgente',
      serviceType: 'Revisión Garantía',
      photos: INITIAL_CHECKIN_PHOTOS,
      damageMarkers: [],
      checklist: { helmet: false, keys: true, documents: true, tools: false, mirrors: true },
      advisor: 'Andrés G',
      status: 'En Diagnóstico',
      createdAt: claim.createdAt,
      estimatedDelivery: '2026-11-08 12:00',
      estimatedCost: 0,
    };

    setOrders((prev) => [warrantyWorkOrder, ...prev]);
  };

  // Update order status in Kanban
  const handleUpdateOrderStatus = (orderId: string, newStatus: WorkOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const activeWarrantiesCount = warranties.filter((w) => w.status === 'vigente').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800">
      {/* Deep Slate Sidebar (#0F172A) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        advisorName="Andrés G"
        activeOrdersCount={orders.length}
        activeWarrantiesCount={activeWarrantiesCount}
      />

      {/* Main View Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Navbar adhering to Top Bar Contract */}
        <TopNavbar
          currentTab={activeTab}
          onTabChange={setActiveTab}
          onOpenExport={() => setExportModalOpen(true)}
          advisorName="Andrés G"
          orderNumber="#OS-1045"
        />

        {/* View Router */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'checkin' && (
            <CheckInScreen
              initialClient={INITIAL_CLIENT}
              initialMotorcycle={INITIAL_MOTORCYCLE}
              mechanics={MECHANICS}
              initialPhotos={INITIAL_CHECKIN_PHOTOS}
              onOrderCreated={handleOrderCreated}
              onNavigateToWarranties={() => setActiveTab('warranties')}
              advisorName="Andrés G"
            />
          )}

          {activeTab === 'warranties' && (
            <WarrantiesScreen
              warranties={warranties}
              onNavigateToCheckIn={() => setActiveTab('checkin')}
              onRadicarGarantia={handleRadicarGarantia}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersKanbanScreen
              orders={orders}
              mechanics={MECHANICS}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onNewOrderClick={() => setActiveTab('checkin')}
            />
          )}

          {activeTab === 'team' && (
            <TeamScreen mechanics={MECHANICS} orders={orders} />
          )}

          {activeTab === 'uikit' && (
            <UiKitScreen onOpenExport={() => setExportModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Printable Workshop Check-in Ticket Modal */}
      <PrintableTicketModal
        isOpen={!!activeTicketOrder}
        onClose={() => setActiveTicketOrder(null)}
        order={activeTicketOrder}
      />

      {/* Export & Download Center Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onPrintTicket={() => setActiveTicketOrder(orders[0])}
      />
    </div>
  );
}
