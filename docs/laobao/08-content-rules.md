# 08 — Quy tắc nội dung bắt buộc (Content Rules)

> **Tài liệu này có giá trị ràng buộc vĩnh viễn.** Mọi model/developer cần đọc trước khi viết bất kỳ nội dung UI, dữ liệu mock, hoặc văn bản mô tả nào cho dự án này.

---

## ✅ RULE-01 · Đơn vị hành chính — BAN TUYỆT ĐỐI nhắc đến "Huyện Hướng Hóa"

**Bối cảnh lịch sử:** Theo phương án sắp xếp đơn vị hành chính mới của tỉnh Quảng Trị, xã Lao Bảo **không còn trực thuộc huyện Hướng Hóa**. Xã Lao Bảo **trực thuộc tỉnh Quảng Trị** trực tiếp.

### ❌ SAI — Không được dùng:
```
huyện Hướng Hóa
Huyện Hướng Hóa
Hướng Hóa (khi đi kèm "huyện")
UBND huyện Hướng Hóa
Ban CHQS huyện Hướng Hóa
Phòng GD-ĐT Hướng Hóa (khi chỉ "phòng" cấp huyện)
Ngân sách Huyện Hướng Hóa
HĐND-UBND huyện Hướng Hóa
Trạm thú y / bảo vệ thực vật huyện Hướng Hóa
```

### ✅ ĐÚNG — Dùng thay thế:
| Bối cảnh | Thay thế đúng |
|---|---|
| Địa chỉ hành chính | `Xã Lao Bảo, Tỉnh Quảng Trị` |
| Tên cơ quan cấp trên | `Tỉnh Quảng Trị` / `UBND Tỉnh` / `Sở/Ngành tỉnh` |
| Cơ quan phê duyệt đất | `UBND Tỉnh Quảng Trị` |
| Ngân sách cấp trên | `Ngân sách Tỉnh Quảng Trị` |
| Nhiệm vụ cấp trên giao | `Nhiệm vụ Tỉnh giao` |
| Báo cáo gửi cấp trên | `Báo cáo gửi Tỉnh/Sở ngành` |
| Phòng ban cấp trên | `Sở [ngành] tỉnh Quảng Trị` (vd: `Sở Y tế`, `Sở GD-ĐT`) |
| EDOC/Văn bản chỉ đạo | `UBND Tỉnh / Sở ngành tỉnh Quảng Trị` |
| Quân sự địa bàn | `Ban CHQS xã Lao Bảo` / `Bộ đội Biên phòng Lao Bảo` |
| Địa bàn mở rộng | `Mở rộng toàn tỉnh Quảng Trị` |

### Công thức địa chỉ chuẩn:
```
Xã Lao Bảo, Tỉnh Quảng Trị
```
> **Không có cấp huyện trung gian.** Không viết `Xã Lao Bảo, Hướng Hóa, Quảng Trị`.

---

## ✅ RULE-02 · Đơn vị hành chính cấp thôn — BAN TUYỆT ĐỐI dùng "khóm" hoặc "bản"

**Bối cảnh:** Theo sắp xếp đơn vị hành chính mới, các đơn vị dân cư nhỏ (thôn/khóm/bản) tại Lao Bảo được thống nhất gọi là **"thôn"**. Không còn dùng "khóm" hay "bản" như trước.

### ❌ SAI — Không được dùng:
```
Khóm Ka Tăng / khóm Ka Tăng
Khóm bản / khóm/bản
Trưởng khóm / cán bộ khóm
Liên khóm / ranh giới khóm
Chọn khóm / bản
```

### ✅ ĐÚNG — Dùng thay thế:
| Bối cảnh | Thay thế đúng |
|---|---|
| Tên địa danh | `Thôn Ka Tăng`, `Thôn Khe Đá`, `Thôn Làng Vây`... |
| Đơn vị hành chính | `thôn` (viết thường trong câu), `Thôn` (đầu câu/tiêu đề) |
| Chức danh | `Trưởng thôn`, `cán bộ thôn` |
| Hạ tầng | `đường liên thôn`, `ranh giới thôn` |
| Dropdown/placeholder | `Chọn thôn`, `Thôn {tên}` |
| Tổng số đơn vị | `12 thôn` (không phải "12 khóm thôn") |

### Danh sách 12 thôn chính thức của xã Lao Bảo:
Ka Tăng · Khe Đá · Làng Vây · Tân Kim · Tân Phước · Tân Thành · Vĩnh Đông · (và các thôn còn lại)

---



```
Tỉnh Quảng Trị
  └── Xã Lao Bảo (trực thuộc tỉnh)
        └── 12 Khóm / Thôn / Bản
```

Không có tầng "Huyện" trong cấu trúc hành chính này.

---

## ✅ RULE-03 · Dữ liệu công khai — Không hiển thị thông tin bảo mật

- Dữ liệu `confidential` chỉ hiển thị với: `admin`, `data_governance`, `commune_leader`.
- Lớp bản đồ QP-AN bị ẩn hoàn toàn ở giao diện public và `data_officer`.
- Audit log QP-AN chỉ ghi metadata tối thiểu — không lưu tọa độ nhạy cảm.
- Trang landing public: không hiển thị chi tiết thông tin cá nhân hộ dân.

---

## ✅ RULE-04 · Điều hành AI/IOC — Không mô phỏng thật

- Module AI Assistant (2028): hiển thị trạng thái `Chưa kết nối` — không mock dữ liệu AI thật.
- Tích hợp IOC Tỉnh (2027): hiển thị trạng thái `Đang lên kế hoạch`.
- Mọi tính năng mock phải có nhãn rõ ràng `(Mock — backend required)`.
- Không tuyên bố AI đang "vận hành thật" hay "phân tích tự động thật sự".

---

## ✅ RULE-05 · Tên hiển thị hệ thống chuẩn

```
Tên đầy đủ:  Kho dữ liệu số, Bản đồ số thông minh và Trung tâm điều hành thông minh xã Lao Bảo
Tên ngắn:    Lao Bảo · Dữ liệu số
Cơ quan:     UBND Xã Lao Bảo
Phạm vi:     Xã Lao Bảo, Tỉnh Quảng Trị
Năm:         2026
Bản quyền:   © 2026 UBND Xã Lao Bảo, Tỉnh Quảng Trị
```

---

*Cập nhật lần cuối: 2026-07-14. Mọi thay đổi phải được user xác nhận trước khi chỉnh sửa file này.*
