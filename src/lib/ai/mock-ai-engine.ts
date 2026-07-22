// src/lib/ai/mock-ai-engine.ts

import { AiIntent, AiMockResponse } from "@/types/ai";

/**
 * Phân tích câu hỏi của người dùng để map sang intent
 */
export function matchIntent(query: string): AiIntent {
  const lowerQuery = query.toLowerCase();

  // Kiểm tra restricted data trước
  if (
    lowerQuery.includes("quân sự") ||
    lowerQuery.includes("quốc phòng") ||
    lowerQuery.includes("an ninh") ||
    lowerQuery.includes("mật") ||
    lowerQuery.includes("cccd") ||
    lowerQuery.includes("cá nhân")
  ) {
    return "restrictedData";
  }

  if (lowerQuery.includes("ngân sách") || lowerQuery.includes("thu") || lowerQuery.includes("dự toán")) {
    return "budgetSummary";
  }
  if (lowerQuery.includes("hồ sơ") || lowerQuery.includes("trực tuyến") || lowerQuery.includes("đúng hạn")) {
    return "administrativePerformance";
  }
  if (lowerQuery.includes("cây trồng") || lowerQuery.includes("mùa vụ") || lowerQuery.includes("sản lượng")) {
    return "cropProduction";
  }
  if (lowerQuery.includes("cảnh báo") || lowerQuery.includes("thiên tai") || lowerQuery.includes("khẩn cấp")) {
    return "emergencyAlerts";
  }
  if (lowerQuery.includes("quá hạn") || lowerQuery.includes("nhiệm vụ")) {
    return "overdueTasks";
  }
  if (lowerQuery.includes("thôn") || lowerQuery.includes("cập nhật dữ liệu")) {
    return "dataCompletion";
  }
  if (lowerQuery.includes("kế hoạch") || lowerQuery.includes("kt-xh") || lowerQuery.includes("chỉ tiêu")) {
    return "socioEconomicProgress";
  }

  return "generalSummary";
}

/**
 * Sinh response giả lập dựa trên intent
 */
