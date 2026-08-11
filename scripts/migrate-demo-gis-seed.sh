#!/usr/bin/env bash
set -euo pipefail

APP_URL="${CDS_GIS_URL:-http://127.0.0.1:3000}"
API_URL="${APP_URL%/}/demo-data-api/migrate"
RESPONSE_FILE="$(mktemp)"

cleanup() {
  rm -f "${RESPONSE_FILE}"
}
trap cleanup EXIT

echo "Đang cập nhật dữ liệu demo từ src/data/demo-gis-seed.ts..."
echo "Các object do người dùng tạo sẽ được giữ nguyên."

if ! curl -fsS \
  --request POST \
  --output "${RESPONSE_FILE}" \
  "${API_URL}"; then
  echo "Lỗi: không gọi được API migration tại ${API_URL}." >&2
  echo "Hãy bảo đảm CDS GIS đang chạy rồi thử lại." >&2
  exit 1
fi

node --input-type=module -e '
  import fs from "node:fs";

  const response = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  if (response.error) {
    throw new Error(response.error);
  }

  console.log("Migration hoàn tất.");
  console.log(`- Phiên bản seed: ${response.demoSeedVersion}`);
  console.log(`- Seed đã cập nhật: ${response.replacedSeedCount} object`);
  console.log(`- Object người dùng được giữ: ${response.preservedFeatureCount}`);
  console.log(`- Tổng số object: ${response.totalFeatureCount}`);

  if (response.skippedIdCollisionCount > 0) {
    console.log(
      `- Object bỏ qua do trùng ID seed: ${response.skippedIdCollisionCount}`,
    );
  }
' "${RESPONSE_FILE}"
