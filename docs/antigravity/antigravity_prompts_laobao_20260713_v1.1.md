# Bộ Prompt Antigravity — Kho dữ liệu số, Bản đồ số thông minh và Trung tâm điều hành thông minh xã Lao Bảo

> **Phiên bản:** 2026-07-13 — Revision 1.1
> **Mục đích:** Điều phối Antigravity chuyển đổi source FE mockup đã clone sang hệ thống mới của **xã Lao Bảo, tỉnh Quảng Trị**, theo từng task nhỏ, có kiểm soát context, build/test/fix, review, commit và model handoff.
> **Cách dùng:** Chạy lần lượt từng prompt. Không gửi nhiều prompt triển khai cùng lúc.
> **Revision 1.1:** Bổ sung registry 110 feature ID, yêu cầu bảo mật QP-AN, kiểm đếm 62 nhóm chỉ số và ghi rõ nguồn danh sách 12 thôn.

---

## 1. Nguồn yêu cầu và thứ tự ưu tiên

Antigravity phải sử dụng các nguồn theo thứ tự sau:

1. `docs/requirements/lao-bao-digital-plan-2026.docx`
   - Nguồn chuẩn về mục tiêu, lộ trình 2026–2028, nhóm dữ liệu, đơn vị chủ trì/phối hợp, tần suất cập nhật, an toàn dữ liệu và định hướng IOC.
2. `docs/requirements/lao-bao-system-requirements_v1.docx`
   - Nguồn chuẩn về chức năng chi tiết, trường dữ liệu, quy trình, bản đồ, dashboard và báo cáo.
3. `system_context_laobao.md`
   - Chỉ dùng để hiểu hiện trạng kỹ thuật của source đã clone.
   - Các tên, dữ liệu và nghiệp vụ xã Trà Tập trong file này là **legacy data cần loại bỏ**, không phải yêu cầu mới.
4. Các file `.md` template còn lại
   - Dùng để giữ cấu trúc source, layout, sidebar, theme, Shadcn UI, common components, routing, mock-data pattern, Frappe-ready architecture và quality checklist.

### Quy tắc giải quyết mâu thuẫn

- **Kế hoạch UBND xã** là chuẩn về đơn vị phụ trách, tần suất cập nhật, lộ trình và nguyên tắc quản lý.
- **Tài liệu BA** là chuẩn về chức năng, trường dữ liệu, màn hình và quy trình thao tác.
- Không tự suy đoán dữ liệu nhạy cảm hoặc ranh giới hành chính chính xác khi chưa có dữ liệu chính thức.

---

## 2. Các quyết định đã chốt

### 2.1. Phạm vi kỹ thuật hiện tại

Làm:

- Frontend mockup trên source hiện có.
- Next.js App Router, React, TypeScript strict, Tailwind CSS v4, shadcn/ui.
- Mock data có quan hệ, ổn định bằng seeded random.
- UI list, detail, create/edit mock, import/export mock, workflow mock, dashboard/report mock.
- Leaflet/React Leaflet cho bản đồ số.
- Kiến trúc sẵn sàng thay mock bằng API/Frappe về sau.

Chưa làm thật:

- Database và API backend.
- Xác thực email thật, reset password thật.
- Đồng bộ CSDL quốc gia/tỉnh hoặc IOC thật.
- Backup/restore thật.
- AI phân tích dữ liệu thật.
- Xuất Word/PDF/Excel server-side thật, trừ khi source đã có giải pháp client-side ổn định và task yêu cầu rõ.
- Ranh giới hành chính chính thức khi chưa có GeoJSON/shapefile đã kiểm chứng.

### 2.2. Dữ liệu hành chính chuẩn

Không còn cấp huyện trong data model.

```text
Tỉnh Quảng Trị
└── Xã Lao Bảo
    └── 12 thôn
```

Thông tin toàn xã:

- Diện tích tự nhiên: **8.303 ha**.
- Dân số: **23.135 người**.
- Số hộ: **5.445 hộ**.

Danh sách 12 thôn duy nhất:

1. Triệu Phước
2. Tân Kim
3. Tân Phước
4. Ka Tăng
5. Tân Thành
6. Triệu Thành
7. Tân Long
8. Triệu Long
9. Làng Vây
10. Vĩnh Đông
11. Trung Chín
12. Tây Chín

Mọi form, filter, mock data, dashboard, report, popup bản đồ phải import từ **một nguồn master duy nhất**. Không khai báo lại danh sách thôn ở từng module.

**Ghi chú nguồn danh sách 12 thôn:**

- Danh sách tên thôn là dữ liệu đầu vào hành chính do chủ dự án cung cấp riêng theo bối cảnh sắp xếp đơn vị hành chính tại **Nghị quyết số 1680/NQ-UBTVQH15**.
- Danh sách này **không được trích xuất từ hai file DOCX Kế hoạch/BA** nêu tại mục 1.
- `docs/laobao/01-administrative-data.md` phải ghi rõ `sourceType: project-provided-administrative-input`, số nghị quyết tham chiếu và ngày tiếp nhận context.
- Khi có danh mục hành chính hoặc phụ lục máy đọc được do cơ quan có thẩm quyền cung cấp, phải đối chiếu và cập nhật có version; không tự sửa tên thôn rải rác trong source.

### 2.3. Vai trò runtime

```ts
export type UserRole = "admin" | "data_officer" | "unit_leader" | "data_governance" | "commune_leader";
```

- `admin`: quản trị hệ thống, tài khoản, role, tổ chức, cấu hình.
- `data_officer`: nhập, sửa, import, gửi duyệt dữ liệu thuộc đơn vị/phạm vi được giao.
- `unit_leader`: duyệt hoặc trả lại hồ sơ dữ liệu của đơn vị.
- `data_governance`: Văn phòng HĐND và UBND xã kiểm tra, công bố, quản trị chất lượng kho dữ liệu.
- `commune_leader`: Chủ tịch/Phó Chủ tịch và lãnh đạo được phân quyền; xem dashboard, báo cáo, dữ liệu được phép và xuất báo cáo mock.

Quyền còn phụ thuộc:

- Đơn vị/phòng ban.
- Nhóm dữ liệu.
- Phạm vi thôn.
- Mức độ bảo mật: `public | shared | confidential`.

### 2.4. Workflow dữ liệu

```text
Draft
→ Submitted
→ Unit Approved / Returned
→ Governance Approved / Returned
→ Published
→ Archived
```

Quy trình nghiệp vụ:

```text
Đơn vị nhập
→ Lãnh đạo đơn vị duyệt
→ Văn phòng HĐND và UBND xã kiểm tra
→ Công bố vào Kho dữ liệu dùng chung
```

### 2.5. Bản đồ

- Dùng Leaflet + React Leaflet.
- Dữ liệu nguồn có thể ghi nhận `sourceCrs: "VN-2000"`.
- Geometry hiển thị trên Leaflet phải là GeoJSON `EPSG:4326`.
- Geometry mock phải ghi rõ là dữ liệu mô phỏng.
- Không tự gọi polygon mock là ranh giới hành chính chính xác.
- Layer `confidential` phải bị lọc khỏi data trước khi render, không chỉ ẩn bằng CSS.

### 2.6. Mã chức năng ổn định và truy vết BA

- Toàn bộ **110 chức năng thực tế** trong bảng BA phải có `featureCode` ổn định theo registry tại **mục 12** của file này.
- `featureCode` là khóa truy vết chính; STT trong tài liệu BA chỉ là metadata nguồn và **không được dùng làm ID runtime**, vì BA thiếu STT 29 và có một dòng không đánh số nằm giữa STT 84–86.
- Dòng không đánh số “Cơ chế phân quyền, mã hóa dữ liệu nhóm Quốc phòng - An ninh” dùng mã cố định `DATA-SECDEF-07`, `sourceStt = null`, `sourceRowNote = "between 84 and 86"`.
- Không đổi mã đã cấp khi BA đổi thứ tự hoặc mô tả. Chức năng mới phải nhận mã mới trong đúng namespace, không tái sử dụng mã đã bỏ.
- `docs/laobao/02-feature-matrix.md`, progress report, QA report và task implementation phải tham chiếu `featureCode` để truy vết từ yêu cầu → route/component/type/mock → trạng thái triển khai.

---

## 3. Cấu trúc module và route mục tiêu

```text
/                                      Landing page
/login                                 Đăng nhập mock
/forgot-password                       Quên mật khẩu mock
/dashboard                             Tổng quan
/dashboard/indicators                  Bộ chỉ số điều hành
/dashboard/reports                     Báo cáo phân tích
/dashboard/notifications               Thông báo

/dashboard/administrative-population   Hành chính và dân cư
/dashboard/economy                     Kinh tế
/dashboard/tourism-services            Du lịch, thương mại, dịch vụ
/dashboard/land-planning               Đất đai, quy hoạch, xây dựng
/dashboard/agriculture-environment     Nông nghiệp và môi trường
/dashboard/education-health            Giáo dục và y tế
/dashboard/social-welfare              An sinh xã hội
/dashboard/security-defense            Quốc phòng và an ninh
/dashboard/disaster-emergency          Phòng chống thiên tai và điều hành khẩn cấp

/dashboard/data-templates              Biểu mẫu thu thập
/dashboard/data-imports                Import dữ liệu
/dashboard/data-approvals              Hồ sơ chờ duyệt
/dashboard/data-publication            Công bố dữ liệu
/dashboard/data-versions               Phiên bản và lịch sử
/dashboard/data-search                 Tra cứu toàn kho

/dashboard/map                         Bản đồ số Lao Bảo
/dashboard/map/layers                  Quản lý lớp dữ liệu
/dashboard/map/features                Đối tượng không gian

/dashboard/users                       Người dùng
/dashboard/roles                       Vai trò và quyền
/dashboard/organizations               Cơ quan, đơn vị
/dashboard/staff                       Cán bộ
/dashboard/audit-logs                  Nhật ký hoạt động
/dashboard/backups                     Sao lưu và khôi phục mock
/dashboard/integrations                Cấu hình tích hợp mock
/dashboard/settings                    Cấu hình hệ thống
/dashboard/access-denied               Từ chối truy cập
```

Sidebar phải gom accordion, không hiển thị toàn bộ route ngang hàng:

1. Tổng quan & điều hành.
2. Kho dữ liệu số.
3. Quy trình dữ liệu.
4. Bản đồ số.
5. Quản trị hệ thống.

---

## 4. Quy trình bắt buộc sau mỗi prompt

Antigravity phải thực hiện đúng thứ tự:

1. Đọc đúng các file được chỉ định trong prompt; không quét lại toàn bộ project nếu không cần.
2. Kiểm tra `git status` trước khi sửa.
3. Chỉ sửa đúng phạm vi task.
4. Chạy và fix đến khi pass:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

5. Kiểm tra UI liên quan ở mobile 375px, tablet 768px và desktop 1440px khi task có giao diện.
6. Cập nhật `docs/laobao/06-progress.md`.
7. Báo cáo trên chat bằng **tiếng Việt**:
   - Tóm tắt đã làm.
   - Files created.
   - Files updated.
   - Data/types/RBAC/routes đã thay đổi.
   - Kết quả lint/typecheck/build.
   - Vấn đề còn tồn tại.
   - Commit message tiếng Anh được đề xuất.
8. **Dừng lại, không commit và không push.**
9. Chỉ sau khi người dùng review, Accept file chỉnh sửa và bấm **OK**, mới chạy prompt commit.
10. Mỗi task commit riêng; cuối chuỗi mới push một lần hoặc người dùng push thủ công.

### Quy tắc Git

- Không dùng `git add .` khi có file ngoài phạm vi task chưa được kiểm tra.
- Không amend, rebase, reset hard hoặc force push nếu không có lệnh rõ ràng.
- Commit message bằng tiếng Anh, conventional commits.
- Không push trong các prompt triển khai.

---

## 5. PROMPT NỀN — Dùng ở đầu mọi task

```txt
Bạn đang phát triển dự án “Kho dữ liệu số, Bản đồ số thông minh và Trung tâm điều hành thông minh xã Lao Bảo, tỉnh Quảng Trị”.

TRƯỚC KHI CODE
1. Đọc:
   - docs/laobao/00-context-core.md
   - docs/laobao/01-administrative-data.md
   - docs/laobao/02-feature-matrix.md
   - docs/laobao/03-route-map.md
   - docs/laobao/04-data-contracts.md
   - docs/laobao/05-rbac-matrix.md
   - docs/laobao/06-progress.md
   - docs/laobao/07-model-handoff.md nếu file tồn tại
2. Đọc thêm đúng các file source/task được nêu trong prompt hiện tại.
3. Chạy `git status --short` và không ghi đè thay đổi chưa rõ nguồn gốc.

INVARIANTS BẮT BUỘC
- Dự án mới chỉ liên quan xã Lao Bảo, tỉnh Quảng Trị.
- Xã Trà Tập chỉ là legacy source reference. Không được đưa tên, địa danh, dữ liệu hoặc nghiệp vụ đặc thù Trà Tập vào UI/data mới.
- Không có cấp huyện trong data model mới.
- Danh sách thôn chỉ có 12 tên chuẩn từ `docs/laobao/01-administrative-data.md` và một master data file trong `src/data`.
- Tổng toàn xã: 8.303 ha, 23.135 người, 5.445 hộ.
- Registry có đúng 110 `featureCode` duy nhất; không dùng STT BA làm ID runtime.
- Mọi task/module phải ghi rõ các `featureCode` được triển khai hoặc bị ảnh hưởng trong progress/handoff.
- Dùng `villageCode` và `villageName`; không tạo mới `districtCode`, `districtName`, `hamletCode`, `hamletName`.
- Type đặt trong `src/types`; mock data đặt trong `src/data`; component không hard-code dataset.
- Dashboard/report compute từ mock entity data hoặc indicator data, không hard-code số rời.
- Không dùng `any`, `@ts-ignore`, `@ts-nocheck`.
- Import source dùng alias `@/`.
- Comment trong source và commit message viết bằng tiếng Anh.
- Giải thích/tóm tắt trên chat viết bằng tiếng Việt.

UI GOVERNANCE
- Shadcn-first. Nếu shadcn/ui có primitive tương ứng thì phải dùng component trong `src/components/ui`.
- Không tự viết lại Button, Card, Input, Label, Select, Table, Badge, Dialog, AlertDialog, Tabs, Sheet, DropdownMenu, Tooltip, Popover, Command, Pagination.
- Dùng semantic tokens; không hard-code `bg-white`, `text-black`, `bg-gray-*`.
- Giữ layout/sidebar/header/mobile menu hiện có; chỉ thay nội dung và navigation.
- Page chỉ compose; logic dài tách ra component/helper.
- Pattern dùng lại từ hai lần trở lên phải đưa vào `src/components/common`.

SECURITY
- Security level: public, shared, confidential.
- Không sinh dữ liệu cá nhân thật hoặc dữ liệu quốc phòng-an ninh nhạy cảm thật.
- Dữ liệu/layer confidential phải bị permission filter trước khi render/export.
- Lãnh đạo chỉ xem dữ liệu thuộc phạm vi được cấp.
- `DATA-SECDEF-07` là yêu cầu QP-AN bắt buộc: frontend hiện chỉ mô phỏng control; backend tương lai phải có encryption at rest, 2FA bắt buộc và audit stream riêng cho access/export.

PHẠM VI HIỆN TẠI
- FE mockup + mock data.
- Leaflet cho bản đồ.
- API, email, backup, IOC, AI và export server-side chỉ là mock/placeholder trừ khi task nói khác.

SAU KHI CODE
1. Chạy và fix đến khi pass:
   - npm run lint
   - npx tsc --noEmit
   - npm run build
2. Cập nhật docs/laobao/06-progress.md.
3. Báo cáo bằng tiếng Việt theo mẫu:
   - Đã thực hiện
   - Files created
   - Files updated
   - Kiểm tra đã chạy
   - Kết quả
   - Vấn đề còn lại
   - Feature codes implemented/affected
   - Suggested commit message
4. Dừng lại. Không commit. Không push. Chờ tôi review, Accept và bấm OK.
```

---

## 6. PROMPT MODEL-HANDOFF-BEFORE — Chạy trước khi đổi model

```txt
# MODEL HANDOFF BEFORE

Không code tính năng mới.

Hãy chuẩn bị bàn giao context cho model tiếp theo:

1. Đọc:
   - docs/laobao/00-context-core.md
   - docs/laobao/01-administrative-data.md
   - docs/laobao/02-feature-matrix.md
   - docs/laobao/03-route-map.md
   - docs/laobao/04-data-contracts.md
   - docs/laobao/05-rbac-matrix.md
   - docs/laobao/06-progress.md
2. Chạy:
   - git status --short
   - git log -5 --oneline
3. Cập nhật `docs/laobao/07-model-handoff.md` với đúng các mục:
   - Timestamp
   - Current task
   - Last completed task
   - Decisions locked
   - Files changed but not committed
   - Latest commits
   - Lint/typecheck/build status
   - Known issues
   - Next task
   - Files the next model must read
   - Invariants that must not change
   - Feature codes completed/affected in current task
4. Không sửa code nghiệp vụ.
5. Tóm tắt bàn giao bằng tiếng Việt.
6. Không commit, không push.
```

---

## 7. PROMPT MODEL-HANDOFF-AFTER — Chạy ngay sau khi đổi model

```txt
# MODEL HANDOFF AFTER

Không code cho đến khi hoàn tất kiểm tra context.

1. Đọc:
   - docs/laobao/00-context-core.md
   - docs/laobao/01-administrative-data.md
   - docs/laobao/02-feature-matrix.md
   - docs/laobao/03-route-map.md
   - docs/laobao/04-data-contracts.md
   - docs/laobao/05-rbac-matrix.md
   - docs/laobao/06-progress.md
   - docs/laobao/07-model-handoff.md
2. Chạy:
   - git status --short
   - git log -5 --oneline
3. Đối chiếu trạng thái Git với file handoff.
4. Báo cáo bằng tiếng Việt:
   - Bạn hiểu dự án hiện tại là gì.
   - Task đã hoàn thành gần nhất.
   - Task tiếp theo.
   - File đang có thay đổi chưa commit.
   - Các invariant quan trọng.
   - Có hay không mâu thuẫn cần người dùng xử lý.
5. Không sửa code, không commit, không push.
6. Dừng để tôi xác nhận tiếp tục.
```

---

# 8. Chuỗi prompt triển khai

## Prompt 00 — Khởi tạo bộ context rút gọn cho Lao Bảo

```txt
# TASK 00: Bootstrap Lao Bao context pack

MỤC TIÊU
Tạo bộ tài liệu context ngắn, ổn định để các model sau không phải đọc lại toàn bộ tài liệu lớn ở mỗi task.

ĐỌC TRƯỚC
- docs/requirements/lao-bao-digital-plan-2026.docx
- docs/requirements/lao-bao-system-requirements_v1.docx
- system_context_laobao.md
- 00-template-purpose.md
- 01-tech-stack-and-setup.md
- 03-folder-structure.md
- 05-layout-sidebar-header-mobile.md
- 06-shadcn-component-policy.md
- 09-mock-data-before-api.md
- 11-rbac-and-navigation-template.md
- 15-quality-checklist.md

TẠO FOLDER VÀ FILE
- docs/laobao/00-context-core.md
- docs/laobao/01-administrative-data.md
- docs/laobao/02-feature-matrix.md
- docs/laobao/03-route-map.md
- docs/laobao/04-data-contracts.md
- docs/laobao/05-rbac-matrix.md
- docs/laobao/06-progress.md
- docs/laobao/07-model-handoff.md

NỘI DUNG BẮT BUỘC
1. Context core:
   - Tên hệ thống.
   - Ba trụ cột: kho dữ liệu, bản đồ, điều hành.
   - Phạm vi FE mockup.
   - Thứ tự ưu tiên nguồn.
   - Quy tắc tuyệt đối không lẫn Trà Tập.
2. Administrative data:
   - Quảng Trị → Lao Bảo → 12 thôn.
   - Không có huyện.
   - 8.303 ha, 23.135 người, 5.445 hộ.
   - Ghi rõ danh sách 12 thôn là context hành chính do chủ dự án cung cấp riêng theo Nghị quyết 1680/NQ-UBTVQH15, không phải dữ liệu trích từ hai DOCX Kế hoạch/BA.
   - Thêm metadata nguồn: `sourceType`, `sourceReference`, `receivedAt`, `verificationStatus`.
3. Feature matrix:
   - Tạo **đúng 110 dòng chức năng** từ bảng BA; không tính các dòng tiêu đề section.
   - Copy nguyên registry `featureCode` tại mục 12 của file prompt này; không tự sinh lại mã khác.
   - Bảng tối thiểu phải có các cột:
     `featureCode | sourceStt | sourceRowNote | group | shortDescription | priority | targetRoute | implementationTask | implementationStatus`.
   - `sourceStt` là số gốc nếu có; dòng `DATA-SECDEF-07` dùng `sourceStt: null` và `sourceRowNote: between 84 and 86`.
   - Đảm bảo unique 110/110, không thiếu STT do lỗi đánh số, không dùng STT làm khóa.
   - Ghi rõ 9 nhóm dữ liệu và các chức năng dùng chung: list/detail, biểu mẫu, nhập tay, import/export, phê duyệt, tra cứu, version.
   - Bao phủ bản đồ, dashboard, report, admin, IOC và AI roadmap.
   - Thêm summary count theo namespace để có thể đối chiếu tự động.
4. Route map theo tài liệu prompt này.
5. Data contracts mức khung.
6. RBAC 5 role + security level.
7. Progress checklist cho TASK 00–23.
8. Handoff template.

QUY TẮC
- Chỉ tạo/cập nhật docs, không refactor source ở task này.
- Không copy nguyên văn tài liệu dài; viết bản tóm tắt có cấu trúc.
- Không đưa dữ liệu Trà Tập vào context mới ngoài mục “legacy forbidden”.
- Không đổi bất kỳ `featureCode` nào trong registry mục 12.

KIỂM TRA
- Kiểm tra các file Markdown không trùng/mâu thuẫn.
- Vẫn chạy lint, typecheck, build để xác nhận baseline source trước khi chuyển đổi.

Suggested commit message: `docs: add Lao Bao project context pack`
```

