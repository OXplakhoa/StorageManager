# Rule: Ký hiệu UML chuẩn IBM Rational Rose

Tất cả sơ đồ Mermaid trong project này chỉ là **bản nháp trực quan hóa** (visualization draft). Sản phẩm cuối cùng sẽ được vẽ lại trên **IBM Rational Rose** theo đúng ký hiệu UML 2.x. Do đó, mọi sơ đồ phải đảm bảo ghi chú đầy đủ thông tin cần thiết để người dùng vẽ lại trong Rose mà không cần đoán.

---

## 1. Activity Diagram – Ký hiệu Rose

### Các thành phần BẮT BUỘC:
| Ký hiệu | Tên UML | Mô tả | Hình dáng trong Rose |
|---|---|---|---|
| ⬤ (Initial Node) | Nút bắt đầu | Điểm khởi đầu quy trình | Hình tròn đặc (filled circle) |
| ◉ (Final Node) | Nút kết thúc | Điểm kết thúc quy trình | Hình tròn đặc bên trong vòng tròn (bull's-eye) |
| ▭ (Action State) | Trạng thái hành động | Một hành động cụ thể | Hình chữ nhật bo góc (rounded rectangle) |
| ◇ (Decision Node) | Nút quyết định | Rẽ nhánh có điều kiện | Hình thoi (diamond) + [Guard Condition] trên mỗi nhánh |
| ◇ (Merge Node) | Nút hợp nhất | Gộp các nhánh lại | Hình thoi (diamond) – giống Decision nhưng nhiều input, 1 output |
| ▬ (Fork Bar) | Thanh phân nhánh | Chia luồng song song | Thanh ngang dày (horizontal bar) |
| ▬ (Join Bar) | Thanh hợp nhất | Gộp luồng song song | Thanh ngang dày (horizontal bar) |
| → (Transition) | Chuyển tiếp | Luồng đi từ action này sang action khác | Mũi tên liền nét (solid arrow) |
| ║ (Swimlane) | Làn bơi | Phân vùng trách nhiệm theo Actor | Cột dọc (vertical partition) có tiêu đề tên Actor |

### Quy tắc Swimlane trong Rose:
1. **Mỗi Actor/Role = 1 Swimlane (cột dọc).**
2. **Tên swimlane = Tên tác nhân** (ví dụ: "NV Mua hàng", "Thủ kho", "Trưởng kho").
3. **Mỗi Action State phải nằm HOÀN TOÀN trong 1 swimlane duy nhất** – đại diện cho người chịu trách nhiệm thực hiện hành động đó.
4. **Mũi tên (Transition) có thể bắt chéo qua các swimlane** – thể hiện sự bàn giao công việc giữa các tác nhân.
5. **Decision Node (hình thoi)** nằm trong swimlane của người ra quyết định.
6. **Guard Condition** (điều kiện rẽ nhánh) viết trong ngoặc vuông `[Điều kiện]` trên mũi tên.

### Áp dụng cho Mermaid:
Vì Mermaid `flowchart` không hỗ trợ swimlane, mỗi Activity Diagram phải kèm theo:
- **Bảng Swimlane Mapping**: Liệt kê mỗi Action thuộc Swimlane nào.
- **Ghi chú trong tên node**: Prefix tên Actor trước mỗi hành động (ví dụ: `"Thủ kho: Lập phiếu nhập kho"`).

---

## 2. Sequence Diagram – Ký hiệu Rose

| Ký hiệu | Tên UML | Mô tả |
|---|---|---|
| 👤 (Actor) | Tác nhân | Hình người (stick figure) – đặt ở đầu lifeline |
| ▯ (Object/Participant) | Đối tượng | Hình chữ nhật – đặt ở đầu lifeline |
| | (Lifeline) | Đường sống | Đường đứt nét dọc từ Actor/Object xuống dưới |
| ▮ (Activation Bar) | Thanh kích hoạt | Hình chữ nhật mỏng trên lifeline – thể hiện đối tượng đang xử lý |
| →  (Synchronous Message) | Thông điệp đồng bộ | Mũi tên liền nét, đầu tam giác đặc (filled arrowhead) |
| ⇢ (Asynchronous Message) | Thông điệp bất đồng bộ | Mũi tên liền nét, đầu mũi tên hở (open arrowhead) |
| ⇠ (Return Message) | Thông điệp trả về | Mũi tên đứt nét (dashed arrow) |
| [alt] | Combined Fragment – Alt | Rẽ nhánh (if/else) – có đường kẻ ngang phân cách các nhánh |
| [opt] | Combined Fragment – Opt | Tùy chọn (if only, không có else) |
| [loop] | Combined Fragment – Loop | Vòng lặp |
| [ref] | Interaction Reference | Tham chiếu đến sơ đồ tuần tự khác (dùng cho <<include>>) |

### Quy tắc quan trọng trong Rose:
1. **Message = Hành động**: Tên message nên là **động từ + tân ngữ** (ví dụ: "Lập phiếu nhập kho", "Ký duyệt phiếu").
2. **Dùng `alt` cho if/else**, `opt` cho if-only, `loop` cho vòng lặp.
3. **`<<include>>`**: Dùng `ref` fragment trỏ đến UC_NV03 thay vì vẽ lại toàn bộ.
4. **`<<extend>>`**: Dùng `opt` fragment với guard condition `[Hàng lỗi/thiếu]`.
5. **Self-message**: Mũi tên quay lại chính lifeline đó (ví dụ: "Đối chiếu số liệu").

---

## 3. Use Case Diagram – Ký hiệu Rose

| Ký hiệu | Tên UML | Mô tả |
|---|---|---|
| 👤 (Actor) | Tác nhân | Hình người (stick figure) |
| ⬭ (Use Case) | Ca sử dụng | Hình ellipse – chứa tên UC |
| ▯ (System Boundary) | Ranh giới hệ thống | Hình chữ nhật bao quanh tất cả UC – có tiêu đề tên hệ thống |
| — (Association) | Liên kết | Đường thẳng liền nét nối Actor với UC |
| --▷ `<<include>>` | Include | Mũi tên đứt nét từ UC chính → UC phụ, ghi `<<include>>` trên mũi tên |
| --▷ `<<extend>>` | Extend | Mũi tên đứt nét từ UC mở rộng → UC chính, ghi `<<extend>>` trên mũi tên |
| --▷ Generalization | Tổng quát hóa | Mũi tên liền nét với tam giác rỗng (giữa các Actor nếu có kế thừa) |

### Lưu ý chiều mũi tên trong Rose:
- **`<<include>>`**: Mũi tên đi **TỪ UC chính → UC được include** (UC_NV01 → UC_NV03).
- **`<<extend>>`**: Mũi tên đi **TỪ UC mở rộng → UC chính** (UC_NV04 → UC_NV01). Guard condition `[Hàng lỗi]` đặt gần mũi tên.

---

## 4. Class Diagram – Ký hiệu Rose

| Ký hiệu | Tên UML | Mô tả |
|---|---|---|
| ▯ (Class) | Lớp | Hình chữ nhật 3 ngăn: Tên lớp / Thuộc tính / Phương thức |
| — (Association) | Liên kết | Đường thẳng liền nét + Multiplicity (1..*, 0..1, v.v.) |
| ◇— (Aggregation) | Kết tập | Hình thoi rỗng ở đầu "tổng thể" (whole) |
| ◆— (Composition) | Hợp thành | Hình thoi đặc ở đầu "tổng thể" (whole) – phần tử phụ thuộc vòng đời |
| --▷ (Generalization) | Tổng quát hóa | Mũi tên liền nét + tam giác rỗng → lớp cha |
| --▷ (Dependency) | Phụ thuộc | Mũi tên đứt nét |

### Access Modifiers (Rose):
| Ký hiệu | Nghĩa |
|---|---|
| `+` | Public |
| `-` | Private |
| `#` | Protected |
| `~` | Package |

### Quy tắc:
- **Mức phân tích**: Chủ yếu thể hiện Entity Classes, quan hệ Association/Composition + Multiplicity. Chưa cần chi tiết Methods.
- **Mức thiết kế**: Đầy đủ 3 loại lớp (Boundary/Control/Entity), Access Modifiers, Methods với tham số + return type.
