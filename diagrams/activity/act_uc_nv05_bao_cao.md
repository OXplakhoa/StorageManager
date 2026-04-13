# Sơ đồ Hoạt động – UC_NV05: Lập báo cáo kho

## Mô tả
Quy trình tổng hợp số liệu nhập – xuất – tồn kho để lập báo cáo định kỳ (cuối tháng/cuối quý) trình Ban Giám đốc.

```mermaid
flowchart TD
    Start(["⬤ Bắt đầu<br/>(Đến kỳ hạn báo cáo)"])

    Start --> E1["Kế toán kho:<br/>Thu thập toàn bộ<br/>Phiếu nhập, Phiếu xuất,<br/>Biên bản kiểm kê<br/>trong kỳ"]
    E1 --> E2["Kế toán kho:<br/>Tổng hợp số liệu<br/>Nhập – Xuất – Tồn<br/>theo từng mặt hàng"]
    E2 --> D1{"Số liệu<br/>có khớp với<br/>phiếu gốc?"}

    D1 -->|"❌ Sai lệch"| E3["Kế toán kho:<br/>Đối chiếu lại<br/>với từng phiếu gốc"]
    E3 --> E4["Kế toán kho:<br/>Chỉnh sửa số liệu<br/>cho khớp thực tế"]
    E4 --> E2

    D1 -->|"✅ Chính xác"| E5["Kế toán kho:<br/>Lập Báo cáo tồn kho<br/>theo danh mục hàng"]
    E5 --> E6["Kế toán kho:<br/>Lập Báo cáo NXT<br/>(Nhập – Xuất – Tồn)<br/>theo kỳ"]
    E6 --> E7["Kế toán kho:<br/>Lập Danh sách hàng<br/>dưới mức tồn tối thiểu"]
    E7 --> E8["Kế toán kho:<br/>Trình bộ báo cáo<br/>lên Trưởng kho"]
    E8 --> D2{"Trưởng kho:<br/>Kiểm tra<br/>& xác nhận?"}

    D2 -->|"❌ Phát hiện sai"| E9["Trưởng kho:<br/>Yêu cầu Kế toán<br/>kiểm tra lại<br/>mục có nghi vấn"]
    E9 --> E3

    D2 -->|"✅ Hợp lệ"| E10["Trưởng kho:<br/>Ký xác nhận<br/>bộ báo cáo"]
    E10 --> E11["Hệ thống/Kế toán:<br/>Gửi báo cáo đến<br/>Ban Giám đốc<br/>+ Phòng Kế toán TH"]
    E11 --> End(["⬤ Kết thúc"])

    %% Styling
    style Start fill:#333,color:#fff
    style End fill:#333,color:#fff
    style D1 fill:#ffc107,color:#333
    style D2 fill:#ffc107,color:#333
    style E3 fill:#fff3cd,color:#856404
    style E4 fill:#fff3cd,color:#856404
    style E10 fill:#d4edda,color:#155724
```

## 📐 Hướng dẫn vẽ lại trong IBM Rational Rose

### Swimlanes
| Swimlane | Tên Actor |
|---|---|
| Lane 1 | **Kế toán kho** |
| Lane 2 | **Trưởng kho** |
| Lane 3 | **Ban Giám đốc** |

### Phân bổ Action States

| Mã Node | Action State | Swimlane | Ký hiệu |
|---|---|---|---|
| Start | ⬤ Bắt đầu (đến kỳ hạn BC) | Lane 1 | Initial Node (●) |
| E1 | Thu thập Phiếu nhập, xuất, BB kiểm kê | Lane 1 | Action State ▭ |
| E2 | Tổng hợp số liệu NXT theo mặt hàng | Lane 1 | Action State ▭ |
| D1 | [Số liệu khớp phiếu gốc?] | Lane 1 | Decision ◇ |
| E3 | Đối chiếu lại từng phiếu gốc | Lane 1 | Action State ▭ |
| E4 | Chỉnh sửa số liệu cho khớp | Lane 1 | Action State ▭ |
| E5 | Lập BC tồn kho theo danh mục | Lane 1 | Action State ▭ |
| E6 | Lập BC NXT theo kỳ | Lane 1 | Action State ▭ |
| E7 | Lập DS hàng dưới mức tồn tối thiểu | Lane 1 | Action State ▭ |
| E8 | Trình bộ báo cáo lên Trưởng kho | Lane 1 → Lane 2 | ▭ (transition chéo) |
| D2 | [Trưởng kho xác nhận?] | Lane 2 | Decision ◇ |
| E9 | Yêu cầu kiểm tra lại mục nghi vấn | Lane 2 | Action State ▭ |
| E10 | Ký xác nhận bộ báo cáo | Lane 2 | Action State ▭ |
| E11 | Gửi báo cáo đến Ban GĐ | Lane 2 → Lane 3 | ▭ (transition chéo) |
| End | ◉ Kết thúc | Lane 3 | Final Node (◉) |

### Guard Conditions
- D1 → E5: `[Chính xác]`
- D1 → E3: `[Sai lệch]`
- D2 → E10: `[Hợp lệ]`
- D2 → E9: `[Phát hiện sai]`

---

## Giải thích luồng
### Luồng chính
Kế toán kho thu thập chứng từ → Tổng hợp NXT → Lập 3 loại báo cáo (tồn kho, NXT, hàng dưới mức tối thiểu) → Trình Trưởng kho duyệt → Gửi Ban GĐ.

### Luồng thay thế
- Phát hiện sai lệch trong quá trình tổng hợp → Đối chiếu lại phiếu gốc → Chỉnh sửa → Tiếp tục.
- Trưởng kho phát hiện sai → Yêu cầu kiểm tra lại → Vòng lặp cho đến khi chính xác.