---

## Prompt 01 — Audit source và lập kế hoạch loại bỏ legacy Trà Tập

```txt
# TASK 01: Audit and quarantine legacy Tra Tap content

MỤC TIÊU
Quét source thực tế, xác định toàn bộ dấu vết legacy có nguy cơ gây conflict, sau đó cleanup những phần nhận diện và dữ liệu nền rõ ràng nhưng chưa triển khai module Lao Bảo.

ĐỌC TRƯỚC
- docs/laobao/00-context-core.md
- docs/laobao/01-administrative-data.md
- system_context_laobao.md
- src/app
- src/components/layout
- src/data
- src/types
- src/lib/app-config.ts nếu có
- src/lib/permissions.ts hoặc file RBAC tương đương

VIỆC CẦN LÀM
1. Tìm kiếm toàn repo các chuỗi:
   - Trà Tập, Tra Tap, Nam Trà My, Đà Nẵng, Quảng Nam.
   - Tên 8 thôn legacy.
   - `districtCode`, `districtName`, `hamletCode`, `hamletName`.
   - Tên module đặc thù legacy không còn phù hợp.
2. Tạo `docs/laobao/08-legacy-audit.md`:
   - File.
   - Chuỗi/field legacy.
   - Loại: app identity / admin data / type / mock data / route / UI text / harmless technical pattern.
   - Hành động: remove now / migrate later / keep implementation only.
3. Cập nhật ngay các phần nhận diện toàn cục:
   - app name, metadata, title, description, tenant label.
   - Không còn hiển thị tên Trà Tập trên `/`, `/login`, dashboard shell.
4. Không xóa hàng loạt module trong task này nếu có nguy cơ phá build.
5. Đánh dấu route/module legacy cần di trú trong `06-progress.md`.

KHÔNG LÀM
- Chưa tạo 9 module nghiệp vụ mới.
- Chưa cài Leaflet.
- Không đổi layout/sidebar behavior.
- Không xóa common components hoặc hooks Frappe-ready.

ACCEPTANCE
- Không còn tên Trà Tập trong app identity hiển thị.
- Có inventory đầy đủ để các task sau cleanup có kiểm soát.
- Build pass.

Suggested commit message: `refactor: remove legacy Tra Tap app identity`
```

---

## Prompt 02 — Chuẩn hóa địa giới và master data 12 thôn

```txt
# TASK 02: Create Lao Bao administrative master data

MỤC TIÊU
Tạo nguồn dữ liệu hành chính duy nhất cho tỉnh Quảng Trị, xã Lao Bảo và 12 thôn; loại bỏ mô hình có cấp huyện khỏi phần source được sử dụng.

TẠO/CẬP NHẬT
- src/types/administrative-unit.ts
- src/data/laobao-administrative-units.ts
- src/data/mock-administrative-units.ts nếu cần giữ compatibility
- src/lib/administrative-invariants.ts
- các file tenant/scope context liên quan
- docs/laobao/01-administrative-data.md

DATA CONTRACT
- Province: code, name.
- Commune: code, name, provinceCode, areaHa, population, householdCount.
- Village: code, name, communeCode, areaHa, population, householdCount, center?, geometryStatus.
- Không có district trong contract mới.

DANH SÁCH THÔN
Dùng đúng 12 tên đã chốt. Tạo code slug ổn định, không phụ thuộc index UI.
Trong `docs/laobao/01-administrative-data.md` phải ghi rõ:
- Danh sách được chủ dự án cung cấp riêng theo bối cảnh Nghị quyết 1680/NQ-UBTVQH15.
- Danh sách không nằm trong hai DOCX Kế hoạch/BA.
- Đây là canonical project input hiện tại, chờ đối chiếu nếu sau này có danh mục hành chính máy đọc được chính thức.

THỐNG KÊ MOCK
- Phân bổ diện tích, dân số, hộ cho 12 thôn.
- Tổng bắt buộc chính xác:
  - areaHa = 8303
  - population = 23135
  - householdCount = 5445
- Tạo helper/assertion kiểm tra tổng ngay khi module data được load hoặc qua test/helper an toàn.

MIGRATION
- Tại các file được task này chạm tới, đổi label thành “Thôn”.
- Ưu tiên đổi field sang `villageCode`, `villageName`.
- Nếu refactor toàn repo vượt scope, tạo adapter legacy có comment English và ghi backlog rõ trong progress.
- Không tạo mới bất kỳ field huyện nào.

ACCEPTANCE
- Một master list duy nhất.
- Không có 12 thôn hard-code rải rác.
- Tenant switcher không hiển thị huyện.
- Tổng số liệu chính xác.

Suggested commit message: `feat: add Lao Bao administrative master data`
```

---

## Prompt 03 — Đồng bộ app identity, layout và sidebar theo module mới

```txt
# TASK 03: Update Lao Bao app shell and navigation

MỤC TIÊU
Giữ nguyên hình dáng/behavior layout hiện tại nhưng thay toàn bộ navigation và breadcrumb sang hệ thống Lao Bảo.

ĐỌC TRƯỚC
- docs/laobao/03-route-map.md
- 05-layout-sidebar-header-mobile.md
- 06-shadcn-component-policy.md
- src/app/dashboard/layout.tsx
- src/components/layout/app-sidebar.tsx
- src/components/layout/sidebar-items.ts
- src/components/layout/dashboard-header.tsx
- src/components/common/breadcrumbs.tsx

VIỆC CẦN LÀM
1. Giữ:
   - Sidebar expanded/collapsed.
   - Accordion cấp 2.
   - Tooltip khi collapsed.
   - Dấu +/- riêng sidebar nếu source hiện dùng.
   - Mobile drawer, overlay và nút đóng.
   - Header, theme toggle, user menu.
2. Tạo 5 nhóm accordion:
   - Tổng quan & điều hành.
   - Kho dữ liệu số.
   - Quy trình dữ liệu.
   - Bản đồ số.
   - Quản trị hệ thống.
3. Dùng route mục tiêu trong `docs/laobao/03-route-map.md`.
4. Route chưa triển khai có thể trỏ tới placeholder chuẩn dùng chung, không tạo 404.
5. Cập nhật breadcrumb route map.
6. Tenant/scope hiển thị `Xã Lao Bảo` và optional `Toàn xã / từng thôn`; không có huyện.
7. Mobile menu phải có cùng RBAC filtering như desktop.

KHÔNG LÀM
- Không code nội dung chi tiết 9 module.
- Không redesign sidebar.
- Không tạo UI primitive mới thay shadcn.

ACCEPTANCE
- Sidebar không quá tải.
- Collapsed/expanded/mobile hoạt động.
- Không có route/title Trà Tập.
- Không có menu module legacy ngoài mục được chuyển đổi rõ ràng.

Suggested commit message: `feat: update Lao Bao navigation shell`
```

---

## Prompt 04 — Data contracts và mock-data foundation dùng chung

```txt
# TASK 04: Build shared data governance contracts and mock foundation

MỤC TIÊU
Tạo lớp type/data dùng chung cho 9 nhóm dữ liệu, workflow, security, indicator và bản đồ để tránh mỗi module tự định nghĩa khác nhau.

TẠO TYPES
- src/types/data-governance.ts
- src/types/reporting.ts
- src/types/map.ts
- src/types/organization.ts
- src/types/index.ts cập nhật barrel

CONTRACT BẮT BUỘC
- DataGroup
- DataSchema
- FormTemplate
- DataRecordBase
- DataSubmission
- ApprovalRequest
- ApprovalStep
- DataVersion
- AttachmentMeta
- ImportJob
- ImportRowError
- ExportJob
- Notification
- ReportingPeriod
- IndicatorCategory
- IndicatorDefinition
- IndicatorValue
- AdministrativeBoundary
- MapLayer
- SpatialFeature
- LayerPermission

TRƯỜNG CHUNG CỦA RECORD
- id, code, dataGroup, recordType.
- villageCode?, villageName?.
- organizationUnitId.
- reportingPeriod.
- securityLevel.
- workflowStatus.
- publishedAt?.
- createdAt, createdBy, updatedAt, updatedBy.
- version.

MOCK FOUNDATION
- Giữ seeded random hiện có nếu tốt; đổi tên helper generic khi cần.
- Tạo factories không phụ thuộc Trà Tập.
- Tạo lookup helpers dùng master villages.
- Không hard-code KPI trong component.
- Tạo mock counts vừa đủ cho UI, không sinh 5.445 hộ chi tiết.

FUTURE API
- Component vẫn consume qua data/service adapter đơn giản.
- Không gọi API thật.
- Không refactor phá các hook Frappe-ready đang dùng chung.

Suggested commit message: `feat: add shared data governance contracts`
```

---

## Prompt 05 — Organization, RBAC, data scope và security level

