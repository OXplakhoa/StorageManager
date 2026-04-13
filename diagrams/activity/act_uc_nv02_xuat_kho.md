# Sơ đồ Hoạt động – UC_NV02: Xuất kho hàng hóa

## Mô tả
Sơ đồ hoạt động dưới đây mô tả quy trình nghiệp vụ xuất kho hàng hóa, từ khi Bộ phận yêu cầu lập phiếu đề nghị đến khi hàng được giao và tồn kho được trừ đi.

```mermaid
flowchart TD
    Start(["⬤ Bắt đầu"])

    Start --> B1["Bộ phận yêu cầu:<br/>Lập Phiếu đề nghị xuất kho<br/>(Mã hàng, SL, mục đích)"]
    B1 --> B2["Bộ phận yêu cầu:<br/>Trình phiếu đề nghị<br/>lên Trưởng kho"]
    B2 --> D1{"Trưởng kho:<br/>Phê duyệt<br/>phiếu đề nghị?"}
    
    D1 -->|"❌ Từ chối"| B3["Trưởng kho:<br/>Ghi lý do từ chối<br/>→ Trả về Bộ phận YC"]
    B3 --> End1(["⬤ Kết thúc<br/>(Từ chối yêu cầu)"])

    D1 -->|"✅ Duyệt"| B4["Thủ kho:<br/>Tiếp nhận phiếu đề nghị<br/>đã được duyệt"]
    B4 --> B5["Thủ kho:<br/>Kiểm tra số lượng<br/>tồn kho hiện tại<br/>(≪include≫ UC_NV03)"]
    B5 --> D2{"Đủ hàng<br/>trong kho?"}
    
    D2 -->|"❌ Không đủ"| C1["Thủ kho:<br/>Thông báo cho<br/>Bộ phận yêu cầu"]
    C1 --> C2["Thủ kho:<br/>Chuyển thông tin<br/>sang NV Mua hàng<br/>để đặt bổ sung"]
    C2 --> End2(["⬤ Kết thúc<br/>(Chờ nhập bổ sung)"])
    
    D2 -->|"✅ Đủ hàng"| B6["Thủ kho:<br/>Lập Phiếu xuất kho<br/>(Số phiếu, ngày, BP nhận,<br/>chi tiết hàng, SL xuất)"]
    B6 --> B7["Thủ kho:<br/>Trình phiếu xuất kho<br/>lên Trưởng kho"]
    B7 --> D3{"Trưởng kho:<br/>Phê duyệt<br/>phiếu xuất?"}
    
    D3 -->|"❌ Từ chối"| B8["Trưởng kho:<br/>Ghi lý do → Trả phiếu"]
    B8 --> B6
    
    D3 -->|"✅ Duyệt"| B9["Trưởng kho:<br/>Ký duyệt phiếu xuất kho"]
    B9 --> B10["Thủ kho:<br/>Soạn hàng theo phiếu"]
    B10 --> B11["Thủ kho:<br/>Bàn giao hàng cho<br/>đại diện Bộ phận YC"]
    B11 --> B12["Bộ phận yêu cầu:<br/>Kiểm nhận hàng<br/>+ Ký xác nhận"]
    B12 --> B13["Thủ kho:<br/>Cập nhật trừ tồn kho<br/>trên Thẻ kho / Sổ tồn"]
    B13 --> B14["Thủ kho:<br/>Lưu trữ hồ sơ<br/>(Phiếu XK + Phiếu ĐN)"]
    B14 --> End3(["⬤ Kết thúc"])

    %% Styling
    style Start fill:#333,color:#fff
    style End1 fill:#dc3545,color:#fff
    style End2 fill:#ffc107,color:#333
    style End3 fill:#333,color:#fff
    style D1 fill:#ffc107,color:#333
    style D2 fill:#ffc107,color:#333
    style D3 fill:#ffc107,color:#333
    style B9 fill:#d4edda,color:#155724
    style C1 fill:#f8d7da,color:#721c24
    style C2 fill:#f8d7da,color:#721c24
```

## Giải thích luồng

### Luồng chính (Main Flow)
**Bộ phận yêu cầu** (KD/SX) lập Phiếu đề nghị xuất kho và trình **Trưởng kho** duyệt. Sau khi được duyệt, **Thủ kho** tiếp nhận phiếu, kiểm tra tồn kho (<<include>> UC_NV03). Nếu đủ hàng, Thủ kho lập Phiếu xuất kho, trình Trưởng kho ký duyệt, soạn hàng và bàn giao. Bộ phận yêu cầu ký nhận, Thủ kho cập nhật trừ tồn kho.

### Luồng thay thế
- **Không đủ hàng:** Thủ kho thông báo Bộ phận yêu cầu và chuyển thông tin sang NV mua hàng để đặt bổ sung từ NCC. Quy trình tạm dừng, chờ nhập bổ sung.
- **Trưởng kho từ chối phiếu đề nghị:** Ghi lý do, trả về Bộ phận yêu cầu, quy trình kết thúc.
