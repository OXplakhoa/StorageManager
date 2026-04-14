# Sơ đồ Use Case Hệ thống – HTTT Quản lý Kho hàng

## Mô tả tổng quan

Sơ đồ Use Case hệ thống mô tả các **chức năng mà phần mềm phải cung cấp** để hỗ trợ và tự động hóa các quy trình nghiệp vụ đã phân tích ở mục 2.2. Khác với Use Case nghiệp vụ (miêu tả hoạt động thực tế của con người), Use Case hệ thống tập trung vào **tương tác giữa người dùng (Actor) và phần mềm (System)**.

### Tác nhân hệ thống (System Actors)

| Actor | Miêu tả | Suy ra từ Actor nghiệp vụ |
|---|---|---|
| Thủ kho | Người trực tiếp thao tác trên hệ thống để lập phiếu nhập/xuất, kiểm kê, cập nhật tồn | Thủ kho (NV) |
| Trưởng kho | Người phê duyệt phiếu, xem báo cáo, lập kế hoạch kiểm kê, xem dự báo AI | Trưởng kho / Quản lý (NV) |
| Kế toán kho | Quản lý danh mục NCC/Hàng hóa, lập báo cáo NXT, tra cứu lịch sử | Kế toán kho (NV) |
| Bộ phận yêu cầu | Lập phiếu đề nghị xuất kho trên hệ thống | Bộ phận yêu cầu KD/SX (NV) |
| Ban Giám đốc | Xem báo cáo tổng hợp, xem dự báo AI | Ban Giám đốc (NV) |

> **Lưu ý:** "Nhà cung cấp" không phải là Actor hệ thống vì NCC không trực tiếp thao tác trên phần mềm. Thông tin NCC được nhập bởi Kế toán kho.

### Ma trận Truy vết (Traceability Matrix): UC Nghiệp vụ → UC Hệ thống

| UC Nghiệp vụ | UC Hệ thống được suy ra |
|---|---|
| UC_NV06 – Quản lý danh mục cơ sở | UC_HT02, UC_HT03 |
| UC_NV01 – Nhập kho hàng hóa | UC_HT04, UC_HT05, UC_HT09 |
| UC_NV02 – Xuất kho hàng hóa | UC_HT06, UC_HT07, UC_HT08, UC_HT09 |
| UC_NV03 – Kiểm tra hàng hóa | UC_HT09 (tự động đối chiếu) |
| UC_NV04 – Xử lý chênh lệch | UC_HT10 |
| UC_NV07 – Kiểm kê hàng hóa | UC_HT11, UC_HT12 |
| UC_NV05 – Lập báo cáo kho | UC_HT13, UC_HT14 |
| Yêu cầu nền tảng hệ thống | UC_HT01, UC_HT15 |
| Tính năng nâng cao (AI) | UC_HT16, UC_HT17 |

---

## Sơ đồ Use Case Hệ thống

```plantuml
@startuml
left to right direction
skinparam usecase {
  BackgroundColor White
  BorderColor Black
  ArrowColor Black
}
skinparam actor {
  BorderColor Black
}
skinparam rectangle {
  BorderColor #4a6fa5
  BackgroundColor #f0f4ff
}

' ===== TAC NHAN HE THONG (BEN TRAI) =====
actor "Thu kho" as TK
actor "Ke toan kho" as KTK
actor "Bo phan\nyeu cau" as BPYC

' ===== TAC NHAN HE THONG (BEN PHAI) =====
actor "Truong kho" as TrK
actor "Ban Giam doc" as BGD

' ===== RANH GIOI HE THONG =====
rectangle "HTTT Quan ly Kho hang\nCong ty Minh Phat" {

  ' --- Nen tang ---
  usecase "UC_HT01\nDang nhap /\nPhan quyen" as UC01

  ' --- Quan ly Danh muc ---
  usecase "UC_HT02\nQuan ly danh muc\nNha cung cap" as UC02
  usecase "UC_HT03\nQuan ly danh muc\nHang hoa" as UC03

  ' --- Nghiep vu Nhap kho ---
  usecase "UC_HT04\nLap Phieu\nnhap kho" as UC04
  usecase "UC_HT05\nPhe duyet Phieu\nnhap kho" as UC05
  usecase "UC_HT09\nKiem tra hang hoa\n(tu dong doi chieu)" as UC09
  usecase "UC_HT10\nLap Bien ban\nchenh lech" as UC10

  ' --- Nghiep vu Xuat kho ---
  usecase "UC_HT06\nLap Phieu de nghi\nxuat kho" as UC06
  usecase "UC_HT07\nLap Phieu\nxuat kho" as UC07
  usecase "UC_HT08\nPhe duyet Phieu\nxuat kho" as UC08

  ' --- Kiem ke ---
  usecase "UC_HT11\nLap ke hoach\nkiem ke" as UC11
  usecase "UC_HT12\nThuc hien kiem ke\nva Lap Bien ban" as UC12

  ' --- Bao cao va Tra cuu ---
  usecase "UC_HT13\nXem Bao cao\nNhap-Xuat-Ton" as UC13
  usecase "UC_HT14\nXem Bao cao hang\nduoi muc toi thieu" as UC14
  usecase "UC_HT15\nTra cuu lich su\nNhap / Xuat" as UC15

  ' --- Tinh nang AI ---
  usecase "UC_HT16\nDu bao nhu cau\ntieu thu (AI)" as UC16
  usecase "UC_HT17\nCanh bao ton kho\nthong minh (AI)" as UC17
}

' ===== QUAN HE ACTOR - USE CASE =====

' -- Dang nhap (tat ca) --
TK -- UC01
TrK -- UC01
KTK -- UC01
BPYC -- UC01
BGD -- UC01

' -- Danh muc --
KTK -- UC02
KTK -- UC03
TK -- UC03

' -- Nhap kho --
TK -- UC04
TK -- UC09
TK -- UC10
TrK -- UC05

' -- Xuat kho --
BPYC -- UC06
TK -- UC07
TrK -- UC08

' -- Kiem ke --
TrK -- UC11
TK -- UC12
KTK -- UC12

' -- Bao cao --
KTK -- UC13
KTK -- UC14
TrK -- UC13
TrK -- UC14
TK -- UC15
KTK -- UC15
BGD -- UC13

' -- AI --
TrK -- UC16
TrK -- UC17
TK -- UC17
BGD -- UC16

' ===== QUAN HE INCLUDE / EXTEND =====
UC04 ..> UC09 : <<include>>
UC07 ..> UC09 : <<include>>
UC10 ..> UC04 : <<extend>>
note on link : [Phat hien chenh lech]

@enduml
```

