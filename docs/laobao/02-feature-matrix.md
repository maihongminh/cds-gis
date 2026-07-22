# 02 — Stable Feature Matrix

## 1. Summary Count by Namespace
To ensure auditability and automated verification, below is the summary of the 110 features categorized by their namespace:

| Namespace | Category / Area | Feature Count | Status |
| :--- | :--- | :---: | :--- |
| `SYS-AUTH` | Authentication | 3 | Pending |
| `SYS-PROFILE` | User Profile | 2 | Pending |
| `SYS-USER` | User Management | 5 | Pending |
| `SYS-ROLE` | Role Management | 4 | Pending |
| `SYS-ORG` | Organization Management | 4 | Pending |
| `SYS-STAFF` | Staff Management | 4 | Pending |
| `SYS-AUDIT` | Audit Logs | 1 | Pending |
| `SYS-BACKUP` | Backup & Recovery | 3 | Pending |
| `SYS-CONFIG` | System Settings | 2 | Pending |
| `DATA-ADMINPOP` | Administrative & Population Data | 7 | Pending |
| `DATA-ECON` | Economic Data | 7 | Pending |
| `DATA-TOUR` | Tourism, Commerce, Services Data | 7 | Pending |
| `DATA-LAND` | Land, Planning, Construction Data | 7 | Pending |
| `DATA-AGRIENV` | Agriculture & Environment Data | 7 | Pending |
| `DATA-EDUHEALTH`| Education & Health Data | 7 | Pending |
| `DATA-WELFARE` | Social Welfare Data | 7 | Pending |
| `DATA-SECDEF` | Security & Defense Data | 8 | Pending |
| `DATA-DISASTER` | Disaster Prevention & Emergency Data | 7 | Pending |
| `SYS-NOTIFY` | Notifications | 1 | Pending |
| `MAP` | Smart Map | 8 | Pending |
| `DASH` | Leadership Dashboard | 2 | Pending |
| `REPORT` | Analysis & Reporting | 2 | Pending |
| `IOC` | IOC Integration | 3 | Pending |
| `AI` | Artificial Intelligence | 2 | Pending |
| **Total** | **All Modules** | **110** | **110/110 Unique** |

---

## 2. Feature Registry Matrix
Below is the master matrix mapping the 110 features from the BA specifications to their target routes, implementation tasks, and development statuses.

