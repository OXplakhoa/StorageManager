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

## 📐 Hướng dẫn vẽ lại trong IBM Rational Rose

### Swimlanes (Cột dọc)
| Swimlane | Tên Actor |
|---|---|
| Lane 1 | **Bộ phận yêu cầu (KD/SX)** |
| Lane 2 | **Trưởng kho** |
| Lane 3 | **Thủ kho** |
| Lane 4 | **NV Mua hàng** |

### Phân bổ Action States vào Swimlane

| Mã Node | Action State | Swimlane | Ký hiệu |
|---|---|---|---|
| Start | ⬤ Bắt đầu | Lane 1 | Initial Node (●) |
| B1 | Lập Phiếu đề nghị xuất kho | Lane 1 | Action State ▭ |
| B2 | Trình phiếu đề nghị lên Trưởng kho | Lane 1 → Lane 2 | ▭ (transition chéo) |
| D1 | [Phê duyệt phiếu đề nghị?] | Lane 2 | Decision ◇ |
| B3 | Ghi lý do từ chối → Trả về BP YC | Lane 2 | Action State ▭ |
| B4 | Tiếp nhận phiếu đề nghị đã duyệt | Lane 3 | Action State ▭ |
| B5 | Kiểm tra SL tồn kho (≪include≫ UC_NV03) | Lane 3 | Action State ▭ |
| D2 | [Đủ hàng trong kho?] | Lane 3 | Decision ◇ |
| C1 | Thông báo cho Bộ phận yêu cầu | Lane 3 | Action State ▭ |
| C2 | Chuyển thông tin sang NV Mua hàng | Lane 3 → Lane 4 | ▭ (transition chéo) |
| B6 | Lập Phiếu xuất kho | Lane 3 | Action State ▭ |
| B7 | Trình phiếu xuất kho lên Trưởng kho | Lane 3 → Lane 2 | ▭ (transition chéo) |
| D3 | [Phê duyệt phiếu xuất?] | Lane 2 | Decision ◇ |
| B8 | Ghi lý do → Trả phiếu | Lane 2 | Action State ▭ |
| B9 | Ký duyệt phiếu xuất kho | Lane 2 | Action State ▭ |
| B10 | Soạn hàng theo phiếu | Lane 3 | Action State ▭ |
| B11 | Bàn giao hàng cho đại diện BP YC | Lane 3 → Lane 1 | ▭ (transition chéo) |
| B12 | Kiểm nhận hàng + Ký xác nhận | Lane 1 | Action State ▭ |
| B13 | Cập nhật trừ tồn kho | Lane 3 | Action State ▭ |
| B14 | Lưu trữ hồ sơ (Phiếu XK + ĐN) | Lane 3 | Action State ▭ |
| End1 | ◉ Kết thúc (Từ chối) | Lane 2 | Final Node (◉) |
| End2 | ◉ Kết thúc (Chờ bổ sung) | Lane 4 | Final Node (◉) |
| End3 | ◉ Kết thúc | Lane 3 | Final Node (◉) |

### Guard Conditions
- D1 → B4: `[Duyệt]`
- D1 → B3: `[Từ chối]`
- D2 → B6: `[Đủ hàng]`
- D2 → C1: `[Không đủ hàng]`
- D3 → B9: `[Duyệt]`
- D3 → B8: `[Từ chối]`

---

## Giải thích luồng

### Luồng chính (Main Flow)
**Bộ phận yêu cầu** (KD/SX) lập Phiếu đề nghị xuất kho và trình **Trưởng kho** duyệt. Sau khi được duyệt, **Thủ kho** tiếp nhận phiếu, kiểm tra tồn kho (<<include>> UC_NV03). Nếu đủ hàng, Thủ kho lập Phiếu xuất kho, trình Trưởng kho ký duyệt, soạn hàng và bàn giao. Bộ phận yêu cầu ký nhận, Thủ kho cập nhật trừ tồn kho.

### Luồng thay thế
- **Không đủ hàng:** Thủ kho thông báo Bộ phận yêu cầu và chuyển thông tin sang NV mua hàng để đặt bổ sung từ NCC. Quy trình tạm dừng, chờ nhập bổ sung.
- **Trưởng kho từ chối phiếu đề nghị:** Ghi lý do, trả về Bộ phận yêu cầu, quy trình kết thúc.