---

## 📐 Hướng dẫn vẽ lại trong IBM Rational Rose

### Actors (Hình người – Stick figure)
Đặt **bên trái** hoặc **bên phải** System Boundary tùy layout:
- Trái: Thủ kho, Kế toán kho, Bộ phận yêu cầu
- Phải: Trưởng kho, Ban Giám đốc

### System Boundary
- Vẽ **1 hình chữ nhật lớn** bao quanh tất cả 17 UC
- Tiêu đề: `HTTT Quản lý Kho hàng – Công ty Minh Phát`

### Use Cases (Hình Ellipse)
17 UC – mỗi UC là 1 Ellipse nằm trong System Boundary. Nhóm theo chức năng (không bắt buộc trong Rose nhưng giúp dễ đọc).

### Association (Đường thẳng liền nét)
| Actor | UC liên kết |
|---|---|
| Thủ kho | UC01, UC03, UC04, UC07, UC09, UC10, UC12, UC15, UC17 |
| Trưởng kho | UC01, UC05, UC08, UC11, UC13, UC14, UC16, UC17 |
| Kế toán kho | UC01, UC02, UC03, UC12, UC13, UC14, UC15 |
| Bộ phận yêu cầu | UC01, UC06 |
| Ban Giám đốc | UC01, UC13, UC16 |

### Quan hệ Include (Mũi tên đứt nét → từ UC chính → UC phụ)
- UC_HT04 (Lập Phiếu NK) **→** `<<include>>` **→** UC_HT09 (Kiểm tra HH)
- UC_HT07 (Lập Phiếu XK) **→** `<<include>>` **→** UC_HT09 (Kiểm tra HH)

### Quan hệ Extend (Mũi tên đứt nét → từ UC mở rộng → UC chính)
- UC_HT10 (Lập BB chênh lệch) **→** `<<extend>>` **→** UC_HT04 (Lập Phiếu NK)
- Guard condition: `[Phát hiện chênh lệch SL hoặc CL]`

> **⚠️ Chiều mũi tên Rose:**  
> - `<<include>>`: UC chính → UC phụ  
> - `<<extend>>`: UC mở rộng → UC chính

### Tổng hợp 17 Use Case Hệ thống

| Mã | Tên Use Case | Nhóm chức năng |
|---|---|---|
| UC_HT01 | Đăng nhập / Phân quyền | Nền tảng |
| UC_HT02 | Quản lý danh mục Nhà cung cấp | Danh mục |
| UC_HT03 | Quản lý danh mục Hàng hóa | Danh mục |
| UC_HT04 | Lập Phiếu nhập kho | Nhập kho |
| UC_HT05 | Phê duyệt Phiếu nhập kho | Nhập kho |
| UC_HT06 | Lập Phiếu đề nghị xuất kho | Xuất kho |
| UC_HT07 | Lập Phiếu xuất kho | Xuất kho |
| UC_HT08 | Phê duyệt Phiếu xuất kho | Xuất kho |
| UC_HT09 | Kiểm tra hàng hóa (tự động đối chiếu) | Nhập/Xuất kho |
| UC_HT10 | Lập Biên bản chênh lệch | Nhập kho |
| UC_HT11 | Lập kế hoạch kiểm kê | Kiểm kê |
| UC_HT12 | Thực hiện kiểm kê và Lập Biên bản | Kiểm kê |
| UC_HT13 | Xem Báo cáo Nhập–Xuất–Tồn | Báo cáo |
| UC_HT14 | Xem Báo cáo hàng dưới mức tối thiểu | Báo cáo |
| UC_HT15 | Tra cứu lịch sử Nhập / Xuất | Tra cứu |
| UC_HT16 | Dự báo nhu cầu tiêu thụ (AI) | AI |
| UC_HT17 | Cảnh báo tồn kho thông minh (AI) | AI |
