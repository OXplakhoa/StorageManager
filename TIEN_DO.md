# 📋 TIẾN ĐỘ DỰ ÁN – PTTKHT Quản lý Kho hàng (Nhóm 11)

> **Cập nhật lần cuối:** 14/04/2026 – 10:40  
> **Deadline:** Thứ 7, 18/04/2026  
> **Trạng thái tổng thể:** 🟡 Đang thực hiện (Hoàn thành ~45%)

---

## 📊 Tổng quan Tiến độ

```
Chương 1 – Tổng quan               ██░░░░░░░░  20%  (Đã có sẵn từ docx, cần bổ sung)
Chương 2 – Phân tích hệ thống      ██████████ 100%  ✅ HOÀN THÀNH!
Chương 3 – Thiết kế hệ thống       ░░░░░░░░░░   0%
Chương 4 – Kết luận                 ░░░░░░░░░░   0%
Web App                             ░░░░░░░░░░   0%
────────────────────────────────────────────────────
TỔNG                                ██████░░░░  ~45%
```

---

## 🗂️ Chi tiết Từng Hạng mục

### CHƯƠNG 1: TỔNG QUAN
| # | Hạng mục | Trạng thái | File output | Ghi chú |
|---|---|---|---|---|
| 1.1 | Giới thiệu tổ chức (Công ty Minh Phát) | ✅ Đã có | `docx gốc – mục 1.3.1` | Có sẵn trong docx nhóm |
| 1.2 | Cơ cấu tổ chức (5 tác nhân) | ✅ Đã có | `docx gốc – mục 1.3.2` | Có sẵn trong docx nhóm |
| 1.3 | Đặc tả 5 nghiệp vụ chính (NV1→NV5) | ✅ Đã có | `docx gốc – mục 1.3.3` | Có sẵn trong docx nhóm |
| 1.4 | Biểu mẫu 1–4 (Phiếu NK, XK, BB Kiểm kê, Thẻ kho) | ✅ Đã có | `docx gốc – mục 1.3.4` | Có sẵn trong docx nhóm |
| 1.5 | Phần MỞ ĐẦU (pain-points, lý do chọn đề tài) | ⬜ Chưa làm | — | Cần viết mới |
| 1.6 | Mục tiêu & Phạm vi đề tài | ⬜ Chưa làm | — | Cần viết mới |
| 1.7 | Sơ đồ cơ cấu tổ chức (Mermaid) | ⬜ Chưa làm | — | Vẽ mới |
| 1.8 | Ma trận Vấn đề – Giải pháp | ⬜ Chưa làm | — | Viết mới (truy vết Ch1→Ch2) |
| 1.9 | Biểu mẫu 5: Phiếu đề nghị xuất kho | ⬜ Chưa làm | — | Bổ sung |
| 1.10 | Biểu mẫu 6: Biên bản chênh lệch | ⬜ Chưa làm | — | Bổ sung |
| 1.11 | Kết chương 1 | ⬜ Chưa làm | — | Viết mới |

---

### CHƯƠNG 2: PHÂN TÍCH HỆ THỐNG

