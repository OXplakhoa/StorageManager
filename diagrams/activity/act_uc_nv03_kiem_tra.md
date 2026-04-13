# Sơ đồ Hoạt động – UC_NV03: Kiểm tra hàng hóa

## Mô tả
Đây là Use Case dùng chung (<<include>>) được gọi từ UC_NV01 (Nhập kho) và UC_NV02 (Xuất kho). Thừa tác viên (Nhân viên mua hàng hoặc Thủ kho, tùy ngữ cảnh) tiến hành kiểm tra một lô hàng cụ thể theo chứng từ đi kèm.

```mermaid
flowchart TD
    Start(["⬤ Bắt đầu<br/>(Được gọi từ UC_NV01<br/>hoặc UC_NV02)"])

    Start --> C1["Thừa tác viên:<br/>Tiếp nhận chứng từ gốc<br/>(Hóa đơn hoặc Phiếu ĐN xuất)<br/>+ Hàng hóa vật lý"]
    C1 --> C2["Thừa tác viên:<br/>Đếm số lượng<br/>hàng hóa thực tế"]
    C2 --> C3["Thừa tác viên:<br/>Kiểm tra ngoại quan<br/>(Bao bì, hạn sử dụng,<br/>tình trạng móp méo)"]
    C3 --> C4["Thừa tác viên:<br/>Đối chiếu chéo<br/>SL + chất lượng thực tế<br/>với dữ liệu trên chứng từ"]
    C4 --> D1{"Kết quả<br/>đối chiếu?"}

    D1 -->|"✅ Khớp & Đạt<br/>chất lượng"| R1["Xác nhận:<br/>Hàng hóa HỢP LỆ"]
    R1 --> End1(["⬤ Kết thúc<br/>→ Trả kết quả về<br/>UC gốc (Tiếp tục)"])

    D1 -->|"⚠️ Chênh lệch SL<br/>nhưng CL đạt"| R2["Ghi nhận:<br/>Số lượng chênh lệch<br/>vào biên bản"]
    R2 --> End2(["⬤ Kết thúc<br/>→ Trả kết quả về<br/>UC gốc (Có ghi chú)"])

    D1 -->|"❌ Không đạt<br/>chất lượng"| R3["Xác nhận:<br/>Hàng hóa KHÔNG HỢP LỆ<br/>(Ghi rõ lý do)"]
    R3 --> End3(["⬤ Kết thúc<br/>→ Kích hoạt<br/>UC_NV04 (nếu nhập)<br/>hoặc từ chối xuất"])

    %% Styling
    style Start fill:#333,color:#fff
    style End1 fill:#28a745,color:#fff
    style End2 fill:#ffc107,color:#333
    style End3 fill:#dc3545,color:#fff
    style D1 fill:#ffc107,color:#333
    style R1 fill:#d4edda,color:#155724
    style R3 fill:#f8d7da,color:#721c24
```

## 📐 Hướng dẫn vẽ lại trong IBM Rational Rose

### Swimlanes
| Swimlane | Tên Actor |
|---|---|
| Lane 1 | **Thừa tác viên (NV Mua hàng hoặc Thủ kho)** |

> **Lưu ý:** UC này chỉ có 1 swimlane vì chỉ có 1 tác nhân thực hiện (tùy ngữ cảnh). Trong Rose, có thể đặt trong 1 lane duy nhất hoặc không dùng swimlane.

### Phân bổ Action States

| Mã Node | Action State | Ký hiệu |
|---|---|---|
| Start | ⬤ Bắt đầu (được gọi từ UC_NV01 hoặc UC_NV02) | Initial Node (●) |
| C1 | Tiếp nhận chứng từ gốc + Hàng hóa vật lý | Action State ▭ |
| C2 | Đếm số lượng hàng hóa thực tế | Action State ▭ |
| C3 | Kiểm tra ngoại quan (bao bì, HSD, móp méo) | Action State ▭ |
| C4 | Đối chiếu chéo SL + CL thực tế vs chứng từ | Action State ▭ |
| D1 | [Kết quả đối chiếu?] | Decision ◇ |
| R1 | Xác nhận: Hàng hóa HỢP LỆ | Action State ▭ |
| R2 | Ghi nhận: Số lượng chênh lệch | Action State ▭ |
| R3 | Xác nhận: KHÔNG HỢP LỆ (ghi rõ lý do) | Action State ▭ |
| End1 | ◉ Trả kết quả về UC gốc (Tiếp tục) | Final Node (◉) |
| End2 | ◉ Trả kết quả + Ghi chú | Final Node (◉) |
| End3 | ◉ Kích hoạt UC_NV04 / Từ chối xuất | Final Node (◉) |

### Guard Conditions
- D1 → R1: `[Khớp & Đạt chất lượng]`
- D1 → R2: `[Chênh lệch SL, CL đạt]`
- D1 → R3: `[Không đạt chất lượng]`

---

## Giải thích luồng
- **Hợp lệ:** Số lượng khớp, chất lượng đạt → Xác nhận hợp lệ, trả kết quả dương về UC gốc để tiếp tục.
- **Chênh lệch số lượng:** Ghi chú vào biên bản, vẫn có thể tiếp tục nhưng cần lưu ý khi lập phiếu.
- **Không hợp lệ:** Chất lượng không đạt → Kích hoạt UC_NV04 (Xử lý chênh lệch) nếu đang ở luồng nhập kho, hoặc từ chối xuất nếu đang ở luồng xuất kho.