| featureCode | sourceStt | sourceRowNote | group | shortDescription | priority | targetRoute | implementationTask | implementationStatus |
| :--- | :---: | :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| `SYS-AUTH-01` | 1 | | Quản lý xác thực | Đăng nhập | High | `/login` | TASK 06 | Pending |
| `SYS-AUTH-02` | 2 | | Quản lý xác thực | Đặt lại mật khẩu | High | `/forgot-password` | TASK 06 | Pending |
| `SYS-AUTH-03` | 3 | | Quản lý xác thực | Đăng xuất | High | `/` | TASK 06 | Pending |
| `SYS-PROFILE-01` | 4 | | Hồ sơ người dùng | Chỉnh sửa hồ sơ | Medium | `/dashboard/profile` | TASK 06 | Pending |
| `SYS-PROFILE-02` | 5 | | Hồ sơ người dùng | Đổi mật khẩu | Medium | `/dashboard/profile` | TASK 06 | Pending |
| `SYS-USER-01` | 6 | | Quản lý tài khoản | Xem danh sách tài khoản người dùng | High | `/dashboard/users` | TASK 06 | Pending |
| `SYS-USER-02` | 7 | | Quản lý tài khoản | Tạo mới tài khoản | High | `/dashboard/users` | TASK 06 | Pending |
| `SYS-USER-03` | 8 | | Quản lý tài khoản | Chỉnh sửa tài khoản | High | `/dashboard/users` | TASK 06 | Pending |
| `SYS-USER-04` | 9 | | Quản lý tài khoản | Thay đổi trạng thái | Medium | `/dashboard/users` | TASK 06 | Pending |
| `SYS-USER-05` | 10 | | Quản lý tài khoản | Gán quyền vào tài khoản | High | `/dashboard/users` | TASK 06 | Pending |
| `SYS-ROLE-01` | 11 | | Quản lý nhóm người dùng | Xem danh sách role | High | `/dashboard/roles` | TASK 06 | Pending |
| `SYS-ROLE-02` | 12 | | Quản lý nhóm người dùng | Tạo mới role | High | `/dashboard/roles` | TASK 06 | Pending |
| `SYS-ROLE-03` | 13 | | Quản lý nhóm người dùng | Chỉnh sửa role | High | `/dashboard/roles` | TASK 06 | Pending |
| `SYS-ROLE-04` | 14 | | Quản lý nhóm người dùng | Xoá nhóm người dùng | Medium | `/dashboard/roles` | TASK 06 | Pending |
| `SYS-ORG-01` | 15 | | Quản lý tổ chức | Xem danh sách tổ chức | High | `/dashboard/organizations` | TASK 06 | Pending |
| `SYS-ORG-02` | 16 | | Quản lý tổ chức | Tạo mới chi nhánh/phòng ban | High | `/dashboard/organizations` | TASK 06 | Pending |
| `SYS-ORG-03` | 17 | | Quản lý tổ chức | Chỉnh sửa chi nhánh/phòng ban | High | `/dashboard/organizations` | TASK 06 | Pending |
| `SYS-ORG-04` | 18 | | Quản lý tổ chức | Xóa chi nhánh/phòng ban | Medium | `/dashboard/organizations` | TASK 06 | Pending |
| `SYS-STAFF-01` | 19 | | Quản lý cán bộ nhân viên | Xem danh sách cán bộ nhân viên | High | `/dashboard/staff` | TASK 06 | Pending |
| `SYS-STAFF-02` | 20 | | Quản lý cán bộ nhân viên | Tạo mới nhân viên | High | `/dashboard/staff` | TASK 06 | Pending |
| `SYS-STAFF-03` | 21 | | Quản lý cán bộ nhân viên | Chỉnh sửa thông tin nhân viên | High | `/dashboard/staff` | TASK 06 | Pending |
| `SYS-STAFF-04` | 22 | | Quản lý cán bộ nhân viên | Thay đổi trạng thái | Medium | `/dashboard/staff` | TASK 06 | Pending |
| `SYS-AUDIT-01` | 23 | | Nhật ký hoạt động | Audit log | High | `/dashboard/audit-logs` | TASK 21 | Pending |
| `SYS-BACKUP-01` | 24 | | Sao lưu và lưu trữ | Backup dữ liệu định kỳ | Medium | `/dashboard/backups` | TASK 21 | Pending |
| `SYS-BACKUP-02` | 25 | | Sao lưu và lưu trữ | Xóa mềm dữ liệu | Medium | `/dashboard/backups` | TASK 21 | Pending |
| `SYS-BACKUP-03` | 26 | | Sao lưu và lưu trữ | Khôi phục dữ liệu đã xóa mềm | Medium | `/dashboard/backups` | TASK 21 | Pending |
| `SYS-CONFIG-01` | 27 | | Cấu hình hệ thống | Cấu hình tần suất cập nhật | Medium | `/dashboard/settings` | TASK 21 | Pending |
| `SYS-CONFIG-02` | 28 | | Cấu hình hệ thống | Kết nối, đồng bộ dữ liệu | Medium | `/dashboard/integrations` | TASK 21 | Pending |
| `DATA-ADMINPOP-01` | 30 | | Hành chính và dân cư | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/administrative-population` | TASK 09 | Pending |
| `DATA-ADMINPOP-02` | 31 | | Hành chính và dân cư | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-ADMINPOP-03` | 32 | | Hành chính và dân cư | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/administrative-population` | TASK 09 | Pending |
| `DATA-ADMINPOP-04` | 33 | | Hành chính và dân cư | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-ADMINPOP-05` | 34 | | Hành chính và dân cư | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-ADMINPOP-06` | 35 | | Hành chính và dân cư | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-ADMINPOP-07` | 36 | | Hành chính và dân cư | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-ECON-01` | 37 | | Kinh tế | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/economy` | TASK 10 | Pending |
| `DATA-ECON-02` | 38 | | Kinh tế | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-ECON-03` | 39 | | Kinh tế | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/economy` | TASK 10 | Pending |
| `DATA-ECON-04` | 40 | | Kinh tế | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-ECON-05` | 41 | | Kinh tế | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-ECON-06` | 42 | | Kinh tế | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-ECON-07` | 43 | | Kinh tế | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-TOUR-01` | 44 | | Du lịch, thương mại và dịch vụ | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/tourism-services` | TASK 11 | Pending |
| `DATA-TOUR-02` | 45 | | Du lịch, thương mại và dịch vụ | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-TOUR-03` | 46 | | Du lịch, thương mại và dịch vụ | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/tourism-services` | TASK 11 | Pending |
| `DATA-TOUR-04` | 47 | | Du lịch, thương mại và dịch vụ | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-TOUR-05` | 48 | | Du lịch, thương mại và dịch vụ | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-TOUR-06` | 49 | | Du lịch, thương mại và dịch vụ | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-TOUR-07` | 50 | | Du lịch, thương mại và dịch vụ | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-LAND-01` | 51 | | Đất đai, quy hoạch và xây dựng | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/land-planning` | TASK 12 | Pending |
| `DATA-LAND-02` | 52 | | Đất đai, quy hoạch và xây dựng | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-LAND-03` | 53 | | Đất đai, quy hoạch và xây dựng | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/land-planning` | TASK 12 | Pending |
| `DATA-LAND-04` | 54 | | Đất đai, quy hoạch và xây dựng | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-LAND-05` | 55 | | Đất đai, quy hoạch và xây dựng | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-LAND-06` | 56 | | Đất đai, quy hoạch và xây dựng | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-LAND-07` | 57 | | Đất đai, quy hoạch và xây dựng | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-AGRIENV-01` | 58 | | Nông nghiệp và môi trường | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/agriculture-environment` | TASK 13 | Pending |
| `DATA-AGRIENV-02` | 59 | | Nông nghiệp và môi trường | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-AGRIENV-03` | 60 | | Nông nghiệp và môi trường | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/agriculture-environment` | TASK 13 | Pending |
| `DATA-AGRIENV-04` | 61 | | Nông nghiệp và môi trường | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-AGRIENV-05` | 62 | | Nông nghiệp và môi trường | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-AGRIENV-06` | 63 | | Nông nghiệp và môi trường | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-AGRIENV-07` | 64 | | Nông nghiệp và môi trường | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-EDUHEALTH-01` | 65 | | Giáo dục và y tế | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/education-health` | TASK 14 | Pending |
| `DATA-EDUHEALTH-02` | 66 | | Giáo dục và y tế | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-EDUHEALTH-03` | 67 | | Giáo dục và y tế | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/education-health` | TASK 14 | Pending |
| `DATA-EDUHEALTH-04` | 68 | | Giáo dục và y tế | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-EDUHEALTH-05` | 69 | | Giáo dục và y tế | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-EDUHEALTH-06` | 70 | | Giáo dục và y tế | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-EDUHEALTH-07` | 71 | | Giáo dục và y tế | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-WELFARE-01` | 72 | | An sinh xã hội | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/social-welfare` | TASK 15 | Pending |
| `DATA-WELFARE-02` | 73 | | An sinh xã hội | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-WELFARE-03` | 74 | | An sinh xã hội | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/social-welfare` | TASK 15 | Pending |
| `DATA-WELFARE-04` | 75 | | An sinh xã hội | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-WELFARE-05` | 76 | | An sinh xã hội | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-WELFARE-06` | 77 | | An sinh xã hội | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-WELFARE-07` | 78 | | An sinh xã hội | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-SECDEF-01` | 79 | | Quốc phòng và an ninh | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/security-defense` | TASK 16 | Pending |
| `DATA-SECDEF-02` | 80 | | Quốc phòng và an ninh | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-SECDEF-03` | 81 | | Quốc phòng và an ninh | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/security-defense` | TASK 16 | Pending |
| `DATA-SECDEF-04` | 82 | | Quốc phòng và an ninh | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-SECDEF-05` | 83 | | Quốc phòng và an ninh | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-SECDEF-06` | 84 | | Quốc phòng và an ninh | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-SECDEF-07` | null | between 84 and 86 | Quốc phòng và an ninh | Cơ chế phân quyền, mã hóa dữ liệu nhóm QP-AN | High | `/dashboard/security-defense` | TASK 16 | Pending |
| `DATA-SECDEF-08` | 86 | | Quốc phòng và an ninh | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `DATA-DISASTER-01` | 87 | | Phòng chống thiên tai và điều hành khẩn cấp | Xem danh sách toàn bộ dữ liệu | High | `/dashboard/disaster-emergency` | TASK 17 | Pending |
| `DATA-DISASTER-02` | 88 | | Phòng chống thiên tai và điều hành khẩn cấp | Biểu mẫu thu thập, chuẩn hóa dữ liệu | High | `/dashboard/data-templates` | TASK 07 | Pending |
| `DATA-DISASTER-03` | 89 | | Phòng chống thiên tai và điều hành khẩn cấp | Nhập liệu thủ công theo lĩnh vực | High | `/dashboard/disaster-emergency` | TASK 17 | Pending |
| `DATA-DISASTER-04` | 90 | | Phòng chống thiên tai và điều hành khẩn cấp | Nhập/xuất dữ liệu hàng loạt | High | `/dashboard/data-imports` | TASK 08 | Pending |
| `DATA-DISASTER-05` | 91 | | Phòng chống thiên tai và điều hành khẩn cấp | Phê duyệt và công bố dữ liệu | High | `/dashboard/data-approvals` | TASK 08 | Pending |
| `DATA-DISASTER-06` | 92 | | Phòng chống thiên tai và điều hành khẩn cấp | Tra cứu, tìm kiếm dữ liệu | Medium | `/dashboard/data-search` | TASK 08 | Pending |
| `DATA-DISASTER-07` | 93 | | Phòng chống thiên tai và điều hành khẩn cấp | Quản lý phiên bản và lịch sử | Medium | `/dashboard/data-versions` | TASK 08 | Pending |
| `SYS-NOTIFY-01` | 94 | | Thông báo | Xem danh sách thông báo | Medium | `/dashboard/notifications` | TASK 08 | Pending |
| `MAP-01` | 95 | | Bản đồ số thông minh | Nền bản đồ hành chính xã Lao Bảo | High | `/dashboard/map` | TASK 18 | Pending |
| `MAP-02` | 96 | | Bản đồ số thông minh | Quản lý lớp dữ liệu không gian (layer) | High | `/dashboard/map/layers` | TASK 19 | Pending |
| `MAP-03` | 97 | | Bản đồ số thông minh | Xem chi tiết thông tin đối tượng | High | `/dashboard/map` | TASK 19 | Pending |
| `MAP-04` | 98 | | Bản đồ số thông minh | Tìm kiếm địa điểm, đối tượng | High | `/dashboard/map` | TASK 19 | Pending |
| `MAP-05` | 99 | | Bản đồ số thông minh | Tích hợp bản đồ nền/ảnh vệ tinh | Medium | `/dashboard/map` | TASK 18 | Pending |
| `MAP-06` | 100 | | Bản đồ số thông minh | Xây dựng, nâng cấp Bản đồ số phiên bản 2.0 | Low | `/dashboard/map` | TASK 19 | Pending |
| `MAP-07` | 101 | | Bản đồ số thông minh | Xuất bản đồ chuyên đề | Medium | `/dashboard/map` | TASK 19 | Pending |
| `MAP-08` | 102 | | Bản đồ số thông minh | Phân quyền truy cập lớp dữ liệu bản đồ | High | `/dashboard/map/layers` | TASK 19 | Pending |
| `DASH-01` | 103 | | Dashboard điều hành lãnh đạo | Xem dashboard tổng quan | High | `/dashboard` | TASK 20 | Pending |
| `DASH-02` | 104 | | Dashboard điều hành lãnh đạo | Xuất dashboard tổng quan | Medium | `/dashboard` | TASK 20 | Pending |
| `REPORT-01` | 105 | | Báo cáo phân tích | Xem báo cáo | High | `/dashboard/reports` | TASK 20 | Pending |
| `REPORT-02` | 106 | | Báo cáo phân tích | Xuất báo cáo | Medium | `/dashboard/reports` | TASK 20 | Pending |
| `IOC-01` | 107 | | Định hướng tích hợp IOC | Tích hợp API/kết nối nền tảng IOC | Medium | `/dashboard/integrations` | TASK 21 | Pending |
| `IOC-02` | 108 | | Định hướng tích hợp IOC | Chuẩn bị hạ tầng, dữ liệu | Medium | `/dashboard/integrations` | TASK 21 | Pending |
| `IOC-03` | 109 | | Định hướng tích hợp IOC | Giám sát, cảnh báo tổng hợp đa lĩnh vực | Low | `/dashboard/integrations` | TASK 21 | Pending |
| `AI-01` | 110 | | Nghiên cứu ứng dụng AI | Trợ lý AI tra cứu dữ liệu (Mockup) | Low | `/dashboard/ai-assistant` | TASK 23 | Done |
| `AI-02` | 111 | | Nghiên cứu ứng dụng AI | AI phân tích, dự báo (Mockup) | Low | `/dashboard/ai-assistant`, `/dashboard` | TASK 23 | Done |
