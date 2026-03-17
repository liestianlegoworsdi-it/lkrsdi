import { TicketPriority, TicketStatus } from "./types";

export const MOCK_TICKETS: any[] = [
  {
    id: "TIC-001",
    title: "Printer di Lantai 2 Macet",
    description: "Printer HP LaserJet di departemen HR tidak bisa menarik kertas.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    requester: "Budi Santoso",
    category: "Hardware",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "TIC-002",
    title: "Lupa Password Email",
    description: "Saya tidak bisa login ke email perusahaan setelah cuti seminggu.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    requester: "Siti Aminah",
    category: "Account",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "TIC-003",
    title: "Request Instalasi Adobe Photoshop",
    description: "Butuh Photoshop untuk tim desain marketing baru.",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.LOW,
    requester: "Andi Wijaya",
    category: "Software",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "TIC-004",
    title: "Internet Lambat di Ruang Meeting",
    description: "WiFi sering putus saat sedang video conference.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.URGENT,
    requester: "Rina Kartika",
    category: "Network",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  }
];

export const CATEGORIES = ["Hardware", "Software", "Network", "Account", "Other"];
