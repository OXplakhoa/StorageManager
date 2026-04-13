# Sơ đồ Tuần tự Nghiệp vụ – UC_NV04: Xử lý chênh lệch

```mermaid
sequenceDiagram
    actor NVMH as 👷 NV Mua hàng
    actor NCC as 🏭 Nhà cung cấp
    actor TrK as 👔 Trưởng kho

    Note over NVMH, TrK: UC_NV04 – XỬ LÝ CHÊNH LỆCH (<<extend>> từ UC_NV01)

    Note left of NVMH: Kích hoạt khi UC_NV01<br/>phát hiện hàng lỗi/thiếu

    activate NVMH
    NVMH->>NVMH: Tách riêng hàng hóa bị lỗi / thiếu hụt
    NVMH->>NVMH: Ghi nhận SL sai lệch + mô tả lỗi chi tiết
    NVMH->>NVMH: Lập Biên bản chênh lệch (Nguyên nhân, SL, mô tả)
    NVMH->>NCC: Thông báo tình trạng sự cố
    NVMH->>NCC: Chuyển giao Biên bản chênh lệch để ký xác nhận

    alt ✅ NCC đồng ý ký
        NCC->>NVMH: Ký xác nhận vào Biên bản chênh lệch
        NVMH->>NCC: Bàn giao hàng lỗi cho NCC mang về
        NVMH->>NVMH: Lưu trữ Biên bản (cơ sở thanh toán)
        deactivate NVMH
        Note right of NVMH: → Quay lại UC_NV01<br/>với phần hàng hợp lệ
    else ❌ NCC không đồng ý ký
        NCC-->>NVMH: Từ chối ký xác nhận
        NVMH->>TrK: Báo cáo lên Trưởng kho
        activate TrK
        TrK->>NCC: Liên hệ trực tiếp để thương lượng
        alt ✅ Thương lượng thành công
            NCC->>TrK: Đồng ý ký biên bản
            TrK->>NVMH: Thông báo kết quả
            deactivate TrK
        else ❌ Thương lượng thất bại
            TrK->>TrK: Lập hồ sơ tranh chấp
            TrK-->>NVMH: Chuyển hồ sơ sang Ban pháp chế
            deactivate TrK
        end
        deactivate NVMH
    end
```
