# Prompt Antigravity — AI Assistant & Decision Support Mockup cho xã Lao Bảo

> Dùng file này như một prompt độc lập để giao cho Antigravity triển khai phần AI mockup.
>
> Phạm vi: giao diện FE + mock data + mock interaction. Không tích hợp mô hình AI, API LLM hoặc backend inference thật.

---

## PROMPT GỬI ANTIGRAVITY

```txt
# TASK: Xây dựng AI Assistant và AI Decision Support Mockup cho hệ thống Lao Bảo

Bạn đang làm việc trong source dự án:

Kho dữ liệu số, Bản đồ số thông minh và Trung tâm điều hành thông minh xã Lao Bảo.

Có chỉ thị mới cần bổ sung hai nhóm chức năng:

1. Trợ lý AI tra cứu dữ liệu bằng ngôn ngữ tự nhiên.
2. AI nghiên cứu phân tích, dự báo và hỗ trợ ra quyết định.

Đây là mockup phục vụ demo với khách hàng.

Không triển khai AI thật.
Không gọi API LLM thật.
Không tích hợp OpenAI, Gemini, Ollama hoặc SDK AI khác.
Không commit.
Không push.

==================================================
I. NGUYÊN TẮC THỰC HIỆN
==================================================

1. Chỉ làm Frontend mockup và local mock behavior.
2. Không thay đổi nghiệp vụ ngoài phạm vi AI.
3. Không làm lại toàn bộ Dashboard, Bộ chỉ số hoặc Trung tâm điều hành nếu layout hiện tại đã ổn.
4. Không hiển thị dữ liệu AI như kết quả phân tích chính thức.
5. Tất cả kết quả AI phải có nhãn rõ:
   - `AI Demo`
   - `Kết quả mô phỏng`
   - `Khuyến nghị tham khảo`
   - `Chưa kết nối mô hình AI thực`
6. Không dùng dữ liệu xã Trà Tập.
7. Không tạo cấp huyện.
8. Không hiển thị dữ liệu Quốc phòng - An ninh chi tiết hoặc dữ liệu cá nhân nhạy cảm.
9. Comment trong source và commit message đề xuất viết bằng tiếng Anh.
10. Báo cáo trong chat bằng tiếng Việt.

==================================================
II. TÀI LIỆU PHẢI ĐỌC TRƯỚC KHI CODE
==================================================

Bắt buộc đọc:

- `docs/requirements/lao-bao-digital-plan-2026.docx`
- `docs/requirements/lao-bao-system-requirements.docx`
- `docs/laobao/00-context-core.md`
- `docs/laobao/01-administrative-data.md`
- `docs/laobao/02-feature-matrix.md`
- `docs/laobao/03-route-map.md`
- `docs/laobao/04-data-contracts.md`
- `docs/laobao/05-rbac-matrix.md`
- `docs/laobao/06-progress.md`
- `bklit_chart.md`

Đọc source hiện tại:

- `src/app/dashboard/page.tsx`
- route Bộ chỉ số hiện có
- route Trung tâm điều hành hiện có
- sidebar items và route map
- mock data dashboard, indicators và operations center
- types hiện có
- RBAC hiện có
- components common
- components charts
- Shadcn UI components hiện có
- `components.json`
- `src/app/globals.css`

Trước khi sửa:

1. Chạy `git status --short`.
2. Chạy `git branch --show-current`.
3. Audit các route và component hiện có.
4. Xác định file dự kiến tạo/sửa.
5. Nếu có thay đổi chưa rõ nguồn gốc, không ghi đè.
6. Sau đó tiếp tục code, không yêu cầu người dùng chạy terminal.

==================================================
III. FEATURE TRACEABILITY — MÃ ĐÃ KHÓA
==================================================

Hai chức năng AI đã được cấp mã ổn định trong Stable Feature Registry, mục 12 của file:

- `antigravity_prompts_laobao_20260713_v1_1.md`

Mapping bắt buộc:

| featureCode | STT nguồn | Chức năng |
|---|---:|---|
| `AI-01` | 110 | Trợ lý AI tra cứu dữ liệu bằng ngôn ngữ tự nhiên |
| `AI-02` | 111 | AI nghiên cứu phân tích, dự báo hỗ trợ ra quyết định |

Yêu cầu bắt buộc:

1. Chỉ được dùng đúng `AI-01` cho STT 110 và `AI-02` cho STT 111.
2. Không được tự sinh mã mới, không được đổi tiền tố và không được dùng mã mô tả dài hơn.
3. Tuyệt đối không tạo các mã như:
   - `AI-CHAT-01`
   - `AI-DECISION-01`
   - hoặc bất kỳ biến thể nào khác.
4. Trong `docs/laobao/02-feature-matrix.md`:
   - Nếu đã có hai dòng này, giữ nguyên featureCode và chỉ cập nhật route/component/status khi cần.
   - Nếu chưa có hai dòng này, copy nguyên mapping `AI-01` và `AI-02` từ Stable Feature Registry; không tự suy luận và không tự cấp mã.
5. Không dùng STT làm ID kỹ thuật chính.
6. Không tạo duplicate feature entry.
7. Trước khi code, phải xác nhận bằng báo cáo ngắn:
   - `AI-01` ↔ STT 110
   - `AI-02` ↔ STT 111
8. Nếu registry và feature matrix mâu thuẫn, Stable Feature Registry là nguồn chuẩn; dừng việc sửa mã và báo cáo mâu thuẫn trước khi tiếp tục.

==================================================
IV. PHẠM VI ROUTE VÀ TÍCH HỢP
==================================================

Thực hiện các phần sau:

A. Tạo route mới:

- `/dashboard/ai-assistant`

B. Bổ sung section AI trên:

- `/dashboard`
- trang Bộ chỉ số, ưu tiên route hiện có; nếu chưa có thì dùng `/dashboard/indicators`
- trang Trung tâm điều hành, ưu tiên route hiện có; nếu chưa có thì dùng `/dashboard/operations-center`

C. Sidebar:

- Thêm menu `Trợ lý AI`.
- Đặt trong nhóm `Tổng quan và điều hành` hoặc nhóm tương đương hiện có.
- Dùng icon Lucide phù hợp như `Bot`, `Sparkles` hoặc `BrainCircuit`.
- Không tạo nhóm sidebar mới nếu nhóm hiện có đã phù hợp.

D. Liên kết chéo:

- Dashboard → `Mở trợ lý AI`
- Bộ chỉ số → `Phân tích bằng AI`
- Trung tâm điều hành → `Mở phân tích AI`
- AI Assistant → link về Dashboard, Bộ chỉ số và Trung tâm điều hành

Không tạo broken link.

==================================================
V. TRANG /dashboard/ai-assistant
==================================================

## 1. Page Header

Title:

`Trợ lý AI dữ liệu Lao Bảo`

Description:

`Tra cứu thông tin, tóm tắt số liệu và nhận gợi ý phân tích bằng giao diện AI mô phỏng phục vụ demo.`

Badge bắt buộc:

- `AI Demo`
- `Dữ liệu mô phỏng`
- `Chưa kết nối mô hình AI thực`

Actions:

- `Xóa hội thoại`
- `Mở Dashboard`
- `Xem Bộ chỉ số`

## 2. Layout

Desktop:

- Cột trái 8/12: chat workspace.
- Cột phải 4/12: suggested prompts, topic filters, recent conversations và AI insights.

Tablet:

- Hai cột nếu đủ không gian.
- Nếu không, panel phụ chuyển xuống dưới.

Mobile:

- Một cột.
- Chat panel xuất hiện trước.
- Suggested prompts và lịch sử hiển thị bằng Tabs hoặc Accordion.

## 3. Chat workspace

Bao gồm:

- Message list.
- User message bubble.
- Assistant response card.
- Textarea nhập câu hỏi.
- Nút gửi.
- Nút dừng mock nếu đang loading.
- Loading/typing state.
- Empty state.
- Error state mock.
- ScrollArea.

Không làm giao diện giống ứng dụng chat tiêu dùng thông thường.
Phải giữ phong cách hệ thống chính quyền số và dashboard nghiệp vụ.

## 4. Suggested prompts

Tạo tối thiểu 12 prompt mẫu, chia theo nhóm:

### Kinh tế - ngân sách

- `Thu ngân sách hiện đạt bao nhiêu phần trăm kế hoạch?`
- `Tóm tắt tình hình doanh nghiệp, hợp tác xã và hộ kinh doanh.`

### Hành chính công

- `Tỷ lệ hồ sơ trực tuyến và đúng hạn hiện nay là bao nhiêu?`
- `Chỉ số cải cách hành chính nào đang thấp hơn mục tiêu?`

### Nông nghiệp - môi trường

- `Tóm tắt tình hình sản xuất cây trồng trong kỳ.`
- `Loại cây nào có sản lượng giảm so với vụ trước?`

### Thiên tai - khẩn cấp

- `Có cảnh báo nào cần ưu tiên xử lý?`
- `Những thôn nào có mức cảnh báo cao trong dữ liệu mô phỏng?`

### Nhiệm vụ điều hành

- `Đơn vị nào có nhiều nhiệm vụ quá hạn nhất?`
- `Tóm tắt tiến độ nhiệm vụ được giao trong tháng.`

### Chất lượng dữ liệu

- `Những thôn nào đang chậm cập nhật dữ liệu?`
- `Nhóm dữ liệu nào có chất lượng thấp nhất?`

## 5. Topic filters

Dùng Tabs, ToggleGroup hoặc Select:

- Tất cả
- Kinh tế - Ngân sách
- Hành chính công
- Nông nghiệp - Môi trường
- Thiên tai - Khẩn cấp
- Nhiệm vụ điều hành
- Chất lượng dữ liệu
- Kế hoạch KT-XH

## 6. Response format

Không trả lời bằng một đoạn văn dài duy nhất.

Mỗi câu trả lời mock phải hỗ trợ các block:

1. `Tóm tắt nhanh`
2. `Số liệu chính`
3. `Nhận định`
4. `Rủi ro hoặc điểm cần chú ý`
5. `Khuyến nghị tham khảo`
6. `Nguồn dữ liệu liên quan`
7. `Câu hỏi tiếp theo gợi ý`

Có thể hiển thị:

- Metric chips.
- Mini progress.
- Compact table.
- Link mở module liên quan.
- Mini chart chỉ khi có business wrapper Bklit phù hợp.

Không import primitive Bklit trực tiếp trong page hoặc response view cấp cao.

==================================================
VI. MOCK RESPONSE ENGINE
==================================================

Xây dựng local mock response engine, ví dụ:

- `src/lib/ai/mock-ai-engine.ts`

Không gọi network.
Không gọi API server.
Không fake SSE hoặc streaming server.

## 1. Intent mapping

Map từ khóa sang intent:

```ts
export type AiIntent =
  | "budgetSummary"
  | "economicOverview"
  | "administrativePerformance"
  | "cropProduction"
  | "emergencyAlerts"
  | "overdueTasks"
  | "dataCompletion"
  | "socioEconomicProgress"
  | "generalSummary"
  | "restrictedData";