```txt
# TASK 05: Implement Lao Bao organization and RBAC foundation

MỤC TIÊU
Thay RBAC legacy bằng 5 role đã chốt, thêm phạm vi dữ liệu theo đơn vị, nhóm dữ liệu, thôn và security level.

TẠO/CẬP NHẬT
- src/types/auth.ts
- src/types/organization.ts
- src/data/mock-organizations.ts
- src/data/mock-users.ts
- src/data/mock-roles.ts
- src/lib/permissions.ts
- src/lib/route-permissions.ts
- auth/user context hiện có
- sidebar filtering và route guard
- docs/laobao/05-rbac-matrix.md

ORGANIZATION UNITS MOCK
- Văn phòng HĐND và UBND xã.
- Phòng Kinh tế.
- Phòng Văn hóa - Xã hội.
- Công an xã.
- Ban Chỉ huy Quân sự xã.
- Trạm Y tế xã.
- Trung tâm Dịch vụ tổng hợp.
- Nhóm trường học/cơ quan/thôn ở mức đủ cho mock.

PERMISSION ACTIONS
- view, create, update, delete, import, export, submit, approveUnit, approveGovernance, publish, restoreVersion, manageLayer, viewConfidential.

DATA SCOPE
- organizationUnitIds.
- allowedDataGroups.
- allowedVillageCodes.
- maxSecurityLevel.

RULES
- Admin quản trị hệ thống nhưng dữ liệu confidential vẫn đi qua permission API thống nhất.
- Data officer không approve/publish.
- Unit leader chỉ duyệt dữ liệu đơn vị mình.
- Data governance kiểm tra và publish toàn kho theo phạm vi.
- Commune leader chủ yếu view/export; không nhập liệu mặc định.
- Security/defense confidential chỉ user được cấp rõ ràng mới xem.
- Sidebar hide và route guard phải thống nhất; truy cập URL trực tiếp phải bị chặn.

LOGIN MOCK
Tạo ít nhất một account demo cho mỗi role, dùng dữ liệu giả.

Suggested commit message: `feat: implement scoped RBAC for Lao Bao`
```

---

## Prompt 06 — Xác thực mock, hồ sơ, người dùng, role, tổ chức và cán bộ

```txt
# TASK 06: Build authentication and system administration mock UI

MỤC TIÊU
Triển khai UI quản trị hệ thống theo tài liệu BA nhưng chỉ mock interaction.

ROUTES
- /login
- /forgot-password
- /dashboard/profile hoặc user menu profile dialog
- /dashboard/users
- /dashboard/roles
- /dashboard/organizations
- /dashboard/staff

CHỨC NĂNG
- Login, logout mock.
- Forgot/reset password mock với form + toast, không gửi email thật.
- Edit profile, change password mock.
- User list/detail/create/edit/activate-deactivate.
- Assign role, organization unit, data groups, villages, max security level.
- Role list/detail/create/edit/delete có guard khi role đang được sử dụng.
- Organization tree tối đa 6 cấp về mặt contract nhưng mock chỉ cần cấu trúc thực tế Lao Bảo.
- Staff list/detail/create/edit/status.

UI
- Dùng DataTableShell, PageHeader, FilterShell, FormDialog/Dialog, AlertDialog, Tabs, Badge.
- `page.tsx` chỉ compose.
- Role/security matrix nên dùng table responsive và có summary dễ hiểu.

RBAC
- Chỉ admin thấy các route quản trị.
- User thường chỉ sửa hồ sơ của chính mình.

Suggested commit message: `feat: add system administration mock pages`
```

---

## Prompt 07 — Biểu mẫu thu thập và data record shell dùng chung

```txt
# TASK 07: Build shared data collection and record shell

MỤC TIÊU
Tạo UI dùng chung để 9 nhóm dữ liệu không lặp lại list/detail/form/workflow layout.

TẠO COMMON COMPONENTS
- DataModulePageShell
- DataRecordTable
- DataRecordDetail
- DataRecordFormDialog hoặc schema-driven form shell
- WorkflowStatusBadge
- SecurityLevelBadge
- ReportingPeriodPicker
- VillageSelect dùng master list
- OrganizationSelect
- RecordMetadataPanel
- VersionTimeline placeholder

ROUTES
- /dashboard/data-templates
- route detail template nếu cần

TÍNH NĂNG TEMPLATE
- List, detail, create, edit form template.
- Nhóm dữ liệu, tên biểu mẫu, phiên bản, đơn vị chủ trì, chu kỳ cập nhật, trạng thái.
- Danh sách field mock: key, label, type, required, validation.
- Download template Excel là UI mock + toast.
- Không cho đơn vị nghiệp vụ tự thay cấu trúc biểu mẫu chuẩn nếu không có quyền governance/admin.

DATA RECORD SHELL
- Chuẩn hóa action: view, create, edit, soft delete, submit.
- Có trạng thái draft/submitted/approved/published/returned/archived.
- Có security level và reporting period.
- Có empty/loading/error mock state.

Suggested commit message: `feat: add shared data collection components`
```

---

## Prompt 08 — Import/export, phê duyệt, công bố, tra cứu, version và thông báo

```txt
# TASK 08: Implement shared data workflow mock

MỤC TIÊU
Triển khai các chức năng dùng chung được lặp cho cả 9 nhóm dữ liệu.

ROUTES
- /dashboard/data-imports
- /dashboard/data-approvals
- /dashboard/data-publication
- /dashboard/data-versions
- /dashboard/data-search
- /dashboard/notifications

IMPORT MOCK
- Chọn nhóm dữ liệu, biểu mẫu, kỳ báo cáo, đơn vị, file.
- Preview tên file và trạng thái validate.
- Mock report: total rows, valid, duplicate, invalid.
- Table lỗi theo dòng/cột/message.
- Không parse file thật nếu làm tăng scope; interaction phải rõ là mô phỏng.

EXPORT MOCK
- Chọn format Excel/CSV/PDF tùy màn hình.
- Áp dụng current filters.
- Dialog xác nhận + toast.
- Không tuyên bố đã tạo file thật nếu chưa tạo.

APPROVAL
- Inbox theo role và unit.
- Unit leader approve/return có lý do.
- Data governance approve/return/publish.
- Timeline đầy đủ actor/time/action/note.

VERSION
- Hiển thị old/new values.
- Restore version mock chỉ governance/admin.
- Tạo audit event mock.

GLOBAL SEARCH
- Filter theo keyword, data group, village, reporting period, organization, status, security.
- Search result không được lộ record confidential không có quyền.

NOTIFICATIONS
- Reminder trước hạn, quá hạn, submitted, returned, approved, published.
- Read/unread mock.

Suggested commit message: `feat: add shared data workflow mock`
```

---

## Prompt 09 — Nhóm dữ liệu hành chính và dân cư

```txt
# TASK 09: Implement administrative and population data module

ROUTE
/dashboard/administrative-population

ĐƠN VỊ CHỦ TRÌ
Văn phòng HĐND và UBND xã.

TẦN SUẤT
Hằng quý hoặc khi có biến động lớn.

TABS/ENTITY
1. Thống kê thôn.
2. Dân số và hộ gia đình dạng tổng hợp.
3. Cơ cấu dân tộc.
4. Lao động trong độ tuổi.
5. BHYT và công dân số.
6. Biến động dân cư.

FIELDS CỐT LÕI
- villageCode, villageName.
- areaHa, population, householdCount.
- ethnicityName, populationCount, ratio.
- workingAgePopulation, employedCount.
- healthInsuranceCoverageRate.
- smartphoneUsageRate, internetUsageRate, onlinePaymentRate.
- changeType, changeCount, period, source.

QUY TẮC
- Tổng thôn phải khớp 8.303 ha, 23.135 người, 5.445 hộ.
- Không tạo danh sách công dân thật, CCCD hoặc địa chỉ cá nhân nhạy cảm.
- Dashboard module compute từ mock records.
- List/detail/create/edit/import/export/workflow dùng shared shell.

UI
- Summary cards toàn xã.
- Table theo thôn.
- Tab biến động theo kỳ.
- Link sang bản đồ khi record có geometry/center mock.

Suggested commit message: `feat: add administrative population module`
```

---

## Prompt 10 — Nhóm dữ liệu kinh tế

```txt
# TASK 10: Implement economic data module

ROUTE
/dashboard/economy

ĐƠN VỊ CHỦ TRÌ
Phòng Kinh tế.

TẦN SUẤT
Hằng quý; ngân sách có thể theo ngày/tuần/tháng trong mock reporting period.

TABS/ENTITY
1. Doanh nghiệp, HTX, tổ hợp tác, hộ kinh doanh.
2. Chợ, trung tâm thương mại, điểm dịch vụ, logistics.
3. Cơ sở sản xuất và sản phẩm OCOP.
4. Thu - chi ngân sách.
5. Dự án đầu tư công.

FIELDS
Business entity:
- name, organizationType, registrationCode/taxCode mock, village, address, coordinates, industry, registeredCapital, status, establishedDate.
Market/service point:
- name, type, address/coordinates, scale, managingUnit.
OCOP:
- productName, ownerName, starRating, recognitionYear, revenue, attachment metadata.
Budget:
- period, revenueInPeriod, cumulativeRevenue, estimate, samePeriodPreviousYear, revenueSource; expense categories.
Public investment:
- projectName, investor, totalInvestment, fundingSource, disbursementInPeriod, cumulativeDisbursement, planRatio, progress, coordinates.

RULES
- Mock tax/registration identifiers không dùng dữ liệu thật.
- Project có thể liên kết land-planning bằng relatedEntityId.
- KPI compute: active businesses, OCOP products, budget revenue/expense, disbursement rate.

Suggested commit message: `feat: add economic data module`
```

---

## Prompt 11 — Nhóm dữ liệu du lịch, thương mại và dịch vụ

```txt
# TASK 11: Implement tourism commerce and services module

ROUTE
/dashboard/tourism-services

ĐƠN VỊ CHỦ TRÌ
Phòng Văn hóa - Xã hội theo Kế hoạch UBND xã.

TẦN SUẤT
Hằng quý.

TABS/ENTITY
1. Điểm du lịch, di tích, danh thắng, điểm check-in.
2. Nhà hàng, khách sạn, nhà nghỉ, cơ sở lưu trú.
3. Điểm giới thiệu sản phẩm địa phương.
4. Thư viện hình ảnh và video.

FIELDS
Tourism point:
- name, type, description, village, coordinates, media, openingHours, contact mock, status.
Accommodation/service:
- name, type, address/coordinates, roomCount/capacity, rating, contact mock, operatingStatus.
Media asset:
- title, mediaType, mockUrl/local asset, linkedEntityType, linkedEntityId, caption, visibility.

RULES
- Không sử dụng hình ảnh bên ngoài không rõ bản quyền.
- Có thể dùng placeholder/local assets.
- Các điểm có tọa độ phải xuất hiện ở map layer du lịch sau task bản đồ.
- Dữ liệu public mới được dùng cho landing/public preview.

Suggested commit message: `feat: add tourism services module`
```

---

## Prompt 12 — Nhóm dữ liệu đất đai, quy hoạch và xây dựng

