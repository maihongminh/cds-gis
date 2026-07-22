// src/data/mock-ai.ts

import { AiSuggestedPrompt, AiInsight, AiForecastItem } from "@/types/ai";

export const MOCK_AI_SUGGESTED_PROMPTS: AiSuggestedPrompt[] = [
  // Kinh tế - ngân sách
  { id: "p-1", category: "budget", label: "Tiến độ thu ngân sách", prompt: "Thu ngân sách hiện đạt bao nhiêu phần trăm kế hoạch?" },
  { id: "p-2", category: "budget", label: "Tóm tắt doanh nghiệp", prompt: "Tóm tắt tình hình doanh nghiệp, hợp tác xã và hộ kinh doanh." },
  // Hành chính công
  { id: "p-3", category: "administration", label: "Tỷ lệ hồ sơ trực tuyến", prompt: "Tỷ lệ hồ sơ trực tuyến và đúng hạn hiện nay là bao nhiêu?" },
  { id: "p-4", category: "administration", label: "Cải cách hành chính", prompt: "Chỉ số cải cách hành chính nào đang thấp hơn mục tiêu?" },
  // Nông nghiệp - môi trường
  { id: "p-5", category: "agriculture", label: "Sản xuất cây trồng", prompt: "Tóm tắt tình hình sản xuất cây trồng trong kỳ." },
  { id: "p-6", category: "agriculture", label: "Sản lượng giảm", prompt: "Loại cây nào có sản lượng giảm so với vụ trước?" },
  // Thiên tai - khẩn cấp
  { id: "p-7", category: "emergency", label: "Cảnh báo ưu tiên", prompt: "Có cảnh báo nào cần ưu tiên xử lý?" },
  { id: "p-8", category: "emergency", label: "Thôn có nguy cơ cao", prompt: "Những thôn nào có mức cảnh báo cao trong dữ liệu mô phỏng?" },
  // Nhiệm vụ điều hành
  { id: "p-9", category: "tasks", label: "Nhiệm vụ quá hạn", prompt: "Đơn vị nào có nhiều nhiệm vụ quá hạn nhất?" },
  { id: "p-10", category: "tasks", label: "Tiến độ nhiệm vụ", prompt: "Tóm tắt tiến độ nhiệm vụ được giao trong tháng." },
  // Chất lượng dữ liệu
  { id: "p-11", category: "dataQuality", label: "Chậm cập nhật dữ liệu", prompt: "Những thôn nào đang chậm cập nhật dữ liệu?" },
  { id: "p-12", category: "dataQuality", label: "Chất lượng dữ liệu thấp", prompt: "Nhóm dữ liệu nào có chất lượng thấp nhất?" },
];

export const MOCK_AI_INSIGHTS: AiInsight[] = [
  {
    id: "ins-1",
    type: "risk",
    severity: "high",
    title: "Cảnh báo ngập lụt tại Ka Tăng",
    summary: "Lượng mưa tích lũy 24h qua vượt mức an toàn, nguy cơ ngập lụt cục bộ.",
    detail: "Dữ liệu mô phỏng cho thấy lượng mưa đạt 185mm. Cần rà soát các hộ dân ven suối.",
    relatedDomains: ["Thiên tai", "Khẩn cấp"],
    relatedIndicatorIds: ["ind-disaster-1"],
    metrics: [
      { id: "m-1", label: "Lượng mưa", value: 185, formattedValue: "185", unit: "mm", trendDirection: "up" },
    ],
    suggestedActions: ["Kích hoạt đội phản ứng nhanh thôn Ka Tăng", "Kiểm tra hệ thống loa phát thanh"],
    confidenceLabel: "Mô phỏng",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "ins-2",
    type: "opportunity",
    severity: "low",
    title: "Tăng trưởng thương mại dịch vụ",
    summary: "Hoạt động thương mại biên mậu đang có dấu hiệu phục hồi tích cực.",
    relatedDomains: ["Kinh tế", "Thương mại"],
    relatedIndicatorIds: ["ind-econ-1"],
    metrics: [
      { id: "m-2", label: "Doanh thu dịch vụ", value: 45000, formattedValue: "45", unit: "Tỷ VNĐ", trendDirection: "up" },
    ],
    suggestedActions: ["Khuyến khích các hộ mở rộng kinh doanh", "Đẩy mạnh hỗ trợ thủ tục hải quan"],
    confidenceLabel: "Mô phỏng",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "ins-3",
    type: "anomaly",
    severity: "medium",
    title: "Tỷ lệ hồ sơ trực tuyến giảm",
    summary: "Tuần qua tỷ lệ hồ sơ nộp trực tuyến giảm 15% so với tuần trước.",
    detail: "Nguyên nhân mô phỏng: Hệ thống cổng DVC tỉnh có lúc gián đoạn, người dân chuyển sang nộp trực tiếp.",
    relatedDomains: ["Hành chính công"],
    relatedIndicatorIds: ["ind-admin-1"],
    metrics: [
      { id: "m-3", label: "Tỷ lệ trực tuyến", value: 65, formattedValue: "65", unit: "%", trendValue: 15, trendDirection: "down" },
    ],
    suggestedActions: ["Cán bộ một cửa chủ động hỗ trợ người dân thao tác", "Báo cáo cấp trên kiểm tra cổng DVC"],
    confidenceLabel: "Mô phỏng",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "ins-4",
    type: "recommendation",
    severity: "info",
    title: "Gợi ý đôn đốc nhiệm vụ",
    summary: "Có 5 nhiệm vụ của bộ phận Địa chính đang sát hạn chót (còn < 3 ngày).",
    relatedDomains: ["Điều hành", "Đất đai"],
    relatedIndicatorIds: ["ind-task-1"],
    metrics: [
      { id: "m-4", label: "Nhiệm vụ sát hạn", value: 5, formattedValue: "5", unit: "Nhiệm vụ" },
    ],
    suggestedActions: ["Gửi thông báo nhắc việc tự động cho CB Địa chính", "Yêu cầu báo cáo vướng mắc"],
    confidenceLabel: "Mô phỏng",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
];

export const MOCK_AI_FORECASTS: AiForecastItem[] = [
  {
    id: "fc-1",
    topic: "Thu ngân sách",
    metricLabel: "Tổng thu ngân sách nhà nước",
    currentValue: 18.5,
    projectedValue: 25.2,
    unit: "Tỷ VNĐ",
    horizonLabel: "Dự kiến cuối năm 2026",
    basis: "Dựa trên tiến độ thu 6 tháng đầu năm và tốc độ tăng trưởng thương mại mô phỏng.",
    confidenceLabel: "Mô phỏng",
    isDemo: true,
  },
  {
    id: "fc-2",
    topic: "Nhiệm vụ điều hành",
    metricLabel: "Tỷ lệ nhiệm vụ hoàn thành đúng hạn",
    currentValue: 82,
    projectedValue: 88,
    unit: "%",
    horizonLabel: "Dự kiến cuối tháng",
    basis: "Gia tốc hoàn thành nhiệm vụ đang tăng 5% trong tuần qua.",
    confidenceLabel: "Mô phỏng",
    isDemo: true,
  },
  {
    id: "fc-3",
    topic: "Cập nhật dữ liệu",
    metricLabel: "Tỷ lệ làm sạch dữ liệu dân cư",
    currentValue: 92,
    projectedValue: 98,
    unit: "%",
    horizonLabel: "Dự kiến cuối quý III",
    basis: "Các thôn đang đẩy nhanh tiến độ đối chiếu sổ hộ khẩu.",
    confidenceLabel: "Mô phỏng",
    isDemo: true,
  },
];