```

Ví dụ:

- chứa `ngân sách`, `thu`, `dự toán` → `budgetSummary`
- chứa `hồ sơ`, `trực tuyến`, `đúng hạn` → `administrativePerformance`
- chứa `cây trồng`, `mùa vụ`, `sản lượng` → `cropProduction`
- chứa `cảnh báo`, `thiên tai`, `khẩn cấp` → `emergencyAlerts`
- chứa `quá hạn`, `nhiệm vụ` → `overdueTasks`
- chứa `thôn`, `cập nhật dữ liệu` → `dataCompletion`
- chứa `kế hoạch`, `KT-XH`, `chỉ tiêu` → `socioEconomicProgress`

## 2. Response generation

Response phải compute từ mock data hiện có.

Không hard-code số liệu khác với Dashboard.

Ví dụ:

- Budget answer lấy từ cùng nguồn với Gauge, Stacked Bar và KPI ngân sách.
- Administrative answer lấy từ cùng nguồn với Donut và Progress Bar.
- Data completion answer lấy từ cùng nguồn với Heatmap theo thôn.
- Task answer lấy từ cùng nguồn với Donut, Time-series và Task Heatmap.
- KT-XH answer lấy từ cùng nguồn với Heatmap tiến độ kế hoạch.

## 3. Restricted data response

Nếu câu hỏi liên quan:

- Quốc phòng - An ninh chi tiết.
- Dữ liệu cá nhân.
- Tọa độ nhạy cảm.
- Hồ sơ mật.

Trả về:

`Nội dung này bị giới hạn theo phân quyền dữ liệu và không được hiển thị trong bản demo.`

Không cố tạo câu trả lời giả.

## 4. Loading behavior

Khi người dùng gửi câu hỏi:

1. Hiển thị typing state từ 600–1200ms.
2. Sau đó trả response mock.
3. Không gọi `Math.random()` trực tiếp làm dữ liệu thay đổi sau refresh.
4. Nếu cần delay, chỉ dùng cho UI state, không dùng để sinh số liệu.

==================================================
VII. SECTION AI TRÊN /dashboard
==================================================

Tạo section:

`AI hỗ trợ ra quyết định`

Đặt ở vị trí dễ nhìn nhưng không phá bố cục chart hiện tại.

## 1. Hero insight

Title:

`Nhận định AI hôm nay`

Hiển thị:

- Tóm tắt đa lĩnh vực 2–4 dòng.
- 3 số liệu nổi bật.
- Nhãn `Kết quả mô phỏng`.
- Thời điểm phân tích giả lập.

CTA:

- `Mở trợ lý AI`
- `Xem phân tích đầy đủ`

## 2. Insight cards

Tạo 4 card:

1. `Rủi ro`
2. `Cơ hội`
3. `Bất thường`
4. `Khuyến nghị`

Mỗi card gồm:

- Icon.
- Title.
- Summary.
- Severity nếu phù hợp.
- Domain.
- Related indicator count.
- Link module liên quan.

## 3. Mini forecast

Card:

`Dự báo ngắn hạn`

Cho phép hiển thị 2–3 forecast mock:

- Tiến độ thu ngân sách.
- Tỷ lệ nhiệm vụ quá hạn.
- Tiến độ cập nhật dữ liệu.

Gắn nhãn:

`Dự báo mô phỏng`

Không dùng wording `dự báo chính xác`.

==================================================
VIII. SECTION AI TRÊN TRANG BỘ CHỈ SỐ
==================================================

Tạo section:

`AI phân tích bộ chỉ số`

Nội dung:

- Chỉ số cải thiện mạnh nhất.
- Chỉ số giảm mạnh nhất.
- Nhóm chỉ tiêu gần đạt kế hoạch.
- Nhóm chỉ tiêu chậm tiến độ.
- Dự báo khả năng hoàn thành quý/năm.
- Gợi ý chỉ số cần theo dõi tiếp.

CTA:

- `Đặt câu hỏi cho AI`
- `Xem dữ liệu nguồn`

Yêu cầu:

- Compute từ indicator catalog và mock indicator values.
- Không tạo số độc lập.
- Link tới đúng tab hoặc nhóm chỉ số liên quan.
- Hiển thị feature/indicator code khi phù hợp.

==================================================
IX. PANEL AI TRÊN TRUNG TÂM ĐIỀU HÀNH
==================================================

Tạo panel:

`AI hỗ trợ điều hành`

Không tạo chatbot thứ hai.

Hiển thị:

- Top 3 cảnh báo ưu tiên.
- 2 nhận định đa lĩnh vực.
- 1 khuyến nghị hành động.
- 1 dự báo ngắn hạn.
- CTA `Mở phân tích AI`.

Nội dung phải compute từ:

- Alerts.
- Incidents.
- Tasks.
- Data freshness.
- Emergency readiness.

Không hiển thị dữ liệu QP-AN chi tiết.

==================================================
X. DATA MODEL
==================================================

Tạo hoặc mở rộng type trong `src/types/ai.ts`.

```ts
type AiMessageRole = "user" | "assistant" | "system";

