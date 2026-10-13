import { formatTurkishDate } from "@/lib/utils";
import { DEPARTMENT_LABELS, type DepartmentId } from "@/types";

export type AppointmentCardData = {
  appointmentId: string;
  department: DepartmentId;
  specialistName: string;
  date: string;
  startTime: string;
  endTime: string;
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function downloadAppointmentCardPng(data: AppointmentCardData): boolean {
  try {
    const width = 720;
    const height = 460;
    const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

  ctx.scale(scale, scale);
  ctx.fillStyle = "#F8FAFC";
  ctx.fillRect(0, 0, width, height);

  roundRect(ctx, 24, 24, width - 48, height - 48, 20);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#E2ECE9";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#162536";
  ctx.fillRect(24, 24, width - 48, 72);
  ctx.fillStyle = "#4A6B5D";
  ctx.fillRect(24, 90, width - 48, 8);
  ctx.fillStyle = "#A8C5B5";
  ctx.fillRect(24, 98, 96, 4);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 15px Source Sans 3, Segoe UI, sans-serif";
  ctx.fillText("T.C. Atakum Belediyesi", 48, 54);
  ctx.font = "700 20px Source Serif 4, Georgia, serif";
  ctx.fillText("Randevu Onay Kartı", 48, 82);

  ctx.fillStyle = "#0F172A";
  ctx.font = "600 13px Source Sans 3, Segoe UI, sans-serif";
  ctx.fillText("RANDEVU KODU", 48, 140);
  ctx.fillStyle = "#4A6B5D";
  ctx.font = "700 28px IBM Plex Mono, ui-monospace, monospace";
  ctx.fillText(data.appointmentId, 48, 176, width - 96);

  const rows = [
    ["Uzman", data.specialistName],
    ["Hizmet", DEPARTMENT_LABELS[data.department]],
    ["Tarih", formatTurkishDate(data.date)],
    ["Saat", `${data.startTime} – ${data.endTime}`],
  ];

  rows.forEach((row, index) => {
    const y = 220 + index * 42;
    ctx.fillStyle = "#64748B";
    ctx.font = "600 13px Source Sans 3, Segoe UI, sans-serif";
    ctx.fillText(row[0], 48, y);
    ctx.fillStyle = "#0F172A";
    ctx.font = "700 16px Source Sans 3, Segoe UI, sans-serif";
    ctx.fillText(row[1], 160, y, width - 208);
  });

  ctx.fillStyle = "#64748B";
  ctx.font = "600 12px Source Sans 3, Segoe UI, sans-serif";
  ctx.fillText("T.C. Atakum Belediyesi — Sağlık Portalı", 48, 400);

  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = `atakum-randevu-${data.appointmentId}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
  } catch {
    return false;
  }
}

export function printAppointmentCard() {
  window.print();
}
