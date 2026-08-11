#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
APP_PORT="${CDS_GIS_PORT:-3000}"
APP_HOST="127.0.0.1"
APP_PID=""
APP_LOG="/tmp/cds-gis-public.log"

cleanup() {
  if [[ -n "${APP_PID}" ]] && kill -0 "${APP_PID}" 2>/dev/null; then
    echo
    echo "Đang dừng CDS GIS (PID: ${APP_PID})..."
    kill "${APP_PID}" 2>/dev/null || true
    wait "${APP_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if [[ ! "${APP_PORT}" =~ ^[0-9]+$ ]] ||
  ((APP_PORT < 1024 || APP_PORT > 65535)); then
  echo "Lỗi: CDS_GIS_PORT phải là số từ 1024 đến 65535." >&2
  exit 1
fi

if [[ ! -d "${APP_DIR}" ]]; then
  echo "Lỗi: không tìm thấy project tại ${APP_DIR}." >&2
  exit 1
fi

if [[ ! -x "${APP_DIR}/node_modules/.bin/next" ]]; then
  echo "Lỗi: project chưa có dependencies." >&2
  echo "Hãy chạy: cd ${APP_DIR} && npm ci" >&2
  exit 1
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "Lỗi: cloudflared chưa được cài đặt trên WSL." >&2
  exit 1
fi

if ss -ltn | awk '{print $4}' | awk -F: -v port="${APP_PORT}" '$NF == port { found = 1 } END { exit !found }'; then
  echo "Lỗi: cổng ${APP_PORT} đang được một process khác sử dụng." >&2
  echo "Bạn có thể đổi cổng, ví dụ: CDS_GIS_PORT=3100 $0" >&2
  exit 1
fi

cd "${APP_DIR}"

echo "Đang build CDS GIS ở chế độ production..."
npm run build

echo "Đang khởi động CDS GIS tại http://${APP_HOST}:${APP_PORT}..."
: >"${APP_LOG}"
"${APP_DIR}/node_modules/.bin/next" start \
  --hostname "${APP_HOST}" \
  --port "${APP_PORT}" \
  >"${APP_LOG}" 2>&1 &
APP_PID=$!

echo "Đang chờ CDS GIS sẵn sàng..."
APP_READY=false
for _ in {1..60}; do
  if ! kill -0 "${APP_PID}" 2>/dev/null; then
    echo "Lỗi: CDS GIS đã dừng trong lúc khởi động." >&2
    tail -n 30 "${APP_LOG}" >&2 || true
    exit 1
  fi

  if curl -fsS "http://${APP_HOST}:${APP_PORT}" >/dev/null 2>&1; then
    APP_READY=true
    break
  fi
  sleep 1
done

if [[ "${APP_READY}" != "true" ]]; then
  echo "Lỗi: CDS GIS không sẵn sàng sau 60 giây." >&2
  tail -n 30 "${APP_LOG}" >&2 || true
  exit 1
fi

echo "CDS GIS đã sẵn sàng."
echo "Log ứng dụng: ${APP_LOG}"
echo "Đang tạo Cloudflare Quick Tunnel..."
echo "Hãy chia sẻ đường dẫn https://*.trycloudflare.com được in bên dưới."
echo "Nhấn Ctrl+C để dừng tunnel và CDS GIS."

cloudflared tunnel --url "http://${APP_HOST}:${APP_PORT}"