type AiInsightType =
  | "summary"
  | "risk"
  | "opportunity"
  | "anomaly"
  | "forecast"
  | "recommendation";

type AiInsightSeverity = "info" | "low" | "medium" | "high";

type AiPromptCategory =
  | "budget"
  | "administration"
  | "agriculture"
  | "emergency"
  | "tasks"
  | "dataQuality"
  | "socioEconomic";

interface AiChatMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: string;
  isDemo: true;
}

interface AiSuggestedPrompt {
  id: string;
  category: AiPromptCategory;
  label: string;
  prompt: string;
}

interface AiMetricReference {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  unit: string;
  trendValue?: number;
  trendDirection?: "up" | "down" | "stable";
  sourceRoute?: string;
}

interface AiInsight {
  id: string;
  type: AiInsightType;
  severity: AiInsightSeverity;
  title: string;
  summary: string;
  detail?: string;
  relatedDomains: string[];
  relatedIndicatorIds: string[];
  metrics: AiMetricReference[];
  suggestedActions: string[];
  confidenceLabel: "Mô phỏng" | "Thấp" | "Trung bình";
  createdAt: string;
  isDemo: true;
}

interface AiForecastItem {
  id: string;
  topic: string;
  metricLabel: string;
  currentValue: number;
  projectedValue: number;
  unit: string;
  horizonLabel: string;
  basis: string;
  confidenceLabel: "Mô phỏng" | "Thấp" | "Trung bình";
  isDemo: true;
}