```txt
# TASK 12: Implement land planning and construction module

ROUTE
/dashboard/land-planning

ĐƠN VỊ CHỦ TRÌ
Phòng Kinh tế.

TẦN SUẤT
06 tháng/lần hoặc khi có biến động.

TABS/ENTITY
1. Hiện trạng sử dụng đất.
2. Quy hoạch sử dụng đất và quy hoạch xây dựng.
3. Hạ tầng kỹ thuật, công trình công cộng, trụ sở.
4. Khu vực phát triển đô thị.
5. Dự án đầu tư đang triển khai.

FIELDS
Land use:
- landType, areaHa, village, geometryId/geometry mock, ownerDisplay optional, reportingPeriod.
Planning:
- planName, approvalAuthority, planningPeriod, approvalDate, geometryId, attachment metadata, status.
Infrastructure:
- name, structureType, village, coordinates/geometry, managingUnit, condition, operatingStatus.
Urban/development area:
- name, type, geometryId, areaHa, status.

SECURITY/PRIVACY
- Chủ sử dụng chỉ hiển thị khi `isOwnerPublic = true`; mặc định mock không dùng tên người thật.
- Geometry mock ghi chú không phải ranh giới pháp lý.
- Liên kết project đầu tư công bằng ID, không duplicate dữ liệu.

Suggested commit message: `feat: add land planning module`
```

---

## Prompt 13 — Nhóm dữ liệu nông nghiệp và môi trường

```txt
# TASK 13: Implement agriculture and environment module

ROUTE
/dashboard/agriculture-environment

ĐƠN VỊ CHỦ TRÌ
Phòng Kinh tế.

TẦN SUẤT
Hằng quý.

TABS/ENTITY
1. Cây trồng.
2. Chăn nuôi.
3. Nuôi trồng và khai thác thủy sản.
4. Rừng.
5. Điểm ô nhiễm môi trường.
6. Hệ thống cấp nước.
7. Thu gom và xử lý rác thải.

FIELDS
Crop aggregate:
- cropCategory, cropName, village, plantedAreaHa, harvestAreaHa, newPlantingAreaHa, outputTons, previousPeriod, samePeriodLastYear.
Livestock:
- animalType, village, totalHerd, previousMonth, samePeriodLastYear, cumulativeLiveWeightTons.
Aquaculture:
- areaHa, cageCount, naturalCatchTons, farmedOutputTons, cumulativeOutputTons.
Forest:
- forestType, totalAreaHa, newPlantingAreaHa, harvestedAreaHa, output, coverageRate.
Environment:
- pollutionPointName, village, coordinates, pollutionType, severity, status.
Water/waste:
- cleanWaterCoverageRate, collectionRate, treatmentRate, householdSortingRate, facility status.

RULES
- Không tái sử dụng cây trồng/đặc sản hoặc DVMTR đặc thù Trà Tập nếu tài liệu Lao Bảo không yêu cầu.
- KPI/report compute từ entity data.
- Record có vị trí tạo spatial feature link.

Suggested commit message: `feat: add agriculture environment module`
```

---

## Prompt 14 — Nhóm dữ liệu giáo dục và y tế

```txt
# TASK 14: Implement education and health module

ROUTE
/dashboard/education-health

ĐƠN VỊ CHỦ TRÌ
Phòng Văn hóa - Xã hội; phối hợp Trạm Y tế xã và trường học.

TẦN SUẤT
Hằng quý.

TABS/ENTITY
1. Trường học và điểm trường.
2. Chỉ số lớp, giáo viên, học sinh.
3. Cơ sở y tế.
4. BHYT.
5. Tiêm chủng và chỉ tiêu y tế cơ bản.

FIELDS
School:
- name, educationLevel, village, address/coordinates, classCount, teacherCount, studentCount, nationalStandard, status.
Education indicator:
- period, educationLevel, schoolCount, classCount, teacherCount, studentCount, nationalStandardRate.
Health facility:
- name, facilityType, village, coordinates, staffingCount, status.
Health indicator:
- healthInsuranceCoverageRate, underOneFullVaccinationRate, basicHealthMetricName/value/unit, period, source.

PRIVACY
- Chỉ dùng số liệu tổng hợp.
- Không tạo hồ sơ bệnh án, danh sách trẻ em hoặc thông tin sức khỏe cá nhân.

Suggested commit message: `feat: add education health module`
```

---

## Prompt 15 — Nhóm dữ liệu an sinh xã hội

```txt
# TASK 15: Implement social welfare module

ROUTE
/dashboard/social-welfare

ĐƠN VỊ CHỦ TRÌ
Phòng Văn hóa - Xã hội.

TẦN SUẤT
Hằng quý.

TABS/ENTITY
1. Người có công và thân nhân.
2. Hộ nghèo, hộ cận nghèo dạng quản lý/tổng hợp phù hợp mock.
3. Đối tượng bảo trợ xã hội.
4. Người khuyết tật.
5. Người cao tuổi.
6. Trẻ em có hoàn cảnh đặc biệt.

FIELDS
Beneficiary mock:
- anonymizedName/displayCode, beneficiaryType, village, benefitType, allowanceAmount, recordStatus, certificateMeta.
Poverty indicator:
- village, period, newPoorHouseholds, newNearPoorHouseholds, cumulativePoorHouseholds, cumulativeNearPoorHouseholds, multidimensionalPovertyRate, samePeriodComparison.

PRIVACY
- Không dùng tên/CCCD/địa chỉ thật.
- Có helper mask tên hoặc display code.
- Commune leader xem tổng hợp; record-level chỉ role có permission.
- Export mock phải permission-filter.

Suggested commit message: `feat: add social welfare module`
```

---

## Prompt 16 — Nhóm dữ liệu quốc phòng và an ninh

```txt
# TASK 16: Implement security and defense module with strict mock security

ROUTE
/dashboard/security-defense

ĐƠN VỊ CHỦ TRÌ
Công an xã và Ban Chỉ huy Quân sự xã.

TẦN SUẤT
Theo quy định chuyên ngành.

TABS/ENTITY
1. Chỉ tiêu quốc phòng dạng tổng hợp.
2. Lực lượng dân quân dạng tổng hợp.
3. Chỉ tiêu tuyển quân.
4. Tình hình an ninh trật tự.
5. PCCC.
6. Phòng chống ma túy và tệ nạn xã hội dạng tổng hợp.

SECURITY BẮT BUỘC
- Bao phủ các feature code `DATA-SECDEF-01` đến `DATA-SECDEF-08`, đặc biệt `DATA-SECDEF-07` là dòng BA không có STT nằm giữa 84–86.
- Module mặc định `securityLevel = confidential`.
- Không dùng tên người, vị trí quân sự thật, số liệu thật hoặc mô tả nghiệp vụ nhạy cảm.
- Không tạo polygon “khu vực quốc phòng” có vẻ là dữ liệu thực.
- Chỉ dùng dữ liệu giả tổng hợp, địa điểm generic hoặc geometry không hiển thị.
- Chỉ user có `viewConfidential` và allowedDataGroup mới load records.
- Route guard, service filter, export filter và map layer filter đều phải áp dụng.
- Không chỉ ẩn UI bằng CSS.

YÊU CẦU BACKEND TƯƠNG LAI — PHẢI GHI RÕ TRONG UI/DOCS, KHÔNG GIẢ LẬP LÀ ĐÃ CÓ THẬT
- Encryption at rest cho toàn bộ dữ liệu Quốc phòng - An ninh.
- Xác thực 2 lớp (2FA) bắt buộc trước khi truy cập hoặc xuất dữ liệu QP-AN.
- Audit stream riêng cho mọi lần access/view/export QP-AN.
- Báo cáo định kỳ các lượt truy cập/xuất cho lãnh đạo xã.
- FE mock hiện tại chỉ tạo security requirement metadata, badge/trạng thái “Backend required”, và 2FA gate mock không xác thực thật.
- Không lưu secret, OTP, encryption key hoặc payload nhạy cảm trong source/mock data/localStorage.

FIELDS TỔNG HỢP
- period, metricType, count, unit, status.
- incidentCategory, totalCases, resolvedCases, unresolvedCases.
- fireSafetyFacilityCount, inspections, incidents.
- recruitmentTarget, completedCount.

UI
- Có banner cảnh báo dữ liệu hạn chế.
- Có security requirements panel hiển thị: encryption at rest, mandatory 2FA, dedicated audit log — trạng thái `planned/backend-required`.
- Trước action xem chi tiết hoặc export, hiển thị 2FA challenge mock; không khẳng định xác thực thật.
- Commune leader chỉ xem các summary được phép.

Suggested commit message: `feat: add secured defense data module`
```

---

## Prompt 17 — Nhóm phòng chống thiên tai và điều hành khẩn cấp

```txt
# TASK 17: Implement disaster prevention and emergency module

ROUTE
/dashboard/disaster-emergency

ĐƠN VỊ CHỦ TRÌ
Ban Chỉ huy Phòng thủ dân sự xã, đầu mối Phòng Kinh tế.

TẦN SUẤT
Theo quy định chuyên ngành; mock hỗ trợ trạng thái realtime-like nhưng không gọi dữ liệu thật.

TABS/ENTITY
1. Điểm nguy cơ sạt lở.
2. Điểm ngập lụt.
3. Khu vực xung yếu.
4. Công trình phòng chống thiên tai.
5. Lực lượng, phương tiện và vật tư “4 tại chỗ”.
6. Sự kiện/cảnh báo khẩn cấp.

FIELDS
Risk point:
- name, riskType, village, coordinates, riskLevel, affectedPopulationEstimate, status, lastAssessmentDate.
Facility:
- name, facilityType, location, managingUnit, condition, capacity.
Resource:
- resourceType, quantity, unit, storageLocation generic, readinessStatus.
Emergency event:
- eventType, startAt, severity, status, affectedVillages, summary, source mock.

SECURITY
- Các record khẩn cấp có thể `shared` hoặc `confidential` theo loại.
- Không dùng vị trí nhạy cảm thật.
- Bản đồ chỉ hiển thị record được phép.

UI
- Status board.
- Alert cards.
- Table/filter/detail.
- Link map và fit-to-feature.

Suggested commit message: `feat: add disaster emergency module`
```

---

## Prompt 18 — Leaflet foundation và nền bản đồ Lao Bảo

