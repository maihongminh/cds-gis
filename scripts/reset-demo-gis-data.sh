#!/usr/bin/env bash
set -euo pipefail

APP_URL="${CDS_GIS_URL:-http://127.0.0.1:3000}"
API_URL="${APP_URL%/}/demo-data-api/reset"
RESPONSE_FILE="$(mktemp)"

cleanup() {
  rm -f "${RESPONSE_FILE}"
}
trap cleanup EXIT

if [[ "${1:-}" != "--yes" ]]; then
  echo "CẢNH BÁO: thao tác này sẽ xóa toàn bộ object POC do người dùng tạo"
  echo "và khôi phục dữ liệu về đúng nội dung demo-gis-seed hiện tại."
  read -r -p "Nhập RESET để tiếp tục: " CONFIRMATION
  if [[ "${CONFIRMATION}" != "RESET" ]]; then
    echo "Đã hủy reset, dữ liệu không thay đổi."
    exit 0
  fi
fi

echo "Đang reset toàn bộ dữ liệu GIS demo..."

if ! curl -fsS \
  --request POST \
  --output "${RESPONSE_FILE}" \
  "${API_URL}"; then
  echo "Lỗi: không gọi được API reset tại ${API_URL}." >&2
  echo "Hãy bảo đảm CDS GIS đang chạy rồi thử lại." >&2
  exit 1
fi

node --input-type=module -e '
  import fs from "node:fs";

  const response = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  if (response.error) {
    throw new Error(response.error);
  }

  console.log("Reset hoàn tất.");
  console.log(`- Phiên bản seed: ${response.demoSeedVersion}`);
  console.log(`- Tổng số object seed: ${response.features.length}`);
' "${RESPONSE_FILE}"
