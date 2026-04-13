# Sơ đồ Hoạt động – UC_NV04: Xử lý chênh lệch

## Mô tả
Quy trình xử lý ngoại lệ (<<extend>>) chỉ được kích hoạt khi UC_NV01 (Nhập kho) phát hiện hàng hóa bị lỗi, thiếu hụt hoặc sai quy cách.

```mermaid
flowchart TD
    Start(["⬤ Bắt đầu<br/>(Kích hoạt từ UC_NV01<br/>khi phát hiện lỗi)"])

    Start --> D1["NV Mua hàng:<br/>Tách riêng hàng hóa<br/>bị lỗi / thiếu hụt"]
    D1 --> D2["NV Mua hàng:<br/>Ghi nhận chính xác<br/>số lượng sai lệch<br/>+ mô tả lỗi chi tiết"]
    D2 --> D3["NV Mua hàng:<br/>Lập Biên bản chênh lệch<br/>(Nguyên nhân, SL, mô tả)"]
    D3 --> D4["NV Mua hàng:<br/>Thông báo tình trạng<br/>cho đại diện NCC"]
    D4 --> D5["NV Mua hàng:<br/>Yêu cầu đại diện NCC<br/>ký xác nhận<br/>Biên bản chênh lệch"]
    D5 --> D6{"NCC đồng ý<br/>ký xác nhận?"}

    D6 -->|"✅ Đồng ý"| D7["NCC:<br/>Ký xác nhận vào<br/>Biên bản chênh lệch"]
    D7 --> D8["NV Mua hàng:<br/>Bàn giao hàng lỗi<br/>cho NCC mang về"]
    D8 --> D9["NV Mua hàng:<br/>Lưu trữ Biên bản<br/>(làm cơ sở thanh toán)"]
    D9 --> End1(["⬤ Kết thúc<br/>→ Quay lại UC_NV01<br/>với phần hàng hợp lệ"])

    D6 -->|"❌ Không đồng ý"| D10["NV Mua hàng:<br/>Báo cáo lên<br/>Trưởng kho / Quản lý"]
    D10 --> D11["Trưởng kho:<br/>Liên hệ trực tiếp NCC<br/>để thương lượng"]
    D11 --> D12{"Thương lượng<br/>thành công?"}
    D12 -->|"✅ Thành công"| D7
    D12 -->|"❌ Thất bại"| D13["Trưởng kho:<br/>Lập hồ sơ tranh chấp<br/>→ Chuyển Ban pháp chế"]
    D13 --> End2(["⬤ Kết thúc<br/>(Tranh chấp)"])

    %% Styling
    style Start fill:#333,color:#fff
    style End1 fill:#28a745,color:#fff
    style End2 fill:#dc3545,color:#fff
    style D6 fill:#ffc107,color:#333
    style D12 fill:#ffc107,color:#333
    style D7 fill:#d4edda,color:#155724
```

## Giải thích luồng
### Luồng chính
NV mua hàng tách hàng lỗi, lập Biên bản chênh lệch, yêu cầu NCC ký xác nhận → Trả hàng lỗi → Lưu biên bản → Quay lại UC_NV01.

### Luồng thay thế
NCC không đồng ý ký → Báo cáo Trưởng kho → Thương lượng trực tiếp. Nếu thành công → ký biên bản. Nếu thất bại → lập hồ sơ tranh chấp.