interface AiResponseSection {
  id: string;
  type:
    | "summary"
    | "metrics"
    | "analysis"
    | "risk"
    | "recommendation"
    | "sources"
    | "followUp";
  title: string;
  content?: string;
  metrics?: AiMetricReference[];
  items?: string[];
}

interface AiMockResponse {
  id: string;
  intent: AiIntent;
  title: string;
  sections: AiResponseSection[];
  relatedRoutes: string[];
  createdAt: string;
  isDemo: true;
}
```

Không dùng `any`.

Nếu source đã có model tương đương:

- Mở rộng model hiện có.
- Không tạo duplicate source of truth.

==================================================
XI. MOCK DATA
==================================================

Tạo hoặc cập nhật:

- `src/data/mock-ai.ts`

Bao gồm:

- Suggested prompts.
- Recent conversations.
- AI insights.
- Forecast items.
- Sample restricted response.

Quy tắc:

- ID ổn định.
- Dữ liệu ổn định sau refresh.
- Không dùng tên người thật.
- Không dùng doanh nghiệp thật nếu chưa được xác nhận.
- Không dùng dữ liệu Trà Tập.
- Không dùng dữ liệu QP-AN chi tiết.
- Không hard-code số khác với nguồn dashboard/indicator.

Các insight và forecast nên được tạo bằng helper compute từ nguồn dữ liệu hiện có thay vì khai báo hoàn toàn độc lập.

==================================================
XII. COMPONENT STRUCTURE
==================================================

Điều chỉnh theo convention source hiện có, ưu tiên:

```text
src/app/dashboard/ai-assistant/
├── page.tsx
└── components/
    ├── ai-assistant-view.tsx
    ├── ai-chat-panel.tsx
    ├── ai-message-list.tsx
    ├── ai-response-card.tsx
    ├── ai-suggested-prompts.tsx
    ├── ai-topic-filters.tsx
    ├── ai-history-panel.tsx
    ├── ai-insight-sidebar.tsx
    └── ai-demo-disclaimer.tsx