```txt
# TASK 18: Add Leaflet map foundation

MỤC TIÊU
Cài và cấu hình Leaflet/React Leaflet an toàn với Next.js App Router; tạo map shell cho Lao Bảo.

DEPENDENCIES
- leaflet
- react-leaflet
- @types/leaflet nếu cần
- Không cài thư viện bản đồ khác nếu chưa được yêu cầu.

TẠO
- src/components/map/map-shell.tsx
- src/components/map/map-client.tsx
- src/components/map/base-layer-switcher.tsx
- src/components/map/map-loading.tsx
- src/components/map/map-error-boundary.tsx nếu phù hợp
- src/lib/map-config.ts
- src/data/mock-laobao-boundary.geojson hoặc TS GeoJSON mock
- src/types/map.ts cập nhật
- /dashboard/map

NEXT.JS RULES
- Leaflet component client-only.
- Dynamic import với `ssr: false` tại boundary phù hợp.
- Fix icon asset path đúng cách; không dùng hack global thiếu kiểm soát.
- Import Leaflet CSS đúng vị trí.

MAP DATA
- Center/zoom mock hợp lý cho Lao Bảo.
- Boundary/12 thôn nếu chưa có nguồn chính thức phải gắn metadata:
  - geometryStatus: mock
  - disclaimer: “Dữ liệu ranh giới minh họa, chưa dùng cho mục đích pháp lý”.
- sourceCrs = VN-2000; displayCrs = EPSG:4326.
- Không tuyên bố đã chuyển đổi dữ liệu chính thức.

BASE LAYERS
- Dùng tile source được phép và cấu hình attribution đầy đủ.
- Không hard-code Google tiles không có quyền sử dụng.
- Thiết kế config để thêm street/satellite/terrain về sau.

UI
- Full-height responsive trong dashboard.
- Dark mode container phù hợp.
- Loading, error, empty state.

Suggested commit message: `feat: add Leaflet map foundation`
```

---

## Prompt 19 — Layer, popup, search, tools, export mock và map permission

```txt
# TASK 19: Implement smart map layers and permissions

MỤC TIÊU
Hoàn thiện chức năng bản đồ số thông minh theo 9 nhóm dữ liệu.

ROUTES
- /dashboard/map
- /dashboard/map/layers
- /dashboard/map/features

COMPONENTS
- LayerControlPanel
- MapLegend
- MapSearch
- FeaturePopup
- MapToolbar
- FeatureDetailsDrawer
- LayerFormDialog
- MapExportDialog

LAYER CONTRACT
- id, name, dataGroup, geometryType point/line/polygon.
- order, visibleByDefault, styleConfig, securityLevel.
- allowedRoles/permissions.
- source, updateFrequency, status.

FUNCTIONS
1. Bật/tắt và sắp xếp layer.
2. Popup thuộc tính, ảnh local/placeholder, link sang record nghiệp vụ.
3. Search theo tên địa điểm/đối tượng; chọn kết quả thì zoom/focus.
4. Filter theo nhóm dữ liệu, thôn, security level được phép.
5. Đo khoảng cách/diện tích chỉ khi có implementation ổn định; nếu chưa, tạo tool mock được ghi rõ.
6. Export/in bản đồ là dialog mock + toast, không tuyên bố có file thật.
7. CRUD layer và spatial feature mock cho governance/admin.

SECURITY
- Permission filter chạy trước khi build layer collection.
- Layer confidential không xuất hiện trong layer list, search index, legend, export và popup của user không có quyền.
- Public preview không có security/defense và emergency confidential.

DATA
- Tạo spatial features mock liên kết record từ 9 module đã triển khai.
- Không duplicate business record; dùng `linkedEntityType` + `linkedEntityId`.

Suggested commit message: `feat: add smart map layer management`
```

---

## Prompt 20 — Bộ chỉ số, dashboard lãnh đạo và báo cáo phân tích

```txt
# TASK 20: Implement indicator catalog, leadership dashboard and reports

ROUTES
- /dashboard
- /dashboard/indicators
- /dashboard/reports

MỤC TIÊU
Quản lý toàn bộ bộ chỉ số theo cấu trúc tài liệu, nhưng dashboard chính không được quá tải.

INDICATOR MODEL
- category: dailyMonthly | socioEconomicPlan | emergency | assignedTasks.
- code, name, unit, description.
- reportingUnit, frequency, databaseCatalog, databaseOwner, source.
- currentValue, previousValue, targetValue, period.
- securityLevel, status.

SỐ LƯỢNG BẮT BUỘC THEO 4 CỤM
| Category | Ký hiệu | Số nhóm bắt buộc | Indicator code |
|---|---:|---:|---|
| Điều hành hằng ngày/hằng tháng | A | 31 | `IND-A-001` → `IND-A-031` |
| Theo dõi kế hoạch kinh tế - xã hội quý/năm | B | 24 | `IND-B-001` → `IND-B-024` |
| Tình huống khẩn cấp | C | 6 | `IND-C-001` → `IND-C-006` |
| Theo dõi nhiệm vụ được giao | D | 1 | `IND-D-001` |
| **Tổng** |  | **62** |  |

QUY TẮC
- Tạo catalog đúng **62/62 nhóm chỉ số**, không dùng từ “khoảng”.
- Tạo helper/assertion kiểm tra count theo từng category: A=31, B=24, C=6, D=1 và total=62.
- Trang catalog phải hiển thị count badge theo category để review thiếu/thừa.
- Không cần hard-code mọi giá trị trong component.
- Dữ liệu chỉ số nằm trong `src/data` và compute/tổng hợp từ module khi có thể.
- Các chỉ số chưa có nguồn mock rõ ràng đánh dấu `dataStatus: unavailable | mock | computed`.

DASHBOARD CHÍNH
- Dành cho commune_leader, data_governance, admin theo quyền.
- Tối đa khoảng 8–12 KPI trọng tâm trên viewport đầu.
- Sections/tabs:
  1. Điều hành thường xuyên.
  2. Kế hoạch kinh tế - xã hội.
  3. Khẩn cấp.
  4. Nhiệm vụ được giao.
- Có update freshness, source và security badge.
- Alert list: dữ liệu quá hạn, hồ sơ chờ duyệt, sự kiện thiên tai, chỉ số không đạt.

INDICATOR CATALOG PAGE
- List/search/filter theo category, frequency, unit, owner, status.
- Detail hiển thị metadata và lịch sử kỳ.

REPORTS
- Báo cáo theo 9 nhóm dữ liệu.
- Báo cáo điều hành tổng hợp.
- Filter: period, village, organization, data group, security, status.
- Export PDF/Word/Excel là mock dialog + toast.
- Không đưa record confidential vào report không đủ quyền.

CHARTS
- Tái sử dụng chart solution hiện có; không cài chart library mới nếu không cần.
- Charts responsive, dark mode, accessible label.

Suggested commit message: `feat: add leadership indicators and reports`
```

---

## Prompt 21 — Audit log, backup, update frequency, integration và IOC placeholder

```txt
# TASK 21: Implement governance settings and future integration placeholders

ROUTES
- /dashboard/audit-logs
- /dashboard/backups
- /dashboard/integrations
- /dashboard/settings

AUDIT LOG
- access, view, create, update, delete/soft-delete, import, export, submit, approve, return, publish, version restore.
- actor, role, organization, time, module, entity, description, IP mock.
- Security events không hiển thị payload nhạy cảm.
- Bổ sung event class riêng cho yêu cầu `DATA-SECDEF-07`:
  - `qp_an_access`
  - `qp_an_export`
  - `qp_an_2fa_challenge` (mock status only)
- Thêm filter/tag nổi bật **“QP-AN access & export log”**; chỉ admin, data_governance và commune_leader được phép xem theo RBAC.
- Log QP-AN chỉ lưu metadata tối thiểu: actor, role, organization, action, targetFeatureCode, timestamp, result, reasonCode; không lưu record payload hoặc vị trí nhạy cảm.
- Tạo periodic security report mock theo tháng/quý cho lãnh đạo xã: số lượt access, export, denied, failed 2FA mock, phân theo đơn vị/người dùng.
- Action xuất báo cáo định kỳ chỉ là dialog/toast hoặc client mock; phải gắn nhãn “Mock — backend reporting required”.

BACKUP MOCK
- Schedule daily/weekly/monthly.
- Retention setting mock.
- Backup list: status, startedAt, completedAt, size mock, initiatedBy.
- Restore confirmation bằng AlertDialog.
- Ghi rõ UI mock, không sao lưu thật.

UPDATE FREQUENCY
- Cấu hình theo từng data group.
- daily/weekly/monthly/quarterly/yearly/onChange/specialized.
- Reminder trước hạn 3 ngày và overdue mock.
- Rule ngày 20 tháng cuối quý thể hiện bằng config/description, không background job thật.

INTEGRATIONS
- Danh mục connector placeholder: dân cư, dịch vụ công, văn bản điều hành, thống kê ngành, tỉnh/IOC.
- Status: planned, configured, disabled, error mock.
- Không tạo API key thật.
- Không gọi endpoint thật.

IOC/AI
- Chỉ hiển thị roadmap 2027–2028 và trạng thái “Chưa kết nối”.
- Không mô phỏng như dữ liệu realtime thật.

Suggested commit message: `feat: add governance settings and integration placeholders`
```

---

## Prompt 22 — Landing page Lao Bảo và public data boundary

```txt
# TASK 22: Build Lao Bao landing page and public boundary

MỤC TIÊU
Viết lại landing page hoàn toàn cho hệ thống Lao Bảo; không còn nội dung nông nghiệp Trà Tập.

TÊN
Kho dữ liệu số, Bản đồ số thông minh và Trung tâm điều hành thông minh xã Lao Bảo

NỘI DUNG ĐỀ XUẤT
1. Hero: hệ sinh thái dữ liệu số phục vụ quản lý, chỉ đạo và điều hành.
2. Ba trụ cột: Kho dữ liệu số, Bản đồ số thông minh, Dashboard điều hành.
3. 9 nhóm dữ liệu.
4. Quy trình dữ liệu: thu thập → chuẩn hóa → phê duyệt → công bố → khai thác.
5. Lộ trình 2026, 2027, 2028.
6. Lợi ích cho lãnh đạo, cán bộ, cơ quan/đơn vị và người dân/doanh nghiệp.
7. An toàn dữ liệu và phân quyền.
8. CTA đăng nhập và xem demo dashboard/map nếu route được phép.
9. Footer.

PUBLIC DATA RULES
- Không hiển thị dữ liệu confidential.
- Không hiển thị security/defense layer hoặc chi tiết cá nhân.
- Nếu có public map preview, chỉ dùng layer public và geometry mock có disclaimer.
- Không tuyên bố IOC/AI đã vận hành thật.

UI
- Giữ theme/source style.
- Responsive và dark mode.
- Dùng shadcn Button/Card/Badge/Tabs nếu cần.
- Không dùng hình/logo ngoài không rõ bản quyền.

Suggested commit message: `feat: rebuild Lao Bao public landing page`
```

