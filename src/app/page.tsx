"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { APP_CONFIG } from "@/lib/app-config";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Database,
  Globe,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Lock,
  LogIn,
  Map,
  MapPinned,
  Network,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { AiFeaturesSection } from "@/components/landing/ai-features-section";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"datastore" | "map" | "dashboard">("datastore");
  const [activeBenefitTab, setActiveBenefitTab] = React.useState<"leader" | "officer" | "unit" | "public">("leader");

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const sid = document.cookie.match(/app_sid=([^;]+)/);
      setIsLoggedIn(!!sid);
    }

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const DATA_GROUPS = [
    {
      icon: Sprout,
      title: "Nông nghiệp & Canh tác OCOP",
      desc: "Vùng trồng lúa rẫy, chuối Lao Bảo, cà phê, chỉ số thu hoạch và tiến độ vùng đạt chuẩn OCOP thôn.",
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      icon: MapPinned,
      title: "Đất đai & Quy hoạch sử dụng",
      desc: "Địa chính thửa đất, cấp giấy chứng nhận quyền sử dụng đất, biến động mục đích sử dụng và quy hoạch nông nghiệp.",
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      icon: Compass,
      title: "Du lịch & Dịch vụ thôn",
      desc: "Quản lý điểm tham quan homestay biên giới, lượt khách, doanh thu và hạ tầng du lịch cộng đồng Lao Bảo.",
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      icon: Network,
      title: "Hạ tầng Giao thông & Kênh mương",
      desc: "Tình trạng đường bê tông thôn, cầu ngầm, kênh mương nội đồng và kế hoạch duy tu hàng năm.",
      color: "text-violet-600 bg-violet-500/10",
    },
    {
      icon: GraduationCap,
      title: "Giáo dục & Mạng lưới điểm trường",
      desc: "Số liệu học sinh đến lớp, cơ sở vật chất điểm trường, giáo viên và tỷ lệ phổ cập vùng khó khăn.",
      color: "text-indigo-600 bg-indigo-500/10",
    },
    { icon: Heart, title: "Y tế & Sức khỏe cộng đồng", desc: "Tiêm chủng mở rộng, khám chữa bệnh BHYT, phòng chống dịch và chỉ số y tế cơ sở thôn.", color: "text-rose-600 bg-rose-500/10" },
    {
      icon: Users,
      title: "An sinh xã hội & Nghèo đa chiều",
      desc: "Hộ nghèo đa chiều, người có công, trợ cấp bảo trợ xã hội và tiến độ giải ngân chính sách hỗ trợ.",
      color: "text-orange-600 bg-orange-500/10",
    },
    {
      icon: Shield,
      title: "Quốc phòng - An ninh biên giới",
      desc: "Kiểm soát phân vùng mốc giới, hồ sơ dân quân tự vệ và số liệu tuần tra phối hợp biên phòng định kỳ.",
      color: "text-slate-600 bg-slate-500/10",
    },
    {
      icon: AlertTriangle,
      title: "Thiên tai & Ứng phó khẩn cấp",
      desc: "Điểm nguy cơ sạt lở, lũ lụt, vật tư 4 tại chỗ, lịch sử thiên tai và phương án sơ tán thôn.",
      color: "text-red-600 bg-red-500/10",
    },
  ];

  const PILLARS = [
    {
      value: "datastore" as const,
      icon: Database,
      title: "Kho Dữ liệu Số",
      subtitle: "Tổng hợp 9 nhóm dữ liệu nghiệp vụ",
      color: "text-emerald-600",
      bg: "bg-emerald-600",
      features: [
        "Số hóa toàn bộ hồ sơ dân cư, kinh tế, nông nghiệp",
        "Nhập liệu, kiểm chuẩn và phê duyệt đa cấp",
        "Quản lý phiên bản và vết kiểm toán (Audit Trail)",
        "Xuất báo cáo Excel/PDF theo biểu mẫu chuẩn",
        "Phân quyền RBAC 5 vai trò chặt chẽ",
      ],
    },
    {
      value: "map" as const,
      icon: Map,
      title: "Bản đồ Số Thông minh",
      subtitle: "GIS không gian hành chính thôn",
      color: "text-blue-600",
      bg: "bg-blue-600",
      features: [
        "Bản đồ GIS ranh giới 12 thôn Lao Bảo",
        "6 lớp dữ liệu không gian (y tế, giáo dục, du lịch…)",
        "Kiểm soát hiển thị lớp theo phân quyền bảo mật",
        "Tìm kiếm bay tới đối tượng (FlyTo) và đo đạc",
        "Xuất bản đồ và tải về dạng hình ảnh",
      ],
    },
    {
      value: "dashboard" as const,
      icon: LayoutDashboard,
      title: "Trung tâm Điều hành",
      subtitle: "Dashboard KPI thời gian thực lãnh đạo",
      color: "text-violet-600",
      bg: "bg-violet-600",
      features: [
        "62 chỉ số phát triển phân theo 4 nhóm chuyên đề",
        "Tabs A/B/C/D: Thường xuyên, KH, Khẩn cấp, Nhiệm vụ",
        "Cảnh báo điều hành động và danh sách rủi ro tức thời",
        "Báo cáo tổng hợp 9 phân hệ với kết xuất PDF/Excel",
        "Nhật ký giám sát QP-AN theo DATA-SECDEF-07",
      ],
    },
  ];

  const BENEFITS = {
    leader: {
      title: "Lãnh đạo Xã (HĐND/UBND)",
      items: [
        "Giám sát 62 KPI phát triển xã theo thời gian thực",
        "Nhận cảnh báo tức thời về rủi ro chỉ tiêu và điểm nóng",
        "Phê duyệt báo cáo định kỳ gửi Sở ngành và Tỉnh bằng 1 click",
        "Xem bản đồ số toàn xã và theo dõi thiên tai khẩn cấp",
      ],
    },
    officer: {
      title: "Cán bộ Chuyên môn UBND",
      items: [
        "Nhập liệu trực tuyến, không cần Excel thủ công",
        "Tự động tổng hợp số liệu, giảm 85% thời gian báo cáo",
        "Nhận nhắc nhở trước hạn chốt dữ liệu định kỳ",
        "Kết xuất biểu mẫu báo cáo chuẩn theo mẫu nhà nước",
      ],
    },
    unit: {
      title: "Cơ quan & Đơn vị phối hợp",
      items: [
        "Tra cứu số liệu trực tiếp không cần đặt yêu cầu thủ công",
        "Tiếp nhận nhiệm vụ Tỉnh và Sở ngành giao và theo dõi tiến độ",
        "Phê duyệt hồ sơ chuyên ngành trực tuyến đa cấp",
        "Nhận thông báo đẩy về biến động số liệu liên ngành",
      ],
    },
    public: {
      title: "Người dân & Doanh nghiệp",
      items: [
        "Tra cứu thông tin quy hoạch đất đai và vùng OCOP",
        "Xem điểm du lịch, homestay và dịch vụ thôn",
        "Theo dõi lịch tiêm chủng và thông báo y tế cộng đồng",
        "Tiếp cận thông tin chính sách an sinh xã hội và trợ cấp",
      ],
    },
  };

  const ROADMAP = [
    {
      year: "2026",
      status: "active",
      label: "Đang triển khai",
      items: [
        "9 phân hệ kho dữ liệu số hoàn chỉnh",
        "Bản đồ GIS 12 thôn và 6 lớp dữ liệu",
        "Dashboard 62 chỉ số lãnh đạo điều hành",
        "Phân quyền RBAC 5 vai trò tích hợp",
        "Quy trình phê duyệt và nhật ký kiểm toán",
      ],
    },
    {
      year: "2027",
      status: "planned",
      label: "Kế hoạch",
      items: [
        "Kết nối CSDL Dân cư Quốc gia và Dịch vụ công",
        "Tích hợp trục liên thông văn bản Edoc Tỉnh Quảng Trị",
        "Chia sẻ dữ liệu lên IOC tỉnh Quảng Trị",
        "Module di động cho cán bộ thực địa",
        "Phân tích dự báo cơ bản từ dữ liệu lịch sử",
      ],
    },
    {
      year: "2028",
      status: "roadmap",
      label: "Lộ trình",
      items: [
        "Trợ lý ảo AI phân tích chỉ số và gợi ý kế hoạch",
        "Tự động sinh báo cáo điều hành hàng tháng",
        "Dự báo sản lượng nông nghiệp và rủi ro thiên tai",
        "Ứng dụng di động cộng đồng (cho dân)",
        "Mở rộng triển khai toàn tỉnh Quảng Trị",
      ],
    },
  ];

  const activePillar = PILLARS.find((p) => p.value === activeTab)!;

  return (
    <div className="relative min-h-svh bg-background text-foreground font-sans overflow-x-hidden antialiased">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-60" />
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />
      <div className="absolute top-[800px] left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute top-[1800px] right-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[80px]" />

      {/* ─── Navigation Header ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg hover:opacity-85 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-foreground sm:text-base leading-tight">Hệ Thống Dữ Liệu Số</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline">Xã Lao Bảo · Tỉnh Quảng Trị</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <a href="#tru-cot" className="transition-colors hover:text-foreground">
              3 Trụ cột
            </a>
            <a href="#du-lieu" className="transition-colors hover:text-foreground">
              9 Nhóm dữ liệu
            </a>
            <a href="#quy-trinh" className="transition-colors hover:text-foreground">
              Quy trình
            </a>
            <a href="#loi-ich" className="transition-colors hover:text-foreground">
              Lợi ích
            </a>
            <a href="#lo-trinh" className="transition-colors hover:text-foreground">
              Lộ trình
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 shadow-sm cursor-pointer gap-1.5"
              >
                <LayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Vào Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-accent cursor-pointer gap-1.5"
                >
                  <LogIn className="size-4" />
                  Đăng nhập
                </Link>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 shadow-sm cursor-pointer"
                >
                  Xem Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden min-h-svh flex flex-col justify-center">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Globe className="size-4" />
            <span>Chính quyền số · Xã Lao Bảo · Tỉnh Quảng Trị</span>
          </div>

          <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto leading-tight">
            Kho Dữ liệu Số, Bản đồ Thông minh <br />
            <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
              &amp; Trung tâm Điều hành Xã Lao Bảo
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hệ sinh thái dữ liệu số phục vụ quản lý, chỉ đạo và điều hành toàn diện kinh tế — xã hội xã Lao Bảo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:pt-4">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-md shadow-emerald-600/20 cursor-pointer gap-2"
            >
              <LogIn className="size-4" />
              Đăng nhập hệ thống
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card/60 backdrop-blur-sm px-6 text-sm font-semibold text-foreground transition-all hover:bg-accent cursor-pointer gap-2"
            >
              <LayoutDashboard className="size-4" />
              Xem Dashboard demo
            </Link>
            <Link
              href="/dashboard/map"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/5 backdrop-blur-sm px-6 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-500/10 cursor-pointer gap-2"
            >
              <Map className="size-4" />
              Xem Bản đồ GIS demo
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            {[
              { value: "9", label: "Nhóm dữ liệu", icon: Database },
              { value: "62", label: "Chỉ số phát triển", icon: Activity },
              { value: "12", label: "Thôn", icon: MapPinned },
              { value: "5", label: "Vai trò phân quyền", icon: ShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[80px]">
                <stat.icon className="size-5 text-emerald-600 opacity-70" />
                <span className="text-2xl font-black text-foreground">{stat.value}</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Tìm hiểu thêm</span>
          <button
            onClick={() => document.getElementById("tru-cot")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-card/85 backdrop-blur-xs text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-colors shadow-xs cursor-pointer focus-visible:outline-none"
            aria-label="Cuộn xuống"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ─── 3 Trụ cột Section ─────────────────────────────────────────────────── */}
      <section id="tru-cot" className="py-20 border-t border-border/40 bg-muted/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Kiến trúc hệ thống</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ba trụ cột hệ sinh thái dữ liệu số Lao Bảo</h2>
            <p className="text-sm text-muted-foreground">Tích hợp đồng bộ từ thu thập, lưu trữ, trực quan hóa đến điều hành — trên một nền tảng thống nhất.</p>
          </div>

          {/* Pillar tabs */}
          <div className="flex justify-center gap-2">
            {PILLARS.map((p) => (
              <button
                key={p.value}
                onClick={() => setActiveTab(p.value)}
                className={`flex items-center gap-1.5 py-2 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${activeTab === p.value ? `${p.bg} text-white border-transparent shadow-sm` : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
              >
                <p.icon className="size-4" />
                <span className="hidden sm:inline">{p.title}</span>
              </button>
            ))}
          </div>

          {/* Pillar content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${activePillar.color.replace("text-", "bg-").replace("600", "600/10")}`}>
                  <activePillar.icon className={`w-6 h-6 ${activePillar.color}`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">{activePillar.title}</h3>
                <p className="text-sm text-muted-foreground">{activePillar.subtitle}</p>
              </div>
              <ul className="space-y-3">
                {activePillar.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href={activeTab === "map" ? "/dashboard/map" : "/dashboard"}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-5 text-xs font-semibold text-background transition-colors hover:bg-foreground/90 cursor-pointer gap-1.5"
              >
                Khám phá {activePillar.title}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Mock UI panel per pillar */}
            <div className="border border-border bg-card/60 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/40">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <div className="text-[9px] font-mono text-muted-foreground/80 bg-background/70 px-3 py-0.5 rounded border border-border/30 ml-2 truncate">
                  cds.laobao.gov.vn/{activeTab === "datastore" ? "dashboard" : activeTab === "map" ? "dashboard/map" : "dashboard/indicators"}
                </div>
              </div>

              {activeTab === "datastore" && (
                <div className="p-5 space-y-3 text-xs">
                  <p className="font-bold text-foreground">Kho dữ liệu số · Xã Lao Bảo</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Hồ sơ số", value: "4,250+" },
                      { label: "Nhóm DL", value: "9 phân hệ" },
                      { label: "Đồng bộ", value: "100%" },
                    ].map((s, i) => (
                      <div key={i} className="bg-muted/30 border border-border/50 rounded-lg p-2.5 text-center">
                        <p className="font-black text-sm text-foreground">{s.value}</p>
                        <span className="text-[9px] text-muted-foreground">{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 border border-border/40 rounded-lg p-3 bg-background/30">
                    {["Nông nghiệp & OCOP", "Giáo dục & Y tế", "An sinh xã hội", "Thiên tai & Khẩn cấp"].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] border-b border-border/20 pb-1 last:border-none last:pb-0">
                        <span className="text-muted-foreground">{item}</span>
                        <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 py-0">
                          Hoạt động
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "map" && (
                <div className="p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-foreground">Bản đồ GIS · Lao Bảo</p>
                    <Badge variant="outline" className="text-[8px] bg-blue-500/10 text-blue-600 border-blue-500/20 py-0">
                      Demo Public
                    </Badge>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                      <Map className="size-4" />
                      <span>Bản đồ số xã Lao Bảo</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Trung tâm: 16.6335, 106.5985 · Zoom 14</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {["Hành chính", "Y tế", "Giáo dục", "Du lịch"].map((l) => (
                        <span key={l} className="text-[8px] bg-background border border-border/50 px-1.5 py-0.5 rounded font-semibold">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground italic">* Dữ liệu lớp bảo mật (QP-AN) bị ẩn trên bản xem thử công khai này.</p>
                </div>
              )}

              {activeTab === "dashboard" && (
                <div className="p-5 space-y-3 text-xs">
                  <p className="font-bold text-foreground">Dashboard lãnh đạo · 62 chỉ số</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Sản lượng lúa", value: "1,450 tấn", up: true },
                      { label: "Khách du lịch", value: "12,850 lượt", up: true },
                      { label: "Thu nhập bình quân", value: "46.5 tr/năm", up: true },
                      { label: "Nhiệm vụ đúng hạn", value: "94.5%", up: false },
                    ].map((s, i) => (
                      <div key={i} className="bg-muted/30 border border-border/50 rounded-lg p-2.5">
                        <p className="font-black text-sm text-foreground">{s.value}</p>
                        <span className="text-[9px] text-muted-foreground">{s.label}</span>
                        <div className={`text-[8px] font-bold mt-0.5 ${s.up ? "text-emerald-600" : "text-rose-500"}`}>{s.up ? "↑ Tốt" : "↓ Cần cải thiện"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9 Nhóm dữ liệu Section ────────────────────────────────────────────── */}
      <section id="du-lieu" className="py-20 border-t border-border/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Phân hệ dữ liệu</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">9 Nhóm Cơ sở Dữ liệu Nghiệp vụ</h2>
            <p className="text-sm text-muted-foreground">Bao quát toàn diện 9 lĩnh vực quản lý nhà nước tại xã Lao Bảo, tỉnh Quảng Trị.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DATA_GROUPS.map((group, idx) => (
              <div key={idx} className="bg-card border border-border/60 rounded-xl p-5 space-y-3 hover:border-primary/30 hover:shadow-xs transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 flex items-center justify-center rounded-lg ${group.color}`}>
                    <group.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Phân hệ {idx + 1}/9</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">{group.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{group.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quy trình dữ liệu Section ─────────────────────────────────────────── */}
      <section id="quy-trinh" className="py-20 border-t border-border/40 bg-muted/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Vòng đời dữ liệu</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quy trình Dữ liệu 5 bước chuẩn hóa</h2>
            <p className="text-sm text-muted-foreground">Đảm bảo tính xác thực, nhất quán và kiểm soát chất lượng dữ liệu từ thực địa đến điều hành.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-emerald-500/20 via-emerald-500/60 to-emerald-500/20" />
              {[
                { step: "01", title: "Thu thập", desc: "Cán bộ rà soát thực địa và nhập liệu trực tiếp qua ứng dụng web", icon: Users, color: "bg-emerald-600 text-white" },
                { step: "02", title: "Chuẩn hóa", desc: "Hệ thống tự kiểm chuẩn dữ liệu, phát hiện trùng lắp và thiếu sót", icon: CheckCircle2, color: "bg-blue-600 text-white" },
                { step: "03", title: "Phê duyệt", desc: "Lãnh đạo đơn vị xem xét và phê duyệt đa cấp qua quy trình số", icon: ShieldCheck, color: "bg-violet-600 text-white" },
                { step: "04", title: "Công bố", desc: "Dữ liệu được công bố nội bộ theo phân quyền bảo mật RBAC", icon: Globe, color: "bg-amber-600 text-white" },
                { step: "05", title: "Khai thác", desc: "Lãnh đạo tra cứu KPI, xuất báo cáo và xem bản đồ số điều hành", icon: BarChart3, color: "bg-rose-600 text-white" },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center gap-3">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-full ${step.color} shadow-md z-10 shrink-0`}>
                    <step.icon className="size-5" />
                  </div>
                  <div className="space-y-1 bg-card border border-border/60 rounded-xl p-3 w-full">
                    <span className="text-[9px] font-black text-muted-foreground">{step.step}</span>
                    <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI Features Section ───────────────────────────────────────────────── */}
      <AiFeaturesSection />

      {/* ─── Lợi ích từng nhóm Section ─────────────────────────────────────────── */}
      <section id="loi-ich" className="py-20 border-t border-border/40 bg-muted/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Giá trị thực tế</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lợi ích cho từng đối tượng sử dụng</h2>
            <p className="text-sm text-muted-foreground">Hệ thống được thiết kế để phục vụ hiệu quả toàn bộ các đối tượng liên quan đến quản lý cấp xã.</p>
          </div>

          {/* Benefit tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(BENEFITS) as Array<keyof typeof BENEFITS>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveBenefitTab(key)}
                className={`py-2 px-4 text-xs font-bold rounded-lg border transition-all cursor-pointer ${activeBenefitTab === key ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
              >
                {BENEFITS[key].title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {BENEFITS[activeBenefitTab].items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-card border border-border/60 rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/90 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Phân quyền & Bảo mật Section ─────────────────────────────────────── */}
      <section id="phan-quyen" className="py-20 border-t border-border/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Bảo mật hệ thống</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Phân quyền RBAC 5 vai trò & An toàn dữ liệu</h2>
            <p className="text-sm text-muted-foreground">Bảo vệ toàn diện dữ liệu nhà nước theo phân cấp hành chính và tiêu chuẩn bảo mật quốc phòng.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { role: "Admin", label: "Quản trị viên", desc: "Toàn quyền tất cả phân hệ, cài đặt và nhật ký kiểm toán.", color: "text-rose-600 bg-rose-500/10 border-rose-500/20" },
              { role: "Governance", label: "Văn phòng UBND", desc: "Quản lý quy trình phê duyệt và công bố dữ liệu.", color: "text-violet-600 bg-violet-500/10 border-violet-500/20" },
              { role: "Leader", label: "Lãnh đạo xã", desc: "Xem KPI, báo cáo tổng hợp và phân tích điều hành.", color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
              { role: "Unit", label: "Lãnh đạo đơn vị", desc: "Phê duyệt hồ sơ và xem dữ liệu ngành phụ trách.", color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
              { role: "Officer", label: "Cán bộ nhập liệu", desc: "Nhập liệu, cập nhật và xuất báo cáo nghiệp vụ.", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
            ].map((r, i) => (
              <div key={i} className="bg-card border border-border/60 rounded-xl p-5 space-y-3 hover:border-primary/20 transition-colors">
                <div className={`inline-flex px-2 py-1 rounded-md text-[9px] font-black uppercase border ${r.color}`}>{r.role}</div>
                <h4 className="font-bold text-sm text-foreground">{r.label}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* Security highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Lock, title: "Dữ liệu bảo mật QP-AN", desc: "Lớp dữ liệu quốc phòng bị ẩn hoàn toàn trên giao diện công khai và lọc theo RBAC." },
              { icon: ShieldCheck, title: "Nhật ký kiểm toán", desc: "Mọi thao tác truy cập, cập nhật, xuất dữ liệu đều ghi vết đầy đủ theo DATA-SECDEF-07." },
              { icon: Wifi, title: "Sao lưu tự động định kỳ", desc: "Cơ sở dữ liệu GIS và hồ sơ nghiệp vụ được sao lưu tự động hàng ngày và hàng tuần." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 bg-muted/30 border border-border/40 rounded-xl p-4">
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <item.icon className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-xs text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Lộ trình 2026–2028 Section ────────────────────────────────────────── */}
      <section id="lo-trinh" className="py-20 border-t border-border/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Kế hoạch phát triển</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lộ trình Chuyển đổi số 2026–2028</h2>
            <p className="text-sm text-muted-foreground">Ba giai đoạn từ số hóa dữ liệu cơ sở đến kết nối IOC tỉnh và trợ lý ảo AI thông minh.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROADMAP.map((phase) => (
              <div
                key={phase.year}
                className={`relative bg-card border rounded-2xl p-6 space-y-5 transition-all hover:shadow-md ${phase.status === "active"
                  ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/5"
                  : phase.status === "planned"
                    ? "border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5"
                    : "border-border/60"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-4xl font-black ${phase.status === "active" ? "text-emerald-600 dark:text-emerald-400" : phase.status === "planned" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                      }`}
                  >
                    {phase.year}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-bold uppercase ${phase.status === "active"
                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                      : phase.status === "planned"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                        : "bg-muted text-muted-foreground border-border"
                      }`}
                  >
                    {phase.status === "active" && <Zap className="size-2.5 mr-0.5 inline" />}
                    {phase.status === "planned" && <Rocket className="size-2.5 mr-0.5 inline" />}
                    {phase.status === "roadmap" && <Sparkles className="size-2.5 mr-0.5 inline" />}
                    {phase.label}
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${phase.status === "active" ? "bg-emerald-500" : phase.status === "planned" ? "bg-blue-500" : "bg-muted-foreground/40"}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                {phase.status === "roadmap" && (
                  <p className="text-[9px] text-muted-foreground italic border-t border-border/30 pt-3">
                    * Phân hệ AI/IOC sẽ hiển thị ở trạng thái &quot;Chưa kết nối&quot; — không mô phỏng dữ liệu thật.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ───────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 border-t border-border/40 bg-muted/10">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Giải đáp thắc mắc</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Câu hỏi thường gặp</h2>
            <p className="text-sm text-muted-foreground">Tổng hợp các câu hỏi phổ biến về hệ thống dữ liệu số xã Lao Bảo.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3" defaultValue="faq-1">
            {[
              {
                id: "faq-1",
                q: "Hệ thống này dành cho ai và ai có thể sử dụng?",
                a: "Hệ thống phục vụ 5 nhóm: Quản trị viên (Admin), Cán bộ Văn phòng UBND, Lãnh đạo xã (HĐND/UBND), Lãnh đạo đơn vị phối hợp và Cán bộ nhập liệu chuyên môn. Người dân và doanh nghiệp có thể tra cứu thông tin công khai theo quy định.",
              },
              {
                id: "faq-2",
                q: "Dữ liệu quốc phòng, an ninh được bảo vệ như thế nào?",
                a: "Tuân thủ yêu cầu DATA-SECDEF-07, hệ thống áp dụng 3 lớp bảo vệ: (1) Chỉ admin, data_governance và commune_leader mới xem được dữ liệu Confidential; (2) Log QP-AN chỉ ghi metadata tối thiểu, không lưu tọa độ nhạy cảm; (3) Bắt buộc xác thực 2FA khi truy cập phân hệ quốc phòng (mock trong phiên bản hiện tại).",
              },
              {
                id: "faq-3",
                q: "Hệ thống có thể kết nối với IOC tỉnh Quảng Trị không?",
                a: 'Có. Lộ trình Q4/2027 sẽ tích hợp chia sẻ chỉ số phát triển xã Lao Bảo lên Dashboard tổng hợp IOC tỉnh. Hiện tại, connector đang ở trạng thái "Đang lên kế hoạch" — hệ thống không mô phỏng kết nối thật.',
              },
              {
                id: "faq-4",
                q: "Tôi có thể xuất báo cáo dưới dạng nào?",
                a: "Hệ thống hỗ trợ xuất báo cáo Excel (.xlsx) và PDF cho tất cả 9 phân hệ dữ liệu, bao gồm báo cáo tổng hợp điều hành UBND, báo cáo chuyên ngành (nông nghiệp, y tế, giáo dục...) và danh mục 62 chỉ số phát triển đầy đủ.",
              },
              {
                id: "faq-5",
                q: "Trợ lý ảo AI đã vận hành chưa?",
                a: 'Chưa. Module AI Assistant và tích hợp IOC nằm trong lộ trình 2027–2028. Hệ thống hiện tại không mô phỏng dữ liệu AI thời gian thực. Mọi tính năng mô phỏng đều có nhãn rõ ràng "Mock — backend required".',
              },
              {
                id: "faq-6",
                q: "Bản đồ GIS công khai có hiển thị dữ liệu mật không?",
                a: "Không. Bản đồ demo công khai chỉ hiển thị các lớp public (hành chính, y tế, giáo dục, du lịch, thiên tai). Lớp quốc phòng an ninh và dữ liệu nhạy cảm bị ẩn hoàn toàn và chỉ hiển thị cho các vai trò được phép sau khi đăng nhập.",
              },
            ].map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border border-border/60 rounded-xl px-4 md:px-5 hover:border-emerald-500/30 transition-colors bg-card">
                <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground hover:no-underline py-5">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm text-muted-foreground leading-relaxed pb-5">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-border/40 bg-muted/20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 mx-auto">
            <Rocket className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Bắt đầu trải nghiệm hệ thống ngay hôm nay</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Đăng nhập để trải nghiệm đầy đủ Dashboard điều hành lãnh đạo, Kho dữ liệu số 9 phân hệ và Bản đồ GIS thông minh xã Lao Bảo với dữ liệu mô phỏng thực tế.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-8 text-sm font-bold text-white transition-all hover:bg-emerald-500 shadow-md shadow-emerald-600/20 cursor-pointer gap-2"
            >
              <LogIn className="size-4" />
              Đăng nhập hệ thống
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-8 text-sm font-semibold text-foreground transition-all hover:bg-accent cursor-pointer gap-2"
            >
              <LayoutDashboard className="size-4" />
              Xem Demo Dashboard
            </Link>
            <Link
              href="/dashboard/map"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/5 px-8 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-500/10 cursor-pointer gap-2"
            >
              <Map className="size-4" />
              Xem Demo Bản đồ
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-muted/30 py-12 text-xs text-muted-foreground">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
                <span className="font-bold text-foreground text-sm">{APP_CONFIG.shortName} · Dữ liệu số</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Hệ sinh thái dữ liệu số phục vụ quản lý, <br />
                chỉ đạo và điều hành xã Lao Bảo.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-foreground text-[11px] uppercase tracking-wider">Liên kết nhanh</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: "Đăng nhập hệ thống", href: "/login" },
                  { label: "Dashboard điều hành", href: "/dashboard" },
                  { label: "Bản đồ GIS số", href: "/dashboard/map" },
                  { label: "Bộ chỉ số phát triển", href: "/dashboard/indicators" },
                ].map((l, i) => (
                  <Link key={i} href={l.href} className="hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-foreground text-[11px] uppercase tracking-wider">Thông tin hành chính</p>
              <div className="flex flex-col gap-1 text-[11px]">
                <span>UBND Xã Lao Bảo</span>
                <span>Tỉnh Quảng Trị</span>
                <span>Tọa độ: 16°38&apos;N, 106°35&apos;E</span>
                <span>Hệ quy chiếu: WGS-84 (EPSG:4326)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>&copy; 2026 UBND Xã Lao Bảo, Tỉnh Quảng Trị. Bản quyền được bảo lưu.</p>
            <div className="flex items-center gap-2">
              <ThemeToggle variant="icon" />
              <Badge variant="outline" className="text-[8px] text-muted-foreground border-border">
                Phiên bản 1.0 · 2026
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Back to Top ───────────────────────────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card/85 backdrop-blur-md text-muted-foreground hover:text-emerald-500 hover:border-emerald-500 transition-all duration-300 shadow-md cursor-pointer focus-visible:outline-none ${showBackToTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"
          }`}
        aria-label="Cuộn lên đầu trang"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