src/app/dashboard/components/ai/
├── dashboard-ai-insights-section.tsx
├── indicators-ai-analysis-section.tsx
└── operations-center-ai-panel.tsx

src/lib/ai/
├── mock-ai-engine.ts
├── ai-intent-matcher.ts
└── ai-insight-computations.ts

src/data/mock-ai.ts
src/types/ai.ts
```

Quy tắc:

- `page.tsx` chỉ compose.
- Không để mock response engine trong component.
- Không hard-code toàn bộ sample response trong JSX.
- Component dùng chung đặt ở vị trí common nếu được tái sử dụng từ hai lần trở lên.

==================================================
XIII. SHADCN VÀ BKLIT
==================================================

Ưu tiên Shadcn:

- Card.
- Button.
- Textarea.
- ScrollArea.
- Tabs.
- Badge.
- Tooltip.
- Separator.
- Sheet.
- Skeleton.
- Collapsible.
- Sonner/toast.
- Avatar nếu cần.

Nếu thiếu component Shadcn:

- Cài bằng Shadcn CLI.
- Không viết lại primitive tương tự.

Nếu response AI cần mini chart:

- Tái sử dụng Bklit business wrapper đã có.
- Không import Bklit primitive trực tiếp trong `page.tsx` hoặc `ai-response-card.tsx` cấp cao.
- Không cài chart library khác.
- Tuân thủ loading, empty, accessibility và theme governance trong `bklit_chart.md`.

==================================================
XIV. UI/UX DIRECTION
==================================================

Thiết kế phải:

- Hiện đại.
- Chuyên nghiệp.
- Phù hợp chính quyền số và IOC demo.
- Có điểm nhấn AI nhưng không sci-fi quá mức.
- Không dùng neon mạnh.
- Không dùng animation liên tục gây mất tập trung.
- Không biến AI Assistant thành chatbot marketing.

Có thể dùng:

- Subtle gradient từ semantic tokens.
- Icon Sparkles/Bot/BrainCircuit.
- Typing dots nhẹ.
- Highlight section title.
- Compact metric chips.

Không hard-code hex/rgb.
Dùng semantic tokens và chart variables.

==================================================
XV. RBAC VÀ BẢO MẬT
==================================================

Role:

- Admin:
  - Xem đầy đủ AI mockup.
- Lãnh đạo xã:
  - Xem AI Assistant, AI insights, forecast và recommendation.
- Cán bộ xã:
  - Xem theo phạm vi module/dữ liệu được phép.

Permission phải được lọc trước render.
Không chỉ ẩn bằng CSS.

Nếu user hỏi dữ liệu vượt quyền:

- Trả restricted response.
- Không hiển thị số liệu bị giới hạn.

Không hiển thị:

- Dữ liệu QP-AN chi tiết.
- Tọa độ nhạy cảm.
- Tên người.
- CCCD.
- Hồ sơ cá nhân.
- Nội dung mật.

==================================================
XVI. TRẠNG THÁI UI
==================================================

Mọi phần AI phải có:

## Loading

- Skeleton hoặc typing state.
- Không làm layout nhảy.

## Empty

- Gợi ý câu hỏi mẫu.
- Không để màn hình trống.

## Error

- Message ngắn.
- Nút thử lại mock.
- Không hiển thị stack trace.

## Ready

- Nội dung rõ ràng.
- Có disclaimer.
- Có source references.
- Có follow-up suggestions.

==================================================
XVII. RESPONSIVE
==================================================

Kiểm tra:

## Mobile 375px

- Chat full width.
- Input không bị che bởi mobile keyboard.
- Suggested prompt wrap hoặc scroll ngang hợp lý.
- Panel phụ xuống dưới.
- Message không tràn ngang.

## Tablet 768px

- Hai cột nếu đủ không gian.
- Nếu không, dùng một cột rõ ràng.

## Desktop 1440px

- Chat workspace 8/12.
- Sidebar insight 4/12.
- Dashboard AI section dùng grid 12 cột.

Dark mode và light mode phải hoạt động.

==================================================
XVIII. KHÔNG ĐƯỢC LÀM
==================================================

- Không gọi OpenAI API.
- Không gọi Gemini API.
- Không gọi Ollama.
- Không cài AI SDK.
- Không tạo API route giả như thể có backend AI.
- Không fake streaming từ server.
- Không claim AI thật.
- Không claim realtime AI.
- Không dùng dữ liệu Trà Tập.
- Không tạo cấp huyện.
- Không hiển thị QP-AN chi tiết.
- Không hard-code toàn bộ answer trong page.
- Không dùng `any`.
- Không dùng `@ts-ignore`.
- Không dùng `@ts-nocheck`.
- Không commit.
- Không push.

==================================================
XIX. KIỂM TRA TỰ ĐỘNG
==================================================

Bạn phải tự động chạy terminal, không yêu cầu người dùng chạy hộ:

1. `git diff --check`
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm run build`

