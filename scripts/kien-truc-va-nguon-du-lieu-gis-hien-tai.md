# Kiến trúc và nguồn dữ liệu GIS hiện tại

Tài liệu này mô tả kiến trúc kỹ thuật, nguồn bản đồ và cơ chế lưu dữ liệu của trang GIS tại `/dashboard/map` trong dự án `cds-gis`.

## 1. Tổng quan kiến trúc

Phần GIS hiện tại là một ứng dụng Next.js sử dụng OpenLayers làm engine bản đồ phía trình duyệt. Hệ thống gồm ba nhóm dữ liệu độc lập:

- Bản đồ nền.
- Dữ liệu GIS nghiệp vụ trong catalog.
- Dữ liệu dự báo thời tiết.

Luồng thành phần chính:

```text
MapPage — quản lý state chung
   ├── Toolbar chọn bản đồ
   ├── Catalog lớp dữ liệu
   ├── Chú giải và cảnh báo
   ├── Giao diện thời tiết
   └── MapShell
          └── MapClient — OpenLayers
                 ├── Basemap
                 ├── Lớp hành chính và biển đảo
                 ├── Lớp GIS nghiệp vụ
                 ├── Lớp thời tiết
                 ├── POC biên tập đối tượng
                 └── So sánh quy hoạch
```

### MapPage

File `src/app/dashboard/map/page.tsx` quản lý state dùng chung:

- Bản đồ nền đang sử dụng.
- Chế độ GIS hoặc Thời tiết.
- Các lớp catalog đang bật.
- Thôn đang chọn.
- Tìm kiếm và điều hướng bản đồ.
- Lớp thời tiết, thời điểm dự báo và độ phủ.
- Trạng thái mở/đóng catalog.
- Lựa chọn bản đồ được lưu trong `localStorage` để khôi phục sau khi reload.

### MapShell

File `src/components/map/map-shell.tsx` tải động `MapClient` với `ssr: false`. Cách này giữ OpenLayers khỏi quá trình server-side rendering và giảm tải cho bundle ban đầu của dashboard.

### MapClient

File `src/components/map/map-client.tsx` chứa phần xử lý GIS chính:

- Khởi tạo OpenLayers.
- Hiển thị tile, vector và style layers.
- Chuyển đổi hệ tọa độ.
- Bật/tắt lớp theo catalog.
- Vẽ điểm, đường và vùng.
- Chọn, sửa và xóa đối tượng.
- Hiển thị popup chi tiết.
- Tìm kiếm và định vị.
- So sánh quy hoạch.
- Render raster thời tiết và vệt gió.

## 2. Nguồn bản đồ nền

Các bản đồ nền được khai báo tại `src/lib/map-config.ts`.

| Bản đồ | Nguồn |
| --- | --- |
| Bản đồ Liberty — mặc định | OpenFreeMap Liberty/OpenMapTiles, dữ liệu nền từ OpenStreetMap |
| Đường phố CARTO | CARTO Voyager, dữ liệu OpenStreetMap |
| Đường phố Esri | Esri World Street Map |
| Vệ tinh có nhãn | Esri World Imagery kết hợp World Boundaries and Places |
| Vệ tinh không nhãn | Esri World Imagery |
| Địa hình | Esri World Topographic Map |
| Xám nhạt | Esri World Light Gray Canvas |
| Xám đậm | Esri World Dark Gray Canvas |
| Hành chính | GeoJSON tỉnh/xã từ `gis.vn` |
| Nền tọa độ | OpenLayers tự vẽ lưới, không gọi tile bên ngoài |
| VietMap | Chỉ xuất hiện khi có `NEXT_PUBLIC_VIETMAP_TILEMAP_API_KEY` |
| Nền tùy chỉnh | Được cấu hình qua `NEXT_PUBLIC_GIS_BASEMAP_URL` |

Hiện tại không còn lựa chọn OpenStreetMap trực tiếp. Liberty và CARTO vẫn sử dụng dữ liệu dẫn xuất từ OpenStreetMap.

### Bản đồ Liberty

Route `src/app/gis-source/openfreemap-liberty-style/route.ts` lấy style từ:

```text
https://tiles.openfreemap.org/styles/liberty
```

Server xử lý lại style trước khi trả cho trình duyệt:

- Đổi nhãn `South China Sea` thành `BIỂN ĐÔNG`.
- Đổi nhãn `Gulf of Tonkin` thành `VỊNH BẮC BỘ`.
- Loại bỏ một số layer nặng như building 3D, rail hatching và một số POI.
- Cho lớp nhà cửa tiếp tục hiển thị khi zoom gần.
- Cache style để giảm số lần gọi OpenFreeMap.

Phần xử lý này chủ yếu thay đổi nhãn và style, không tạo ra dữ liệu hành chính có giá trị pháp lý.