---

## Prompt 23 — Final consistency audit và QA toàn dự án

```txt
# TASK 23: Final Lao Bao consistency audit and QA

MỤC TIÊU
Kiểm tra toàn bộ source sau khi hoàn thành chuỗi task; không mở rộng tính năng mới.

A. LEGACY SCAN
Tìm toàn repo:
- Trà Tập, Tra Tap, Nam Trà My, Quảng Nam, Đà Nẵng trong context cũ.
- Tên 8 thôn legacy.
- districtCode, districtName.
- hamletCode, hamletName.
- Route/module legacy không còn được dùng.

Phân biệt:
- Tài liệu archive có thể nhắc legacy nếu được ghi rõ.
- Source runtime/UI/mock data không được còn dữ liệu legacy.

B. ADMIN DATA CONSISTENCY
- Chỉ 12 thôn chuẩn.
- Không duplicate danh sách thôn.
- Tổng area/population/households chính xác.
- Không có huyện trên UI, filter, type mới.

C. FEATURE COVERAGE
- `docs/laobao/02-feature-matrix.md` có đúng 110 dòng `featureCode` unique, khớp registry mục 12.
- Không dùng STT BA làm ID runtime; `DATA-SECDEF-07` có `sourceStt = null` và note giữa 84–86.
- Mỗi feature có target route/task/status hoặc backlog reason rõ ràng.
- 9 nhóm dữ liệu.
- Shared data workflow.
- Map.
- Indicator/dashboard/report.
- User/RBAC/security.
- Audit/backup/settings/integration placeholder.
- Landing/login.

D. RBAC & SECURITY TEST
Test demo user cho cả 5 role:
- Menu visibility.
- Direct route access.
- Actions.
- Organization/data/village scope.
- Confidential record filtering.
- Confidential map layer/search/export filtering.
- QP-AN có 2FA gate mock, backend-required encryption note, dedicated access/export log filter và periodic report mock.

E. UI QA
- 375px, 768px, 1440px.
- Sidebar/mobile menu.
- Tables không overflow không kiểm soát.
- Dialog/Sheet usable.
- Light/dark.
- Loading/empty/error.
- Keyboard focus cơ bản và labels.

F. CODE QUALITY
- Không any/ts-ignore/ts-nocheck.
- Không hard-code colors sai policy.
- Không broken route/import.
- Không unused code rõ ràng.
- Page compose, logic tách hợp lý.
- Comment source English.

G. COMMANDS
- npm run lint
- npx tsc --noEmit
- npm run build

H. DOCS
- Cập nhật 00-context-core nếu quyết định thay đổi.
- Validate feature registry 110/110 và indicator catalog A=31, B=24, C=6, D=1, total=62.
- Cập nhật feature matrix, route map, contracts, RBAC, progress.
- Cập nhật model handoff trạng thái hoàn tất.
- Tạo `docs/laobao/09-final-qa-report.md` ghi rõ pass/fail và backlog.

Không commit, không push. Dừng để review cuối.

Suggested commit message: `chore: complete Lao Bao final quality audit`
```

---

# 9. Prompt commit sau khi đã Accept và bấm OK

Dùng prompt này sau **mỗi task**, chỉ khi đã review và chấp nhận thay đổi.

```txt
# COMMIT AFTER ACCEPT

Tôi đã review, Accept các file chỉnh sửa và xác nhận OK cho TASK [TASK_NUMBER].

Hãy thực hiện:
1. Chạy `git status --short`.
2. Xác nhận chỉ stage các file thuộc TASK [TASK_NUMBER]. Nếu có file ngoài scope, không stage và báo lại.
3. Chạy lại nếu cần:
   - npm run lint
   - npx tsc --noEmit
   - npm run build
4. Stage đúng file.
5. Commit với message tiếng Anh:
   `[PASTE_SUGGESTED_COMMIT_MESSAGE]`
6. Chạy:
   - git status --short
   - git log -1 --oneline
7. Cập nhật `docs/laobao/06-progress.md` trước commit nếu trạng thái task chưa được đánh dấu hoàn thành.
8. Báo cáo bằng tiếng Việt commit hash ngắn, message và trạng thái working tree.
9. Không push.
```

---

# 10. Prompt push cuối cùng

Chỉ dùng một lần khi toàn bộ task và final QA đã được commit.

```txt
# FINAL PUSH

Không sửa code.

1. Chạy:
   - git status --short
   - git log --oneline --decorate -15
   - git branch --show-current
   - git remote -v
2. Nếu working tree không sạch, dừng và báo bằng tiếng Việt; không push.
3. Nếu có commit chưa qua final QA hoặc task chưa hoàn tất trong `docs/laobao/06-progress.md`, dừng và báo.
4. Nếu mọi thứ hợp lệ, tóm tắt danh sách commit sẽ push và chờ tôi xác nhận lần cuối.
5. Chỉ sau khi tôi trả lời rõ “PUSH”, mới chạy `git push` cho branch hiện tại.
6. Không force push.
7. Báo cáo kết quả bằng tiếng Việt.
```

---

# 11. Bảng commit message đề xuất

| Task | Commit message                                               |
| ---: | ------------------------------------------------------------ |
|   00 | `docs: add Lao Bao project context pack`                     |
|   01 | `refactor: remove legacy Tra Tap app identity`               |
|   02 | `feat: add Lao Bao administrative master data`               |
|   03 | `feat: update Lao Bao navigation shell`                      |
|   04 | `feat: add shared data governance contracts`                 |
|   05 | `feat: implement scoped RBAC for Lao Bao`                    |
|   06 | `feat: add system administration mock pages`                 |
|   07 | `feat: add shared data collection components`                |
|   08 | `feat: add shared data workflow mock`                        |
|   09 | `feat: add administrative population module`                 |
|   10 | `feat: add economic data module`                             |
|   11 | `feat: add tourism services module`                          |
|   12 | `feat: add land planning module`                             |
|   13 | `feat: add agriculture environment module`                   |
|   14 | `feat: add education health module`                          |
|   15 | `feat: add social welfare module`                            |
|   16 | `feat: add secured defense data module`                      |
|   17 | `feat: add disaster emergency module`                        |
|   18 | `feat: add Leaflet map foundation`                           |
|   19 | `feat: add smart map layer management`                       |
|   20 | `feat: add leadership indicators and reports`                |
|   21 | `feat: add governance settings and integration placeholders` |
|   22 | `feat: rebuild Lao Bao public landing page`                  |
|   23 | `chore: complete Lao Bao final quality audit`                |

---

# 12. Stable Feature Registry — 110 chức năng BA

> Registry này là nguồn mã ổn định để Antigravity copy vào `docs/laobao/02-feature-matrix.md`. Không đổi mã theo STT hoặc khi BA sắp xếp lại dòng.
> `sourceStt` chỉ phục vụ truy vết tài liệu. Dòng `DATA-SECDEF-07` không có STT trong BA và nằm giữa STT 84–86.