Nếu project có test runner:

5. Chạy test liên quan AI route và mock response engine.

Kiểm tra bổ sung:

- `AI-01` tồn tại đúng một lần và map tới STT 110.
- `AI-02` tồn tại đúng một lần và map tới STT 111.
- Không tồn tại `AI-CHAT-01`.
- Không tồn tại `AI-DECISION-01`.
- Không phát sinh featureCode AI mới ngoài `AI-01` và `AI-02`.
- Route `/dashboard/ai-assistant` hoạt động.
- Sidebar link đúng.
- CTA không 404.
- Có nhãn AI Demo.
- Không có network call AI.
- Không có AI SDK mới.
- Mock responses compute từ source hiện có.
- Không có dữ liệu Trà Tập.
- Không có `districtCode` hoặc `districtName` mới.
- Restricted response hoạt động.
- Loading hoạt động.
- Empty hoạt động.
- Error hoạt động.
- Responsive 375px, 768px, 1440px.
- Light/dark mode hoạt động.
- RBAC không lộ dữ liệu nhạy cảm.

Nếu có lỗi:

1. Đọc lỗi đầy đủ.
2. Xác định nguyên nhân.
3. Sửa trong phạm vi task.
4. Chạy lại.
5. Không dừng khi build còn lỗi.

==================================================
XX. CẬP NHẬT TÀI LIỆU
==================================================

