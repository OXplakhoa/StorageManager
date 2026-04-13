# Sơ đồ Hoạt động – UC_NV01: Nhập kho hàng hóa

## Mô tả
Sơ đồ hoạt động dưới đây mô tả toàn bộ quy trình nghiệp vụ nhập kho hàng hóa, từ lúc Nhà cung cấp giao hàng đến khi hàng được xếp vào kho và cập nhật tồn kho. Các swimlane thể hiện rõ trách nhiệm của từng tác nhân trong từng bước.

```mermaid
flowchart TD
    Start(["⬤ Bắt đầu"])
    
    Start --> A1["NV Mua hàng:<br/>Tiếp nhận hàng hóa<br/>+ Hóa đơn từ NCC"]
    A1 --> A2["NV Mua hàng:<br/>Kiểm tra đối chiếu<br/>SL, chủng loại<br/>theo hóa đơn"]
    A2 --> D1{"Hàng hóa<br/>đúng & đủ?"}
    
    D1 -->|"❌ Không<br/>(Lỗi/Thiếu)"| E1["NV Mua hàng:<br/>Tách riêng hàng lỗi/thiếu"]
    E1 --> E2["NV Mua hàng:<br/>Lập Biên bản chênh lệch"]
    E2 --> E3["NV Mua hàng:<br/>Yêu cầu NCC ký xác nhận<br/>biên bản"]
    E3 --> E4["NV Mua hàng:<br/>Trả hàng lỗi cho NCC"]
    E4 --> D2{"Còn hàng<br/>hợp lệ?"}
    D2 -->|"❌ Không"| End1(["⬤ Kết thúc<br/>(Từ chối toàn bộ)"])
    D2 -->|"✅ Có"| A3
    
    D1 -->|"✅ Đúng & Đủ"| A3["NV Mua hàng:<br/>Bàn giao hàng hợp lệ<br/>cho Thủ kho"]
    A3 --> A4["Thủ kho:<br/>Kiểm tra lại lần cuối<br/>(≪include≫ UC_NV03)"]
    A4 --> A5["Thủ kho:<br/>Lập Phiếu nhập kho<br/>(Số phiếu, ngày, NCC,<br/>chi tiết hàng, SL, đơn giá)"]
    A5 --> A6["Thủ kho:<br/>Trình phiếu nhập<br/>lên Trưởng kho"]
    A6 --> A7["Trưởng kho:<br/>Đối chiếu phiếu<br/>với hóa đơn gốc"]
    A7 --> D3{"Phê duyệt?"}
    
    D3 -->|"❌ Từ chối"| A8["Trưởng kho:<br/>Ghi lý do từ chối<br/>→ Trả phiếu về Thủ kho"]
    A8 --> A5
    
    D3 -->|"✅ Duyệt"| A9["Trưởng kho:<br/>Ký duyệt phiếu nhập kho"]
    A9 --> A10["Thủ kho:<br/>Sắp xếp hàng hóa<br/>vào đúng vị trí trong kho"]
    A10 --> A11["Thủ kho:<br/>Cập nhật số liệu<br/>Thẻ kho / Sổ tồn kho"]
    A11 --> A12["Thủ kho:<br/>Lưu trữ hồ sơ<br/>(Phiếu NK + Hóa đơn)"]
    A12 --> End2(["⬤ Kết thúc"])

    %% Styling
    style Start fill:#333,color:#fff
    style End1 fill:#dc3545,color:#fff
    style End2 fill:#333,color:#fff
    style D1 fill:#ffc107,color:#333
    style D2 fill:#ffc107,color:#333
    style D3 fill:#ffc107,color:#333
    style E1 fill:#f8d7da,color:#721c24
    style E2 fill:#f8d7da,color:#721c24
    style E3 fill:#f8d7da,color:#721c24
    style E4 fill:#f8d7da,color:#721c24
    style A9 fill:#d4edda,color:#155724
```

## Giải thích luồng

### Luồng chính (Main Flow)
Quá trình bắt đầu khi **Nhân viên mua hàng** tiếp nhận hàng hóa cùng hóa đơn từ Nhà cung cấp. Sau khi kiểm tra đối chiếu thành công (hàng đúng chủng loại, đủ số lượng), nhân viên bàn giao cho **Thủ kho**. Thủ kho kiểm tra lần cuối (<<include>> UC_NV03), lập Phiếu nhập kho và trình **Trưởng kho** phê duyệt. Sau khi được duyệt, hàng được xếp vào kho và số liệu tồn kho được cập nhật.

### Luồng ngoại lệ (<<extend>> UC_NV04 – Xử lý chênh lệch)
Nếu phát hiện hàng lỗi hoặc thiếu, NV mua hàng tách riêng hàng lỗi, lập Biên bản chênh lệch, yêu cầu NCC ký xác nhận và trả hàng lỗi. Nếu còn phần hàng hợp lệ, quy trình tiếp tục với phần hàng đó. Nếu toàn bộ lô hàng bị từ chối, quy trình kết thúc.