export async function computeAiResponse(query: string): Promise<AiMockResponse> {
  // Giả lập delay 800ms
  await new Promise((resolve) => setTimeout(resolve, 800));

  const intent = matchIntent(query);
  const baseResponse: Pick<AiMockResponse, "id" | "intent" | "createdAt" | "isDemo"> = {
    id: `resp-${Date.now()}`,
    intent,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };

  switch (intent) {
    case "restrictedData":
      return {
        ...baseResponse,
        title: "Dữ liệu bị giới hạn",
        relatedRoutes: [],
        sections: [
          {
            id: "s1",
            type: "summary",
            title: "Tóm tắt nhanh",
            content: "Nội dung này bị giới hạn theo phân quyền dữ liệu và không được hiển thị trong bản demo.",
          },
        ],
      };

    case "budgetSummary":
      return {
        ...baseResponse,
        title: "Tóm tắt tiến độ thu ngân sách",
        relatedRoutes: ["/dashboard/economy", "/dashboard/indicators"],
        sections: [
          {
            id: "s1",
            type: "summary",
            title: "Tóm tắt nhanh",
            content: "Tổng thu ngân sách nhà nước trên địa bàn xã Lao Bảo ước đạt 18.5 tỷ VNĐ, tương đương 65% dự toán năm.",
          },
          {
            id: "s2",
            type: "metrics",
            title: "Số liệu chính",
            metrics: [
              { id: "m1", label: "Tổng thu", value: 18.5, formattedValue: "18.5", unit: "Tỷ VNĐ", trendDirection: "up" },
              { id: "m2", label: "Đạt kế hoạch", value: 65, formattedValue: "65", unit: "%" },
            ],
          },
          {
            id: "s3",
            type: "analysis",
            title: "Nhận định",
            content: "Nguồn thu từ thuế công thương nghiệp, dịch vụ ngoài quốc doanh chiếm tỷ trọng lớn và có mức tăng trưởng khá ổn định.",
          },
          {
            id: "s4",
            type: "recommendation",
            title: "Khuyến nghị tham khảo",
            items: ["Tiếp tục đôn đốc thu hồi nợ đọng thuế.", "Rà soát các nguồn thu mới phát sinh trên địa bàn."],
          },
          {
            id: "s5",
            type: "followUp",
            title: "Câu hỏi gợi ý",
            items: ["Nguồn thu nào đang đạt tỷ lệ thấp nhất?", "Chi ngân sách hiện tại như thế nào?"],
          },
        ],
      };

    case "administrativePerformance":
      return {
        ...baseResponse,
        title: "Đánh giá hiệu quả Hành chính công",
        relatedRoutes: ["/dashboard/administrative-population"],
        sections: [
          {
            id: "s1",
            type: "summary",
            title: "Tóm tắt nhanh",
            content: "Tỷ lệ hồ sơ giải quyết đúng hạn đạt 98%, tuy nhiên tỷ lệ hồ sơ trực tuyến trong tuần có dấu hiệu giảm nhẹ.",
          },
          {
            id: "s2",
            type: "metrics",
            title: "Số liệu chính",
            metrics: [
              { id: "m1", label: "Đúng hạn", value: 98, formattedValue: "98", unit: "%", trendDirection: "stable" },
              { id: "m2", label: "Trực tuyến", value: 65, formattedValue: "65", unit: "%", trendValue: 15, trendDirection: "down" },
            ],
          },
          {
            id: "s3",
            type: "risk",
            title: "Rủi ro cần chú ý",
            content: "Tỷ lệ hồ sơ trực tuyến giảm 15% so với tuần trước. Nguyên nhân có thể do hệ thống cổng Dịch vụ công tỉnh đôi lúc thiếu ổn định.",
          },
          {
            id: "s4",
            type: "recommendation",
            title: "Khuyến nghị tham khảo",
            items: ["Cán bộ tại Bộ phận Một cửa tăng cường hướng dẫn người dân.", "Thông báo kịp thời khi hệ thống tỉnh có bảo trì."],
          },
        ],
      };

    case "emergencyAlerts":
      return {
        ...baseResponse,
        title: "Tình hình Cảnh báo Khẩn cấp",
        relatedRoutes: ["/dashboard/operations-center", "/dashboard/disaster-emergency"],
        sections: [
          {
            id: "s1",
            type: "summary",
            title: "Tóm tắt nhanh",
            content: "Hiện tại có 1 cảnh báo mức độ CAO liên quan đến lượng mưa tại khu vực thôn Ka Tăng.",
          },
          {
            id: "s2",
            type: "metrics",
            title: "Số liệu chính",
            metrics: [
              { id: "m1", label: "Lượng mưa 24h", value: 185, formattedValue: "185", unit: "mm", trendDirection: "up" },
            ],
          },
          {
            id: "s3",
            type: "risk",
            title: "Cảnh báo",
            content: "Nguy cơ sạt lở hoặc ngập lụt cục bộ tại các hộ dân ven suối Ka Tăng.",
          },
          {
            id: "s4",
            type: "recommendation",
            title: "Khuyến nghị tham khảo",
            items: ["Cử cán bộ xuống địa bàn kiểm tra.", "Sẵn sàng phương án sơ tán nếu lượng mưa tiếp tục vượt 200mm."],
          },
        ],
      };

    // Fallback cho các intent khác
    default:
      return {
        ...baseResponse,
        title: "Tóm tắt thông tin tổng hợp",
        relatedRoutes: ["/dashboard"],
        sections: [
          {
            id: "s1",
            type: "summary",
            title: "Tóm tắt nhanh",
            content: "Đây là câu trả lời mô phỏng cho truy vấn của bạn. Hệ thống hiện đang phân tích dữ liệu tổng quát.",
          },
          {
            id: "s2",
            type: "recommendation",
            title: "Khuyến nghị",
            content: "Vui lòng chọn các câu hỏi mẫu để xem kết quả phân tích chi tiết hơn đối với từng lĩnh vực cụ thể.",
          },
        ],
      };
  }
}
