# Skill: Kiến thức từ Giáo trình TH PTTKHT (Bài giảng cô)

> **Nguồn:** `Bai giang TH PTTK HT_14DHTH.pdf` (63 trang)
> Khoa CNTT – Trường ĐH Công Thương TP.HCM

---

## CHƯƠNG 1-2: MÔ HÌNH HÓA NGHIỆP VỤ

### 1. Sơ đồ Use Case Nghiệp vụ
- **Business Actor** = hình người (stick figure) ở BÊN NGOÀI ranh giới → stereotype `<<Business Actor>>`
- **Business Use Case** = hình ellipse → stereotype `<<Business Use Case>>`
- **Quan hệ:**
  - Actor → UC: dùng `Unidirectional Association` (mũi tên 1 chiều, chiều mũi tên = vai trò chủ động)
  - UC → UC: dùng `Dependency` → chọn Stereotype `<<include>>` hoặc `<<extend>>`

### 2. Sơ đồ Hoạt động (Activity Diagram)
- Mỗi bước trong đặc tả UC → 1 Activity node
- Rẽ nhánh dòng sự kiện phụ → dùng **Decision** (hình thoi)
- Mỗi nhánh có **Guard Condition** (nhãn trên luồng)
- Guard Condition nhập vào trường **Guard Condition** trong cửa sổ Specification
- Kết thúc có thể có **nhiều End State**
- **Swimlane**: Ánh xạ với thừa tác viên (Business Worker), kéo activity vào đúng swimlane

### 3. Thừa tác viên & Thực thể (Activity Diagram nâng cao)
- **Thừa tác viên (Business Worker):** Người BÊN TRONG tổ chức thực hiện hoạt động
  - Tạo Actor → Stereotype = `<<Business Worker>>`
  - Ánh xạ vào **Swimlane** trong Activity Diagram
- **Thực thể (Business Entity):** Đối tượng dữ liệu (Sách, Hồ sơ, Phiếu...)
  - Tạo Class → Stereotype = `<<Business Entity>>`
  - Thêm **Object** vào sơ đồ hoạt động
  - Dùng **ObjectFlow** để kết nối Activity → Object (truy xuất/cập nhật dữ liệu)

### 4. Sơ đồ Tuần tự Nghiệp vụ (Sequence Diagram)
- Các thành phần trong thanh công cụ Rose:
  - **Object**: Đối tượng tham gia
  - **Object Message**: Thông điệp đồng bộ (mũi tên liền, đầu đặc)
  - **Message to Self**: Tự gửi thông điệp
  - **Return Message**: Phản hồi (mũi tên đứt nét)
  - **Destruction Marker**: Hủy đối tượng (dấu X)
- **KHÔNG CÓ Interaction Fragments** (alt, opt, loop, ref) trong Rose
- Rẽ nhánh bằng **Guard Condition** trên message: `[điều kiện] Tên thông điệp`
- Tạo Sequence Diagram: Chuột phải UC → Open Specification → Insert Sequence Diagram

### 5. Sơ đồ Cộng tác (Collaboration Diagram)
- **Sinh tự động từ Sequence Diagram:** Nhấn F5 hoặc Browse → Create Collaboration Diagram
- Giống Sequence nhưng nhấn mạnh **cấu trúc quan hệ** giữa các đối tượng thay vì thứ tự thời gian
- Thông điệp được đánh **số thứ tự** (1:, 2:, 1.1:, ...)

---

## CHƯƠNG 3: MÔ HÌNH HÓA CẤU TRÚC (Class Diagram)

### Sơ đồ Lớp mức Phân tích
- Xác định từ đặc tả UC → nhận diện Entity Classes
- **Lớp có 3 ngăn:** Tên | Thuộc tính | Phương thức
- **Thuộc tính:** `tên : kiểu dữ liệu` (ở mức phân tích có thể chưa có kiểu)
- **Quan hệ:**
  - `Association` (thẳng): quan hệ chung
  - `Aggregation` (hình thoi rỗng ◇): quan hệ "có" (phần-toàn thể, phần có thể tồn tại độc lập)
  - `Composition` (hình thoi đặc ◆): quan hệ "sở hữu" (phần không tồn tại được nếu không có toàn thể)
  - `Generalization` (mũi tên tam giác): kế thừa
- **Multiplicity (Bản số):** Double click vào liên kết → chọn bản số
  - `1`, `0..1`, `1..*`, `0..*`, `*`

---

## CHƯƠNG 4: THIẾT KẾ HỆ THỐNG

### 1. Thiết kế Lớp (Design Class Diagram)
- **Tinh chế từ sơ đồ lớp phân tích:**
  - Bổ sung kiểu dữ liệu cho thuộc tính
  - Bổ sung tham số + kiểu trả về cho phương thức
  - Thêm Access Modifiers:  `+` public, `-` private, `#` protected

### 2. Mô hình 3 tầng (3-Tier / 3-Layer)
- **Tầng Giao diện (Boundary):**
  - Stereotype = `<<Boundary>>` (trong Rose)
  - Tên lớp: `FormXxx`, `MayXxxGD`
  - Xử lý trao đổi với Actor
- **Tầng Nghiệp vụ (Entity):**
  - Stereotype = `<<Entity>>`
  - Các lớp thực thể chính (KhachHang, TaiKhoan, GiaoDich...)
  - Chứa logic nghiệp vụ
- **Tầng Truy cập Dữ liệu (Control/DB):**
  - Tên lớp: `XxxDB` (ví dụ: `NganHangDB`, `DausachDB`)
  - Phương thức CRUD: `docXxx()`, `capNhatXxx()`, `themXxx()`, `xoaXxx()`
  - Quan hệ **Aggregation** giữa tầng DB → tầng Nghiệp vụ
  - Có thể **gom nhiều lớp DB** thành 1 nếu ít phương thức
- **Lớp Điều khiển (Control):**
  - Stereotype = `<<Control>>`
  - Tên lớp: `DieuKhienXxx`
  - Dùng khi có nhiều lớp nghiệp vụ cần phối hợp (orchestration)

### 3. Hiện thực hóa Chức năng (Use Case Realization)
- Mỗi chức năng cần **ít nhất 2 sơ đồ:**
  1. **Sơ đồ lớp chi tiết**: Các lớp (3 tầng) tham gia thực hiện UC
  2. **Sơ đồ tuần tự thiết kế**: Tương tác giữa các lớp theo 3 tầng

### 4. Sequence Diagram mức Thiết kế (3 tầng)
- Actor → Boundary (Form/GD) → Control (điều khiển) → Entity (nghiệp vụ) → DB (truy cập DL)
- Return messages (đứt nét) trả ngược lại
- Ví dụ luồng "Thêm đầu sách":
  ```
  Actor → FormThemSach → Dausach → DausachDB
  ```
- Ví dụ luồng "Rút tiền ATM":
  ```
  Actor → MayATMGD → DieuKhienGiaoDich → KhachHang → TaiKhoan → GiaoDich → NganHangDB
  ```

---

## TỔNG HỢP: CÁC LOẠI SƠ ĐỒ THEO CHƯƠNG

| Chương | Sơ đồ | Mức độ |
|---|---|---|
| Chương 2 – MH Nghiệp vụ | UC Nghiệp vụ, Activity (+ Swimlane + Entity), Sequence NV, Collaboration NV | Phân tích |
| Chương 2 – MH Cấu trúc | Class Diagram mức Phân tích | Phân tích |
| Chương 3 – Thiết kế | Class Diagram mức Thiết kế (3 tầng), Class chi tiết cho UC, Sequence Thiết kế (3 tầng) | Thiết kế |