| featureCode         |        STT gốc | Nhóm                                        | Mô tả ngắn                                                  |
| ------------------- | -------------: | ------------------------------------------- | ----------------------------------------------------------- |
| `SYS-AUTH-01`       |              1 | Quản lý xác thực                            | Đăng nhập                                                   |
| `SYS-AUTH-02`       |              2 | Quản lý xác thực                            | Đặt lại mật khẩu                                            |
| `SYS-AUTH-03`       |              3 | Quản lý xác thực                            | Đăng xuất                                                   |
| `SYS-PROFILE-01`    |              4 | Hồ sơ người dùng                            | Chỉnh sửa hồ sơ                                             |
| `SYS-PROFILE-02`    |              5 | Hồ sơ người dùng                            | Đổi mật khẩu                                                |
| `SYS-USER-01`       |              6 | Quản lý tài khoản người dùng                | Xem danh sách tài khoản người dùng                          |
| `SYS-USER-02`       |              7 | Quản lý tài khoản người dùng                | Tạo mới tài khoản                                           |
| `SYS-USER-03`       |              8 | Quản lý tài khoản người dùng                | Chỉnh sửa tài khoản                                         |
| `SYS-USER-04`       |              9 | Quản lý tài khoản người dùng                | Thay đổi trạng thái                                         |
| `SYS-USER-05`       |             10 | Quản lý tài khoản người dùng                | Gán quyền vào tài khoản                                     |
| `SYS-ROLE-01`       |             11 | Quản lý nhóm người dùng                     | Xem danh sách role                                          |
| `SYS-ROLE-02`       |             12 | Quản lý nhóm người dùng                     | Tạo mới role                                                |
| `SYS-ROLE-03`       |             13 | Quản lý nhóm người dùng                     | Chỉnh sửa role                                              |
| `SYS-ROLE-04`       |             14 | Quản lý nhóm người dùng                     | Xoá nhóm người dùng                                         |
| `SYS-ORG-01`        |             15 | Quản lý tổ chức                             | Xem danh sách tổ chức                                       |
| `SYS-ORG-02`        |             16 | Quản lý tổ chức                             | Tạo mới chi nhánh/phòng ban                                 |
| `SYS-ORG-03`        |             17 | Quản lý tổ chức                             | Chỉnh sửa chi nhánh/phòng ban                               |
| `SYS-ORG-04`        |             18 | Quản lý tổ chức                             | Xóa chi nhánh/phòng ban                                     |
| `SYS-STAFF-01`      |             19 | Quản lý cán bộ nhân viên                    | Xem danh sách cán bộ nhân viên                              |
| `SYS-STAFF-02`      |             20 | Quản lý cán bộ nhân viên                    | Tạo mới nhân viên                                           |
| `SYS-STAFF-03`      |             21 | Quản lý cán bộ nhân viên                    | Chỉnh sửa thông tin nhân viên                               |
| `SYS-STAFF-04`      |             22 | Quản lý cán bộ nhân viên                    | Thay đổi trạng thái                                         |
| `SYS-AUDIT-01`      |             23 | Nhật ký hoạt động                           | Audit log                                                   |
| `SYS-BACKUP-01`     |             24 | Sao lưu và lưu trữ                          | Backup dữ liệu định kỳ                                      |
| `SYS-BACKUP-02`     |             25 | Sao lưu và lưu trữ                          | Xóa mềm dữ liệu                                             |
| `SYS-BACKUP-03`     |             26 | Sao lưu và lưu trữ                          | Khôi phục dữ liệu đã xóa mềm                                |
| `SYS-CONFIG-01`     |             27 | Cấu hình hệ thống                           | Cấu hình tần suất cập nhật cho từng nhóm dữ liệu            |
| `SYS-CONFIG-02`     |             28 | Cấu hình hệ thống                           | Kết nối, đồng bộ dữ liệu từ CSDL/nền tảng dùng chung        |
| `DATA-ADMINPOP-01`  |             30 | Hành chính và dân cư                        | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-ADMINPOP-02`  |             31 | Hành chính và dân cư                        | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-ADMINPOP-03`  |             32 | Hành chính và dân cư                        | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-ADMINPOP-04`  |             33 | Hành chính và dân cư                        | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-ADMINPOP-05`  |             34 | Hành chính và dân cư                        | Phê duyệt và công bố dữ liệu                                |
| `DATA-ADMINPOP-06`  |             35 | Hành chính và dân cư                        | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-ADMINPOP-07`  |             36 | Hành chính và dân cư                        | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-ECON-01`      |             37 | Kinh tế                                     | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-ECON-02`      |             38 | Kinh tế                                     | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-ECON-03`      |             39 | Kinh tế                                     | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-ECON-04`      |             40 | Kinh tế                                     | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-ECON-05`      |             41 | Kinh tế                                     | Phê duyệt và công bố dữ liệu                                |
| `DATA-ECON-06`      |             42 | Kinh tế                                     | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-ECON-07`      |             43 | Kinh tế                                     | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-TOUR-01`      |             44 | Du lịch, thương mại và dịch vụ              | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-TOUR-02`      |             45 | Du lịch, thương mại và dịch vụ              | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-TOUR-03`      |             46 | Du lịch, thương mại và dịch vụ              | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-TOUR-04`      |             47 | Du lịch, thương mại và dịch vụ              | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-TOUR-05`      |             48 | Du lịch, thương mại và dịch vụ              | Phê duyệt và công bố dữ liệu                                |
| `DATA-TOUR-06`      |             49 | Du lịch, thương mại và dịch vụ              | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-TOUR-07`      |             50 | Du lịch, thương mại và dịch vụ              | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-LAND-01`      |             51 | Đất đai, quy hoạch và xây dựng              | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-LAND-02`      |             52 | Đất đai, quy hoạch và xây dựng              | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-LAND-03`      |             53 | Đất đai, quy hoạch và xây dựng              | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-LAND-04`      |             54 | Đất đai, quy hoạch và xây dựng              | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-LAND-05`      |             55 | Đất đai, quy hoạch và xây dựng              | Phê duyệt và công bố dữ liệu                                |
| `DATA-LAND-06`      |             56 | Đất đai, quy hoạch và xây dựng              | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-LAND-07`      |             57 | Đất đai, quy hoạch và xây dựng              | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-AGRIENV-01`   |             58 | Nông nghiệp và môi trường                   | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-AGRIENV-02`   |             59 | Nông nghiệp và môi trường                   | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-AGRIENV-03`   |             60 | Nông nghiệp và môi trường                   | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-AGRIENV-04`   |             61 | Nông nghiệp và môi trường                   | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-AGRIENV-05`   |             62 | Nông nghiệp và môi trường                   | Phê duyệt và công bố dữ liệu                                |
| `DATA-AGRIENV-06`   |             63 | Nông nghiệp và môi trường                   | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-AGRIENV-07`   |             64 | Nông nghiệp và môi trường                   | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-EDUHEALTH-01` |             65 | Giáo dục và y tế                            | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-EDUHEALTH-02` |             66 | Giáo dục và y tế                            | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-EDUHEALTH-03` |             67 | Giáo dục và y tế                            | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-EDUHEALTH-04` |             68 | Giáo dục và y tế                            | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-EDUHEALTH-05` |             69 | Giáo dục và y tế                            | Phê duyệt và công bố dữ liệu                                |
| `DATA-EDUHEALTH-06` |             70 | Giáo dục và y tế                            | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-EDUHEALTH-07` |             71 | Giáo dục và y tế                            | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-WELFARE-01`   |             72 | An sinh xã hội                              | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-WELFARE-02`   |             73 | An sinh xã hội                              | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-WELFARE-03`   |             74 | An sinh xã hội                              | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-WELFARE-04`   |             75 | An sinh xã hội                              | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-WELFARE-05`   |             76 | An sinh xã hội                              | Phê duyệt và công bố dữ liệu                                |
| `DATA-WELFARE-06`   |             77 | An sinh xã hội                              | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-WELFARE-07`   |             78 | An sinh xã hội                              | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-SECDEF-01`    |             79 | Quốc phòng và an ninh                       | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-SECDEF-02`    |             80 | Quốc phòng và an ninh                       | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-SECDEF-03`    |             81 | Quốc phòng và an ninh                       | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-SECDEF-04`    |             82 | Quốc phòng và an ninh                       | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-SECDEF-05`    |             83 | Quốc phòng và an ninh                       | Phê duyệt và công bố dữ liệu                                |
| `DATA-SECDEF-06`    |             84 | Quốc phòng và an ninh                       | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-SECDEF-07`    | — (giữa 84–86) | Quốc phòng và an ninh                       | Cơ chế phân quyền, mã hóa dữ liệu nhóm Quốc phòng - An ninh |
| `DATA-SECDEF-08`    |             86 | Quốc phòng và an ninh                       | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `DATA-DISASTER-01`  |             87 | Phòng chống thiên tai và điều hành khẩn cấp | Xem danh sách toàn bộ dữ liệu                               |
| `DATA-DISASTER-02`  |             88 | Phòng chống thiên tai và điều hành khẩn cấp | Biểu mẫu thu thập, chuẩn hóa dữ liệu                        |
| `DATA-DISASTER-03`  |             89 | Phòng chống thiên tai và điều hành khẩn cấp | Nhập liệu thủ công theo lĩnh vực                            |
| `DATA-DISASTER-04`  |             90 | Phòng chống thiên tai và điều hành khẩn cấp | Nhập/xuất dữ liệu hàng loạt (Excel/CSV)                     |
| `DATA-DISASTER-05`  |             91 | Phòng chống thiên tai và điều hành khẩn cấp | Phê duyệt và công bố dữ liệu                                |
| `DATA-DISASTER-06`  |             92 | Phòng chống thiên tai và điều hành khẩn cấp | Tra cứu, tìm kiếm dữ liệu tổng hợp toàn kho                 |
| `DATA-DISASTER-07`  |             93 | Phòng chống thiên tai và điều hành khẩn cấp | Quản lý phiên bản và lịch sử thay đổi dữ liệu               |
| `SYS-NOTIFY-01`     |             94 | Thông báo                                   | Xem danh sách thông báo                                     |
| `MAP-01`            |             95 | Bản đồ số thông minh                        | Nền bản đồ hành chính xã Lao Bảo                            |
| `MAP-02`            |             96 | Bản đồ số thông minh                        | Quản lý lớp dữ liệu không gian (layer) theo lĩnh vực        |
| `MAP-03`            |             97 | Bản đồ số thông minh                        | Xem chi tiết thông tin đối tượng trên bản đồ                |
| `MAP-04`            |             98 | Bản đồ số thông minh                        | Tìm kiếm địa điểm, đối tượng trên bản đồ                    |
| `MAP-05`            |             99 | Bản đồ số thông minh                        | Tích hợp bản đồ nền/ảnh vệ tinh                             |
| `MAP-06`            |            100 | Bản đồ số thông minh                        | Xây dựng, nâng cấp Bản đồ số phiên bản 2.0                  |
| `MAP-07`            |            101 | Bản đồ số thông minh                        | Xuất bản đồ chuyên đề                                       |
| `MAP-08`            |            102 | Bản đồ số thông minh                        | Phân quyền truy cập lớp dữ liệu bản đồ                      |
| `DASH-01`           |            103 | Dashboard điều hành lãnh đạo                | Xem dashboard tổng quan                                     |
| `DASH-02`           |            104 | Dashboard điều hành lãnh đạo                | Xuất dashboard tổng quan                                    |
| `REPORT-01`         |            105 | Báo cáo phân tích                           | Xem báo cáo                                                 |
| `REPORT-02`         |            106 | Báo cáo phân tích                           | Xuất báo cáo                                                |
| `IOC-01`            |            107 | Định hướng tích hợp IOC                     | Tích hợp API/kết nối nền tảng IOC dùng chung của tỉnh       |
| `IOC-02`            |            108 | Định hướng tích hợp IOC                     | Chuẩn bị hạ tầng, dữ liệu sẵn sàng tích hợp IOC             |
| `IOC-03`            |            109 | Định hướng tích hợp IOC                     | Giám sát, cảnh báo tổng hợp đa lĩnh vực (khi đủ điều kiện)  |
| `AI-01`             |            110 | Nghiên cứu ứng dụng AI                      | Trợ lý AI tra cứu dữ liệu bằng ngôn ngữ tự nhiên            |
| `AI-02`             |            111 | Nghiên cứu ứng dụng AI                      | AI Nghiên cứu phân tích, dự báo hỗ trợ ra quyết định        |

---

# 13. Checklist không được thay đổi trong suốt dự án

- [ ] Chỉ xã Lao Bảo, tỉnh Quảng Trị.
- [ ] Không còn huyện trong model mới.
- [ ] Chỉ 12 thôn chuẩn, một master source.
- [ ] Tổng 8.303 ha, 23.135 người, 5.445 hộ.
- [ ] `01-administrative-data.md` ghi đúng nguồn danh sách 12 thôn: context riêng theo Nghị quyết 1680, không phải hai DOCX.
- [ ] Feature registry đúng 110 mã unique; `DATA-SECDEF-07` giữ `sourceStt = null`.
- [ ] Không lẫn tên/dữ liệu Trà Tập trong runtime.
- [ ] 9 nhóm dữ liệu theo Kế hoạch.
- [ ] 5 role runtime đã chốt.
- [ ] Security level public/shared/confidential.
- [ ] Workflow 3 bước trước khi công bố.
- [ ] Leaflet hiển thị EPSG:4326; VN-2000 chỉ là source metadata nếu chưa chuyển đổi thật.
- [ ] Geometry mock có disclaimer.
- [ ] Confidential data/layer được filter trước render/search/export.
- [ ] QP-AN ghi rõ encryption/2FA là backend future requirement; có dedicated access/export log và periodic report mock.
- [ ] Indicator catalog đủ A=31, B=24, C=6, D=1, tổng 62.
- [ ] Shadcn-first, semantic tokens, dark mode, responsive.
- [ ] Type trong `src/types`, mock data trong `src/data`.
- [ ] Dashboard/report compute từ data.
- [ ] Comment source và commit English; chat summary Vietnamese.
- [ ] Mỗi task build/test/fix, review, Accept, OK rồi commit.
- [ ] Không push cho tới bước cuối.
