# Sơ đồ Tuần tự Nghiệp vụ – UC_NV07: Kiểm kê hàng hóa định kỳ

```mermaid
sequenceDiagram
    actor TrK as 👔 Trưởng kho
    actor TK as 📦 Thủ kho
    actor KTK as 📊 Kế toán kho
    participant KHO as 🏭 Kho hàng<br/>(Hàng hóa vật lý)
    participant SS as 📁 Sổ sách /<br/>Hệ thống

    Note over TrK, SS: UC_NV07 – KIỂM KÊ HÀNG HÓA ĐỊNH KỲ

    Note left of TrK: Sự kiện kích hoạt:<br/>Cuối tháng/quý hoặc<br/>yêu cầu đột xuất

    activate TrK
    TrK->>TrK: Lập kế hoạch kiểm kê (Phạm vi, thời gian, nhân sự)
    TrK->>TK: Thông báo kế hoạch kiểm kê
    TrK->>KTK: Thông báo kế hoạch kiểm kê
    deactivate TrK

    activate TK
    TK->>TK: Chuẩn bị Biên bản kiểm kê trắng theo danh mục hàng
    
    Note over TK, KTK: 🔍 Đội kiểm kê tiến hành đếm thực tế

    TK->>KHO: Kiểm đếm từng mặt hàng tại hiện trường
    KHO-->>TK: Số lượng thực tế + Tình trạng chất lượng
    TK->>TK: Ghi nhận kết quả vào Biên bản kiểm kê hiện trường
    deactivate TK

    activate KTK
    KTK->>SS: Xuất số liệu tồn kho sổ sách tại thời điểm cắt (cut-off)
    SS-->>KTK: Số liệu tồn kho sổ sách

    Note over TK, KTK: 📊 Đối chiếu SL thực tế vs SL sổ sách

    KTK->>KTK: Đối chiếu từng mặt hàng: Thực tế vs Sổ sách

    alt ✅ Tất cả khớp
        KTK->>KTK: Ghi nhận "Khớp" vào Biên bản
    else ⚠️ Phát hiện chênh lệch
        KTK->>KTK: Ghi nhận chênh lệch (Thừa/Thiếu)
        KTK->>KTK: Xác định nguyên nhân (Hao hụt / Mất mát / Ghi sổ sai)
        KTK->>KTK: Đề xuất phương án xử lý

        opt Chênh lệch nghiêm trọng (vượt ngưỡng)
            KTK->>TrK: Báo cáo riêng → Xin chỉ đạo Ban GĐ
        end
    end

    KTK->>KTK: Hoàn thiện Biên bản kiểm kê đầy đủ
    KTK->>TrK: Trình Biên bản kiểm kê lên Trưởng kho
    deactivate KTK

    activate TrK
    TrK->>TrK: Rà soát, kiểm tra số liệu trên Biên bản

    alt ✅ Hợp lệ
        TrK->>TrK: Ký xác nhận Biên bản kiểm kê
        TrK->>KTK: Chuyển Biên bản đã duyệt
        deactivate TrK
        activate KTK
        KTK->>SS: Điều chỉnh số liệu tồn kho theo Biên bản đã duyệt
        deactivate KTK
    else ❌ Phát hiện sai sót
        TrK-->>KTK: Yêu cầu kiểm tra lại mặt hàng nghi vấn
        deactivate TrK
        Note right of KTK: Quay lại kiểm đếm<br/>các mặt hàng nghi vấn
    end
```
