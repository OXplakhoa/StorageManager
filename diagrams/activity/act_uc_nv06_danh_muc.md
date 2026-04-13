# Sơ đồ Hoạt động – UC_NV06: Quản lý danh mục cơ sở

## Mô tả
Quy trình thiết lập, duy trì và cập nhật các thông tin nền tảng (danh mục Nhà cung cấp và danh mục Hàng hóa) phục vụ cho toàn bộ hoạt động nghiệp vụ kho hàng.

```mermaid
flowchart TD
    Start(["⬤ Bắt đầu"])

    Start --> F1["Kế toán kho / Thủ kho:<br/>Nhận yêu cầu cập nhật<br/>danh mục (từ thực tế<br/>hoặc chỉ đạo Trưởng kho)"]
    F1 --> D1{"Loại danh mục<br/>cần cập nhật?"}

    D1 -->|"🏭 Nhà cung cấp"| NCC1["Thu thập thông tin NCC:<br/>Mã NCC, Tên, Địa chỉ,<br/>SĐT, Email, MST"]
    D1 -->|"📦 Hàng hóa"| HH1["Thu thập thông tin HH:<br/>Mã hàng, Tên, ĐVT,<br/>Quy cách, Nhóm hàng,<br/>Hạn mức tồn tối thiểu"]

    NCC1 --> D2{"NCC đã tồn tại<br/>trong danh mục?"}
    HH1 --> D3{"Hàng hóa đã<br/>tồn tại trong<br/>danh mục?"}

    D2 -->|"❌ Chưa có"| NCC2["Thêm mới NCC<br/>vào danh mục"]
    D2 -->|"✅ Đã có"| NCC3["Cập nhật / Sửa đổi<br/>thông tin NCC"]

    D3 -->|"❌ Chưa có"| HH2["Thêm mới Hàng hóa<br/>vào danh mục"]
    D3 -->|"✅ Đã có"| D4{"Hàng hóa<br/>còn kinh doanh?"}
    D4 -->|"✅ Còn KD"| HH3["Cập nhật / Sửa đổi<br/>thông tin Hàng hóa"]
    D4 -->|"❌ Ngừng KD"| HH4["Đánh dấu trạng thái<br/>'Ngừng hoạt động'<br/>(Không xóa vĩnh viễn)"]

    NCC2 --> V1["Kiểm tra tính chính xác<br/>& không trùng lặp"]
    NCC3 --> V1
    HH2 --> V1
    HH3 --> V1
    HH4 --> V1

    V1 --> F2["Lưu trữ danh mục<br/>đã cập nhật"]
    F2 --> F3["Thông báo các bộ phận<br/>liên quan<br/>(Thủ kho, NV mua hàng)"]
    F3 --> End(["⬤ Kết thúc"])

    %% Styling
    style Start fill:#333,color:#fff
    style End fill:#333,color:#fff
    style D1 fill:#17a2b8,color:#fff
    style D2 fill:#ffc107,color:#333
    style D3 fill:#ffc107,color:#333
    style D4 fill:#ffc107,color:#333
    style HH4 fill:#f8d7da,color:#721c24
    style NCC2 fill:#d4edda,color:#155724
    style HH2 fill:#d4edda,color:#155724
```

## Giải thích luồng
### Luồng chính
Tác nhân nhận yêu cầu → Xác định loại danh mục (NCC hoặc Hàng hóa) → Thu thập thông tin → Kiểm tra tồn tại → Thêm mới hoặc Cập nhật → Kiểm tra chính xác → Lưu trữ → Thông báo.

### Luồng thay thế
- Hàng hóa ngừng kinh doanh → Đánh dấu "Ngừng hoạt động" thay vì xóa (bảo toàn lịch sử giao dịch).
- NCC ngừng hợp tác → Tương tự, đánh dấu trạng thái thay vì xóa.