#### 2.2 Mô hình hóa Nghiệp vụ (Trọng số: 20%)
| # | Hạng mục | Trạng thái | File output |
|---|---|---|---|
| 2.2.1 | Sơ đồ Use Case nghiệp vụ (7 UC) | ✅ Xong | [`diagrams/uc_nghiep_vu.md`](file:///Users/khoado/code/PTTKHT/diagrams/uc_nghiep_vu.md) |
| 2.2.2a | Đặc tả UC_NV01→NV05 | ✅ Đã có | `docx gốc – mục 2.2.2` |
| 2.2.2b | Đặc tả UC_NV06 – Quản lý danh mục | ✅ Xong | [`docs/dac_ta_uc_nv_bo_sung.md`](file:///Users/khoado/code/PTTKHT/docs/dac_ta_uc_nv_bo_sung.md) |
| 2.2.2c | Đặc tả UC_NV07 – Kiểm kê định kỳ | ✅ Xong | [`docs/dac_ta_uc_nv_bo_sung.md`](file:///Users/khoado/code/PTTKHT/docs/dac_ta_uc_nv_bo_sung.md) |
| 2.2.3a | Activity Diagram – UC_NV01: Nhập kho | ✅ Xong | [`diagrams/activity/act_uc_nv01_nhap_kho.md`](file:///Users/khoado/code/PTTKHT/diagrams/activity/act_uc_nv01_nhap_kho.md) |
| 2.2.3b | Activity Diagram – UC_NV02: Xuất kho | ✅ Xong | [`diagrams/activity/act_uc_nv02_xuat_kho.md`](file:///Users/khoado/code/PTTKHT/diagrams/activity/act_uc_nv02_xuat_kho.md) |
| 2.2.3c | Activity Diagram – UC_NV03: Kiểm tra HH | ✅ Xong | [`diagrams/activity/act_uc_nv03_kiem_tra.md`](file:///Users/khoado/code/PTTKHT/diagrams/activity/act_uc_nv03_kiem_tra.md) |
| 2.2.3d | Activity Diagram – UC_NV04: Xử lý chênh lệch | ✅ Xong | [`diagrams/activity/act_uc_nv04_chenh_lech.md`](file:///Users/khoado/code/PTTKHT/diagrams/activity/act_uc_nv04_chenh_lech.md) |
| 2.2.3e | Activity Diagram – UC_NV05: Báo cáo kho | ✅ Xong | [`diagrams/activity/act_uc_nv05_bao_cao.md`](file:///Users/khoado/code/PTTKHT/diagrams/activity/act_uc_nv05_bao_cao.md) |
| 2.2.3f | Activity Diagram – UC_NV06: Danh mục | ✅ Xong | [`diagrams/activity/act_uc_nv06_danh_muc.md`](file:///Users/khoado/code/PTTKHT/diagrams/activity/act_uc_nv06_danh_muc.md) |
| 2.2.3g | Activity Diagram – UC_NV07: Kiểm kê | ✅ Xong | [`diagrams/activity/act_uc_nv07_kiem_ke.md`](file:///Users/khoado/code/PTTKHT/diagrams/activity/act_uc_nv07_kiem_ke.md) |
| 2.2.4a | Sequence Diagram NV – UC_NV01 | ✅ Xong | [`diagrams/sequence_nv/seq_uc_nv01_nhap_kho.md`](file:///Users/khoado/code/PTTKHT/diagrams/sequence_nv/seq_uc_nv01_nhap_kho.md) |
| 2.2.4b | Sequence Diagram NV – UC_NV02 | ✅ Xong | [`diagrams/sequence_nv/seq_uc_nv02_xuat_kho.md`](file:///Users/khoado/code/PTTKHT/diagrams/sequence_nv/seq_uc_nv02_xuat_kho.md) |
| 2.2.4c | Sequence Diagram NV – UC_NV03 | ✅ Xong | [`diagrams/sequence_nv/seq_uc_nv03_kiem_tra.md`](file:///Users/khoado/code/PTTKHT/diagrams/sequence_nv/seq_uc_nv03_kiem_tra.md) |
| 2.2.4d | Sequence Diagram NV – UC_NV04 | ✅ Xong | [`diagrams/sequence_nv/seq_uc_nv04_chenh_lech.md`](file:///Users/khoado/code/PTTKHT/diagrams/sequence_nv/seq_uc_nv04_chenh_lech.md) |
| 2.2.4e | Sequence Diagram NV – UC_NV05 | ✅ Xong | [`diagrams/sequence_nv/seq_uc_nv05_bao_cao.md`](file:///Users/khoado/code/PTTKHT/diagrams/sequence_nv/seq_uc_nv05_bao_cao.md) |
| 2.2.4f | Sequence Diagram NV – UC_NV06 | ✅ Xong | [`diagrams/sequence_nv/seq_uc_nv06_danh_muc.md`](file:///Users/khoado/code/PTTKHT/diagrams/sequence_nv/seq_uc_nv06_danh_muc.md) |
| 2.2.4g | Sequence Diagram NV – UC_NV07 | ✅ Xong | [`diagrams/sequence_nv/seq_uc_nv07_kiem_ke.md`](file:///Users/khoado/code/PTTKHT/diagrams/sequence_nv/seq_uc_nv07_kiem_ke.md) |

> **Ghi chú:** Tất cả Activity Diagrams đã kèm theo **📐 Bảng Swimlane Mapping + Guard Conditions** để vẽ lại trong IBM Rational Rose.

#### 2.3 Mô hình hóa Chức năng (Trọng số: 30%)
| # | Hạng mục | Trạng thái | File output |
|---|---|---|---|
| 2.3.1 | Sơ đồ Use Case hệ thống (17 UC) | ✅ Xong | [`diagrams/uc_he_thong.md`](file:///Users/khoado/code/PTTKHT/diagrams/uc_he_thong.md) |
| 2.3.2 | Đặc tả UC hệ thống (17 UC chi tiết) | ✅ Xong | [`docs/dac_ta_uc_ht_p1.md`](file:///Users/khoado/code/PTTKHT/docs/dac_ta_uc_ht_p1.md) + [`p2`](file:///Users/khoado/code/PTTKHT/docs/dac_ta_uc_ht_p2.md) |

#### 2.4 Mô hình hóa Cấu trúc (Trọng số: 30%)
| # | Hạng mục | Trạng thái | File output |
|---|---|---|---|
| 2.4.1 | Sơ đồ lớp mức phân tích (17 Entity Classes) | ✅ Xong | [`diagrams/class_phan_tich.md`](file:///Users/khoado/code/PTTKHT/diagrams/class_phan_tich.md) |

---

### CHƯƠNG 3: THIẾT KẾ HỆ THỐNG (Trọng số: 20%)
| # | Hạng mục | Trạng thái | File output |
|---|---|---|---|
| 3.2 | Thiết kế CSDL – ER Diagram | ⬜ Chưa làm | — |
| 3.3 | Thiết kế giao diện (Mockup UI Web) | ⬜ Chưa làm | — |
| 3.4 | Sơ đồ lớp mức thiết kế (3 lớp) | ⬜ Chưa làm | — |
| 3.5a | Seq Design – Lập Phiếu nhập kho | ⬜ Chưa làm | — |
| 3.5b | Seq Design – Lập Phiếu xuất kho | ⬜ Chưa làm | — |
| 3.5c | Seq Design – Phê duyệt Phiếu | ⬜ Chưa làm | — |
| 3.5d | Seq Design – Thực hiện Kiểm kê | ⬜ Chưa làm | — |
| 3.5e | Seq Design – Xem Báo cáo NXT | ⬜ Chưa làm | — |
| 3.5f | Seq Design – 🤖 AI Dự báo nhu cầu | ⬜ Chưa làm | — |

---

### CHƯƠNG 4: KẾT LUẬN
| # | Hạng mục | Trạng thái | File output |
|---|---|---|---|
| 4.1 | Tổng kết kết quả đạt được | ⬜ Chưa làm | — |
| 4.2 | Hạn chế & Hướng phát triển | ⬜ Chưa làm | — |

---

### 🌐 WEB APP (Sản phẩm demo)
| # | Hạng mục | Trạng thái | File output |
|---|---|---|---|
| W1 | Setup project (Vite + React + Express + SQLite) | ⬜ Chưa làm | — |
| W2 | Frontend – Dashboard + UI Components | ⬜ Chưa làm | — |
| W3 | Frontend – CRUD NCC, Hàng hóa | ⬜ Chưa làm | — |
| W4 | Frontend – Nhập/Xuất kho + Phê duyệt | ⬜ Chưa làm | — |
| W5 | Frontend – Kiểm kê + Báo cáo | ⬜ Chưa làm | — |
| W6 | Backend – REST API + Database | ⬜ Chưa làm | — |
| W7 | 🤖 AI Features (Forecast + Smart Alert) | ⬜ Chưa làm | — |

---

### 📁 THIẾT LẬP DỰ ÁN
| # | Hạng mục | Trạng thái | File output |
|---|---|---|---|
| S1 | Tạo cấu trúc thư mục project | ✅ Xong | `diagrams/`, `docs/`, `.agent/` |
| S2 | Agent Rules – Senior BA Persona | ✅ Xong | [`.agent/rules/senior_ba_persona.md`](file:///Users/khoado/code/PTTKHT/.agent/rules/senior_ba_persona.md) |
| S3 | Agent Skills – OOAD Best Practices | ✅ Xong | [`.agent/skills/ooad_best_practices.md`](file:///Users/khoado/code/PTTKHT/.agent/skills/ooad_best_practices.md) |
| S4 | Agent Skills – PTTKHT Course Guidelines | ✅ Xong | [`.agent/skills/pttkht_course_guidelines.md`](file:///Users/khoado/code/PTTKHT/.agent/skills/pttkht_course_guidelines.md) |
| S5 | Agent Rules – IBM Rose Notation Guide | ✅ Xong | [`.agent/rules/ibm_rose_notation.md`](file:///Users/khoado/code/PTTKHT/.agent/rules/ibm_rose_notation.md) |

---

## 📅 Lịch trình Dự kiến

| Ngày | Công việc | Trạng thái |
|---|---|---|
| **T2 (13/04) – Tối** | ✅ Setup project, plan, UC NV, Activity Diagrams, Sequence NV | ✅ Hoàn thành |
| **T3 (14/04) – Sáng** | Hoàn thiện Ch1 (bổ sung Mở đầu, Mục tiêu, Biểu mẫu) | ⬜ |
| **T3 (14/04) – Chiều** | Sơ đồ UC Hệ thống + Đặc tả 17 UC HT | ⬜ |
| **T3 (14/04) – Tối** | Sơ đồ lớp mức phân tích (Analysis Class Diagram) | ⬜ |
| **T4 (15/04) – Sáng** | Thiết kế DB Schema + ER Diagram | ⬜ |
| **T4 (15/04) – Chiều/Tối** | Code Web App (Setup + Dashboard + CRUD) | ⬜ |
| **T5 (16/04)** | Code Web App (Nhập/Xuất kho + Phê duyệt + Kiểm kê) | ⬜ |
| **T6 (17/04) – Sáng** | Code AI Features + Báo cáo | ⬜ |
| **T6 (17/04) – Chiều** | Sơ đồ lớp thiết kế + Sequence Design (3 lớp) | ⬜ |
| **T6 (17/04) – Tối** | Hoàn thiện Ch3, Ch4, Review toàn bộ | ⬜ |
| **T7 (18/04)** | 🎯 **NỘP BÀI** | ⬜ |

---

## 📝 Nhật ký Thay đổi (Changelog)

| Thời gian | Thay đổi |
|---|---|
| 13/04 – 22:55 | Approved implementation plan. Bắt đầu thực hiện. |
| 13/04 – 23:00 | ✅ Tạo Sơ đồ UC Nghiệp vụ (7 UC) + Đặc tả UC_NV06, UC_NV07 |
| 13/04 – 23:03 | ✅ Hoàn thành 7 Activity Diagrams (NV01→NV07) |
| 13/04 – 23:05 | ✅ Hoàn thành 7 Sequence Diagrams nghiệp vụ (NV01→NV07) |
| 13/04 – 23:09 | ✅ Tạo IBM Rose Notation Guide + Bổ sung Swimlane Mapping cho tất cả Activity Diagrams |
| 13/04 – 23:12 | ✅ Tạo file TIEN_DO.md (file này) |
| 13/04 – 23:22 | ✅ Sơ đồ Use Case Hệ thống (17 UC) + Ma trận truy vết NV→HT + Hướng dẫn Rose |
| 13/04 – 23:22 | ✅ Đặc tả chi tiết 17 UC hệ thống (2 file: P1 UC01→09, P2 UC10→17 bao gồm 2 AI) |
| 14/04 – 10:15 | 🐛 Fix: Sơ đồ UC Nghiệp vụ – Loại bỏ Business Worker (Thủ kho, NV MH, KTK, TrK) khỏi Actor, chỉ giữ Business Actor (NCC, BPYC, BGĐ) |
| 14/04 – 10:16 | 🐛 Fix: Sequence Diagrams NV01, 02, 04, 05, 07 – Sửa lỗi Mermaid `deactivate inactive participant` (di chuyển deactivate ra sau block alt/end) |
| 14/04 – 10:35 | 📝 Cập nhật `.agent/rules/ibm_rose_notation.md` – Ghi rõ Rose KHÔNG hỗ trợ Interaction Fragments (alt/opt/loop/ref), bổ sung bảng thay thế bằng guard conditions |
| 14/04 – 10:36 | 📝 Tạo `.agent/skills/plantuml_best_practices.md` – Hướng dẫn PlantUML cho Sequence, Activity, UC, Class Diagram |
| 14/04 – 10:38 | 🔄 Chuyển đổi toàn bộ 7 Sequence Diagrams NV từ Mermaid → **PlantUML** |
| 14/04 – 10:40 | ✅ Sơ đồ lớp mức phân tích (17 Entity Classes, PlantUML) + Ma trận truy vết UC→Class + Hướng dẫn Rose |
| 14/04 – 10:40 | 🎉 **CHƯƠNG 2 HOÀN THÀNH 100%!** |
| 14/04 – 11:15 | 🐛 Fix: Bỏ toàn bộ dividers/separators (`== ... ==`) khỏi 7 Sequence Diagrams NV – IBM Rose không hỗ trợ. Chỉ còn guard conditions thuần tuý trên messages |
| 14/04 – 11:15 | 📝 Cập nhật `.agent/skills/plantuml_best_practices.md` – Ghi rõ KHÔNG dùng dividers |
| 14/04 – 17:23 | 📚 Đọc giáo trình `Bai giang TH PTTK HT_14DHTH.pdf` (63 trang) → Tạo `.agent/skills/giao_trinh_pttkht.md` tổng hợp kiến thức |
| 14/04 – 17:26 | ✅ Bổ sung **Business Entity** (`<<Business Entity>>`) vào 7 Sequence Diagrams NV: Phiếu NK/XK, Thẻ kho, BB chênh lệch, BB kiểm kê, Báo cáo kho, Sổ Danh mục |
| 14/04 – 17:36 | 🔄 Chuyển đổi 7 Activity Diagrams Mermaid → **PlantUML** (Swimlane `\|Tên\|` + Business Entity `<<Business Entity>>` trong action text + fork/join cho NV07) |