## 3. Dữ liệu hành chính và biển đảo

Nguồn được định nghĩa tại `src/lib/server/gis-vn-data.ts`:

- Tỉnh/thành sau sáp nhập: GeoJSON từ `gis.vn`.
- Phường/xã sau sáp nhập: GeoJSON từ `gis.vn`.
- Tọa độ nhãn quần đảo: JSON từ `gis.vn`.

### Hành chính toàn quốc

Route `src/app/gis-source/vietnam-administrative/route.ts`:

- Tải dữ liệu tỉnh/thành.
- Rút gọn geometry tỉnh để chế độ xem toàn quốc nhẹ hơn.
- Chỉ tải dữ liệu xã của tỉnh đang xem.
- Cache dữ liệu trong bộ nhớ khoảng 24 giờ.

### Hoàng Sa và Trường Sa

Route `src/app/gis-source/vietnam-islands/route.ts`:

- Lấy thành phần ngoài khơi thuộc Đà Nẵng để tạo lớp Hoàng Sa.
- Lấy thành phần ngoài khơi thuộc Khánh Hòa để tạo lớp Trường Sa.
- Thêm nhãn `Quần đảo Hoàng Sa (Việt Nam)` và `Quần đảo Trường Sa (Việt Nam)`.

Đây là lớp tham chiếu hiển thị lấy từ `gis.vn`, chưa được coi là dữ liệu pháp lý chính thức.

## 4. Catalog dữ liệu GIS nghiệp vụ

Catalog được cấu hình tại `src/data/gis-layer-catalog.ts`, bao gồm:

- `layerId`.
- Tên và nhóm lớp.
- Loại geometry.
- Màu, icon và độ dày mặc định.
- Trạng thái bật/tắt mặc định.
- Mức bảo mật.
- Vai trò được phép xem.
- Nguồn mô tả và chu kỳ cập nhật dự kiến.

Các nhóm dữ liệu hiện tại:

- Hành chính – dân cư.
- Kinh tế.
- Du lịch – thương mại – dịch vụ.
- Đất đai – quy hoạch – xây dựng.
- Nông nghiệp – môi trường.
- Giáo dục – y tế.
- An sinh xã hội.
- Quốc phòng – an ninh.
- Phòng chống thiên tai.

Các nguồn như `UBND xã Lao Bảo`, `Phòng Giáo dục`, `Trạm Y tế` hiện mới là metadata minh họa cho nguồn dự kiến. Hệ thống chưa kết nối trực tiếp đến cơ sở dữ liệu của các đơn vị này.

## 5. Dữ liệu demo và cơ chế lưu trữ

### Dữ liệu seed

Dữ liệu khởi tạo nằm tại:

```text
src/data/demo-gis-seed.ts
```

Seed hiện có version `6`, bao gồm:

- Ranh giới xã và thôn mô phỏng.
- Nhãn thôn.
- 100 hộ dân mô phỏng.
- Doanh nghiệp, chợ, khách sạn, trường học và y tế.
- Du lịch và công trình công cộng.
- Vùng cảnh báo thiên tai.
- Các vùng quy hoạch dùng cho chức năng so sánh.
- Tối thiểu một đối tượng minh họa cho các lớp còn lại.

### File runtime

Khi ứng dụng hoạt động, dữ liệu thực tế được đọc và ghi tại:

```text
data/runtime/demo-gis-features.json
```

Luồng dữ liệu:

```text
Trình duyệt
   ↓ GET /demo-data-api/features
Next.js API
   ↓
src/lib/demo-gis-store.ts
   ↓
data/runtime/demo-gis-features.json
```

`src/lib/demo-gis-store.ts` chịu trách nhiệm:

- Khởi tạo dữ liệu từ seed nếu chưa có file runtime.
- Đọc toàn bộ `FeatureCollection`.
- Thêm hoặc cập nhật đối tượng.
- Xóa đối tượng.
- Reset dữ liệu demo.
- Migration seed và giữ lại đối tượng do người dùng tạo.

Đối tượng POC được lưu qua:

```text
PUT /demo-data-api/features/:id
```

Vì vậy, những người truy cập cùng một server hoặc Cloudflare Tunnel sẽ thấy chung dữ liệu đã lưu.

Giới hạn của cơ chế hiện tại:

- Chưa có database.
- Không phù hợp chạy nhiều instance.
- Không có transaction database.
- Có thể mất dữ liệu khi deploy trên filesystem tạm.
- Chưa có audit log, version và quy trình phê duyệt thực sự.

## 6. Cách OpenLayers hiển thị dữ liệu nghiệp vụ

GeoJSON lưu tọa độ theo `EPSG:4326`:

```text
[longitude, latitude]
```

Khi đưa lên bản đồ, OpenLayers chuyển geometry sang `EPSG:3857` để hiển thị.

