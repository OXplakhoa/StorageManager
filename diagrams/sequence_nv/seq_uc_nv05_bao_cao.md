# Sơ đồ Tuần tự Nghiệp vụ – UC_NV05: Lập báo cáo kho

```mermaid
sequenceDiagram
    actor KTK as 📊 Kế toán kho
    participant HS as 📁 Hồ sơ / Chứng từ
    actor TrK as 👔 Trưởng kho
    actor BGD as 🏛️ Ban Giám đốc

    Note over KTK, BGD: UC_NV05 – LẬP BÁO CÁO KHO

    Note left of KTK: Sự kiện kích hoạt:<br/>Đến kỳ hạn báo cáo<br/>(cuối tháng / cuối quý)

    activate KTK
    KTK->>HS: Thu thập Phiếu nhập, Phiếu xuất, BB kiểm kê trong kỳ
    HS-->>KTK: Trả về chứng từ gốc
    
    KTK->>KTK: Tổng hợp số liệu Nhập – Xuất – Tồn theo mặt hàng
    
    KTK->>HS: Đối chiếu số liệu tổng hợp với phiếu gốc
    
    alt ⚠️ Phát hiện sai lệch
        KTK->>HS: Đối chiếu lại từng phiếu gốc
        KTK->>KTK: Chỉnh sửa số liệu cho khớp thực tế
    end

    KTK->>KTK: Lập Báo cáo tồn kho theo danh mục hàng
    KTK->>KTK: Lập Báo cáo NXT (Nhập – Xuất – Tồn) theo kỳ
    KTK->>KTK: Lập Danh sách hàng dưới mức tồn tối thiểu
    
    KTK->>TrK: Trình bộ 3 báo cáo lên Trưởng kho
    deactivate KTK
    activate TrK

    TrK->>TrK: Kiểm tra, rà soát số liệu trên báo cáo

    alt ✅ Số liệu hợp lệ
        TrK->>TrK: Ký xác nhận bộ báo cáo
        TrK->>BGD: Gửi bộ báo cáo hoàn chỉnh đến Ban Giám đốc
        deactivate TrK
        BGD->>BGD: Tiếp nhận & ra quyết định chiến lược
    else ❌ Phát hiện sai sót
        TrK-->>KTK: Yêu cầu kiểm tra lại mục có nghi vấn
        deactivate TrK
        Note right of KTK: Kế toán đối chiếu lại<br/>→ Sửa → Trình lại
    end
```