Cập nhật:

- `docs/laobao/02-feature-matrix.md`
- `docs/laobao/03-route-map.md`
- `docs/laobao/04-data-contracts.md`
- `docs/laobao/05-rbac-matrix.md`
- `docs/laobao/06-progress.md`

Ghi rõ:

- AI chỉ là mockup giai đoạn demo.
- Chưa tích hợp mô hình thật.
- Không gọi external AI service.
- Feature `AI-01` (STT 110) và `AI-02` (STT 111) đã được map vào route/component tương ứng.
- Không tạo thêm featureCode AI mới ngoài hai mã đã khóa.
- Các ràng buộc dữ liệu nhạy cảm.

Không sửa nội dung feature khác ngoài phạm vi cần thiết.

==================================================
XXI. BÁO CÁO KẾT QUẢ
==================================================

Báo cáo bằng tiếng Việt:

## Audit trước khi sửa

## Feature mapping

- STT 110:
- featureCode: `AI-01`
- Route:
- Components:

- STT 111:
- featureCode: `AI-02`
- Routes/sections:
- Components:

- Xác nhận không tạo `AI-CHAT-01`, `AI-DECISION-01` hoặc mã AI mới khác:

## Route AI Assistant

## AI chat experience

## Suggested prompts

## Mock response engine

## AI section trên Dashboard

## AI section trên Bộ chỉ số

## AI panel trên Trung tâm điều hành

## Mock data và computations

## RBAC và bảo mật

## Files created

## Files updated

## Shadcn components used

## Bklit wrappers reused

## Validation results

- git diff --check:
- npm run lint:
- npx tsc --noEmit:
- npm run build:
- tests:

## Remaining issues

## Suggested commit message

`feat: add AI assistant and decision support mockups`

Sau khi báo cáo:

- Dừng lại.
- Không commit.
- Không push.
- Chờ người dùng review và Accept.
```

---

## Sau khi review và Accept

Gửi Antigravity lệnh commit riêng:

```txt
Tôi đã review và Accept toàn bộ thay đổi của task AI mockup. OK để commit.

Trước khi commit:

1. Chạy `git status --short`.
2. Xác nhận chỉ có thay đổi thuộc task AI mockup.
3. Không đưa file ngoài phạm vi task vào commit.
4. Không sửa thêm tính năng.
5. Không push.

Commit message:

`feat: add AI assistant and decision support mockups`

Sau khi commit:

- Hiển thị commit hash.
- Hiển thị `git status --short`.
- Tóm tắt bằng tiếng Việt.
- Dừng lại.
```
