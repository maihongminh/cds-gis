# Hướng dẫn sử dụng các script CDS GIS

Tài liệu này hướng dẫn cách chạy các script hỗ trợ trong thư mục `scripts` của dự án `cds-gis`.

## 1. Danh sách script

| Script | Mục đích | Ảnh hưởng dữ liệu |
| --- | --- | --- |
| `start-public.sh` | Build production, chạy CDS GIS và tạo Cloudflare Quick Tunnel | Không tự thay đổi dữ liệu |
| `migrate-demo-gis-seed.sh` | Cập nhật phần dữ liệu seed theo source mới nhất | Giữ lại object do người dùng tạo |
| `reset-demo-gis-data.sh` | Khôi phục toàn bộ dữ liệu về seed hiện tại | Xóa toàn bộ object POC do người dùng tạo |

## 2. Chuẩn bị lần đầu

Mở WSL và đi đến thư mục dự án:

```bash
cd /home/minhmh/tool/cds-gis
```

Cài dependencies nếu project chưa có `node_modules`:

```bash
npm ci
```

Kiểm tra Cloudflare Tunnel đã được cài đặt:

```bash
cloudflared --version
```

Kiểm tra quyền thực thi của script:

```bash
ls -l scripts/*.sh
```

Nếu script bị mất quyền thực thi sau khi sao chép file, chạy:

```bash
chmod +x scripts/*.sh
```

Các script cần các lệnh hệ thống sau:

- `bash`.
- `curl`.
- `node` và `npm`.
- `ss` — thường thuộc gói `iproute2` trên Ubuntu/WSL.
- `cloudflared` đối với `start-public.sh`.

## 3. Chạy bản public cho người dùng thử nghiệm

### Trước khi chạy

Nếu đang chạy `npm run dev` trên cổng 3000, hãy dừng process đó bằng `Ctrl+C`. Script public cần sử dụng cổng 3000 mặc định và sẽ báo lỗi nếu cổng đang bị chiếm.

### Chạy script

Từ thư mục gốc của project:

```bash
cd /home/minhmh/tool/cds-gis
./scripts/start-public.sh
```

Script thực hiện lần lượt:

1. Xác định đúng thư mục project dựa trên vị trí của script.
2. Kiểm tra dependencies, `cloudflared` và cổng chạy.
3. Chạy `npm run build` để tạo production build mới nhất.
4. Chạy Next.js tại `http://127.0.0.1:3000`.
5. Chờ ứng dụng sẵn sàng.
6. Tạo Cloudflare Quick Tunnel.
7. In đường dẫn dạng `https://...trycloudflare.com` để chia sẻ cho người dùng.

Quick Tunnel tạo URL ngẫu nhiên. URL có thể thay đổi mỗi lần dừng và chạy lại script.

### Dừng ứng dụng public

Tại terminal đang chạy script, nhấn:

```text
Ctrl+C
```

Script sẽ dừng cả Cloudflare Tunnel và Next.js production server do chính nó tạo.

### Chạy bằng cổng khác

Ví dụ chạy ở cổng 3100:

```bash
CDS_GIS_PORT=3100 ./scripts/start-public.sh
```

Biến `CDS_GIS_PORT` chỉ chấp nhận số từ 1024 đến 65535.

### Xem log ứng dụng

Log Next.js được ghi tại:

```text
/tmp/cds-gis-public.log
```

Xem log gần nhất:

```bash
tail -n 100 /tmp/cds-gis-public.log
```

Theo dõi log liên tục:

```bash
tail -f /tmp/cds-gis-public.log
```

File log được làm trống mỗi lần `start-public.sh` khởi động lại.

## 4. Migration dữ liệu demo seed

Sử dụng migration khi đã chỉnh sửa `src/data/demo-gis-seed.ts` và muốn cập nhật dữ liệu seed trong file runtime mà vẫn giữ các object POC do người dùng tạo.

### Nguyên tắc

Migration sẽ:

- Thay toàn bộ object có `source=seed` bằng seed hiện tại.
- Giữ các object có `source=user`.
- Bỏ qua object người dùng nếu ID của nó trùng với ID seed.
- Không reset toàn bộ dữ liệu.

### Cách chạy

Ứng dụng CDS GIS phải đang chạy. Mở một terminal WSL thứ hai:

```bash
cd /home/minhmh/tool/cds-gis
./scripts/migrate-demo-gis-seed.sh
```

Mặc định script gọi:

```text
http://127.0.0.1:3000/demo-data-api/migrate
```

Nếu ứng dụng chạy ở cổng 3100:

```bash
CDS_GIS_URL=http://127.0.0.1:3100 ./scripts/migrate-demo-gis-seed.sh
```

Sau khi migration thành công, reload trang bản đồ để trình duyệt tải lại dữ liệu.

### Khi vừa sửa source seed

Nếu đang chạy bằng `start-public.sh`, production build đang sử dụng source tại thời điểm build. Quy trình an toàn là:

1. Dừng `start-public.sh` bằng `Ctrl+C`.
2. Chạy lại `./scripts/start-public.sh` để build source mới.
3. Mở terminal thứ hai.
4. Chạy `./scripts/migrate-demo-gis-seed.sh`.
5. Reload trang bản đồ.