Các feature được nạp vào một `VectorSource` chung. Mỗi feature có cấu trúc chính:

```text
Feature
   ├── id
   ├── layerId
   ├── geometry
   ├── name
   ├── description
   ├── details
   ├── style
   └── source: seed | user
```

Catalog quyết định feature nào được render dựa trên `layerId`. Khi tắt một lớp, feature không bị xóa khỏi bộ nhớ; hàm style chỉ không render feature đó.

Số lượng trong catalog được tính lại từ dữ liệu đã nạp, bao gồm cả dữ liệu seed và đối tượng POC đã lưu.

## 7. POC biên tập đối tượng

POC hiện hỗ trợ:

- Vẽ điểm, đường và vùng bằng chuột.
- Tạo geometry từ tọa độ nhập vào.
- Dừng vẽ bằng nút hoặc phím `Esc`.
- Chọn lớp dữ liệu cho đối tượng.
- Nhập tên, mô tả và thuộc tính.
- Chọn màu điểm/đường.
- Chọn màu viền và màu nền cho vùng.
- Sửa đỉnh geometry.
- Lưu, xem popup, sửa và xóa đối tượng.
- Xuất GeoJSON.

Đối tượng đã lưu có `source=user`; dữ liệu seed có `source=seed`.

## 8. So sánh quy hoạch

Chức năng hiện được xử lý phía trình duyệt bằng:

- `@turf/area`.
- `@turf/intersect`.

Chỉ áp dụng cho bốn lớp:

- Dự án đầu tư đang triển khai.
- Quy hoạch sử dụng đất.
- Quy hoạch xây dựng.
- Quy hoạch phân khu.

Hệ thống tính diện tích, phần giao nhau và đưa ra nội dung phân tích demo theo quy tắc. Chưa có backend GIS hoặc AI thực sự.

## 9. Bản đồ thời tiết

Route `src/app/weather-api/forecast/route.ts` lấy dữ liệu từ Open-Meteo:

```text
https://api.open-meteo.com/v1/forecast
```

Dữ liệu gồm:

- Nhiệt độ không khí ở độ cao 2 m.
- Tổng lượng mưa dự báo theo giờ.
- Tốc độ gió ở độ cao 10 m.
- Hướng gió ở độ cao 10 m.
- Dự báo 72 giờ.

Server lấy lưới 11 x 15, tương đương 165 điểm, trong phạm vi:

- Kinh độ từ 95°E đến 130°E.
- Vĩ độ từ 5°S đến 30°N.

Phạm vi này bao phủ Việt Nam, Đông Nam Á, Biển Đông, Philippines và một phần phía nam Trung Quốc.

Dữ liệu được cache một giờ. Nếu Open-Meteo tạm lỗi nhưng cache cũ vẫn còn, route tiếp tục trả dữ liệu cache.

OpenLayers nội suy các điểm thành lớp màu bằng `ImageCanvasSource`. Vệt gió là canvas animation riêng, được tạo từ tốc độ và hướng gió nội suy tại vị trí của từng particle.

## 10. Phân biệt dữ liệu thật và dữ liệu mô phỏng

| Thành phần | Trạng thái hiện tại |
| --- | --- |
| Bản đồ nền | Nguồn thật từ OpenFreeMap, CARTO, Esri và tùy chọn VietMap |
| Hành chính toàn quốc | Tải từ `gis.vn`, dùng làm lớp tham chiếu |
| Hoàng Sa, Trường Sa | Lọc và tạo từ dữ liệu `gis.vn` |
| Dữ liệu thời tiết | Dự báo thật từ Open-Meteo, được nội suy từ lưới |
| Ranh giới nghiệp vụ xã/thôn Lao Bảo | Dữ liệu mô phỏng |
| Hộ dân, trường học, doanh nghiệp | Dữ liệu demo/seed |
| Quy hoạch và cảnh báo | Dữ liệu demo/seed |
| Đối tượng POC | Dữ liệu do người dùng tạo, lưu trong file JSON dùng chung |
| Phân quyền Quốc phòng – An ninh | Mới là UI/demo, API chưa bảo vệ dữ liệu ở tầng server |

## 11. Kết luận

Kiến trúc hiện tại đã có đầy đủ giao diện và luồng nghiệp vụ của một GIS web POC. Phần OpenLayers, catalog, popup, công cụ biên tập và so sánh có thể tiếp tục sử dụng khi chuyển sang production.

Thay đổi quan trọng nhất khi lên production là:

- Thay `demo-gis-store.ts` và file JSON bằng PostgreSQL/PostGIS.
- Đưa phân quyền xuống API và database.
- Bổ sung audit log, version và quy trình duyệt dữ liệu.
- Chỉ tải dữ liệu theo lớp, vùng nhìn và mức zoom.
- Dùng vector tile cho các lớp có số lượng đối tượng lớn.