Nếu chỉ sửa seed nhưng không build lại production server, migration có thể vẫn dùng seed cũ đã nằm trong build đang chạy.

## 5. Reset toàn bộ dữ liệu demo

`reset-demo-gis-data.sh` là thao tác có tính phá hủy dữ liệu runtime.

Reset sẽ:

- Xóa toàn bộ object POC do người dùng tạo.
- Xóa các thay đổi đã lưu trên object runtime.
- Khôi phục `data/runtime/demo-gis-features.json` về đúng seed của ứng dụng đang chạy.

### Sao lưu trước khi reset

Nếu cần giữ khả năng phục hồi dữ liệu, có thể sao lưu file runtime trước:

```bash
cd /home/minhmh/tool/cds-gis
cp data/runtime/demo-gis-features.json data/runtime/demo-gis-features.backup.json
```

Lưu ý: chạy lại lệnh trên sẽ ghi đè file backup cũ.

### Reset có xác nhận

Ứng dụng CDS GIS phải đang chạy. Trong terminal thứ hai:

```bash
cd /home/minhmh/tool/cds-gis
./scripts/reset-demo-gis-data.sh
```

Script sẽ yêu cầu nhập chính xác:

```text
RESET
```

Nếu nhập nội dung khác, thao tác được hủy và dữ liệu không thay đổi.

### Reset không hỏi lại

Chỉ sử dụng khi chắc chắn muốn xóa toàn bộ object người dùng:

```bash
./scripts/reset-demo-gis-data.sh --yes
```

### Reset khi chạy cổng khác

Ví dụ ứng dụng đang chạy ở cổng 3100:

```bash
CDS_GIS_URL=http://127.0.0.1:3100 ./scripts/reset-demo-gis-data.sh
```

Sau khi reset thành công, reload trang bản đồ.

## 6. Chọn migration hay reset

| Nhu cầu | Thao tác nên dùng |
| --- | --- |
| Cập nhật seed và giữ object POC | Migration |
| Thêm object seed mới và giữ dữ liệu người dùng | Migration |
| Khôi phục môi trường demo về trạng thái ban đầu | Reset |
| Xóa toàn bộ dữ liệu do người dùng test tạo ra | Reset |
| Chỉ chạy ứng dụng cho người khác xem | Start public |

Quy tắc ngắn gọn:

```text
Muốn giữ object người dùng → migrate
Muốn quay về seed sạch hoàn toàn → reset
```

## 7. Xử lý lỗi thường gặp

### Cổng 3000 đang được sử dụng

Thông báo:

```text
Lỗi: cổng 3000 đang được một process khác sử dụng.
```

Kiểm tra process đang nghe cổng:

```bash
ss -ltnp | grep ':3000'
```

Sau đó dừng đúng process cũ hoặc chạy script ở cổng khác:

```bash
CDS_GIS_PORT=3100 ./scripts/start-public.sh
```

### Project chưa có dependencies

Chạy:

```bash
cd /home/minhmh/tool/cds-gis
npm ci
```

### Không tìm thấy cloudflared

Kiểm tra:

```bash
command -v cloudflared
cloudflared --version
```

Nếu không có kết quả, cần cài `cloudflared` trước khi dùng `start-public.sh`.

### Migration hoặc reset không gọi được API

Kiểm tra:

- CDS GIS đã chạy hay chưa.
- Cổng trong `CDS_GIS_URL` có đúng không.
- Production build có khởi động thành công không.
- Log `/tmp/cds-gis-public.log`.

Thử gọi trang local:

```bash
curl -I http://127.0.0.1:3000
```

### Build bị lỗi

Chạy build trực tiếp để xem đầy đủ thông báo:

```bash
cd /home/minhmh/tool/cds-gis
npm run build
```

## 8. Lưu ý bảo mật hiện tại

Các API demo sau hiện chưa có xác thực production:

```text
POST /demo-data-api/migrate
POST /demo-data-api/reset
PUT /demo-data-api/features/:id
DELETE /demo-data-api/features/:id
```

Khi mở Cloudflare Quick Tunnel, người biết URL có khả năng truy cập các route của ứng dụng. Vì vậy:

- Chỉ chia sẻ URL cho nhóm test tin cậy.
- Không đưa dữ liệu cá nhân hoặc dữ liệu mật thật vào môi trường demo.
- Sao lưu file runtime trước những đợt test quan trọng.
- Không coi Quick Tunnel và mật khẩu demo là cơ chế bảo mật production.
- Khi lên production phải bổ sung đăng nhập, phân quyền API, audit log và chặn các route bảo trì.

## 9. Quy trình chạy demo được khuyến nghị

Terminal thứ nhất:

```bash
cd /home/minhmh/tool/cds-gis
./scripts/start-public.sh
```

Terminal thứ hai, chỉ khi cần cập nhật seed:

```bash
cd /home/minhmh/tool/cds-gis
./scripts/migrate-demo-gis-seed.sh
```

Terminal thứ hai, chỉ khi cần làm sạch toàn bộ dữ liệu test:

```bash
cd /home/minhmh/tool/cds-gis
./scripts/reset-demo-gis-data.sh
```

Kết thúc buổi test, quay lại terminal thứ nhất và nhấn `Ctrl+C` để dừng cả ứng dụng và tunnel.

