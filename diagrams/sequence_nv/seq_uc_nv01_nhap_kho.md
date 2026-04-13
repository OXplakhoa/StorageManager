# Sơ đồ Tuần tự Nghiệp vụ – UC_NV01: Nhập kho hàng hóa

## Mô tả
Sơ đồ tuần tự thể hiện trình tự tương tác giữa các tác nhân nghiệp vụ trong quy trình nhập kho hàng hóa theo trục thời gian.

```mermaid
sequenceDiagram
    actor NCC as 🏭 Nhà cung cấp
    actor NVMH as 👷 NV Mua hàng
    actor TK as 📦 Thủ kho
    actor TrK as 👔 Trưởng kho

    Note over NCC, TrK: UC_NV01 – QUY TRÌNH NHẬP KHO HÀNG HÓA

    NCC->>NVMH: Giao hàng hóa + Hóa đơn mua hàng
    activate NVMH
    
    NVMH->>NVMH: Kiểm tra đối chiếu SL, chủng loại theo hóa đơn
    
    Note right of NVMH: <<include>> UC_NV03<br/>Kiểm tra hàng hóa

    alt ✅ Hàng hóa đúng & đủ
        NVMH->>TK: Bàn giao hàng hợp lệ + Hóa đơn
        deactivate NVMH
        activate TK
        
        TK->>TK: Kiểm tra lại lần cuối (ngoại quan, SL)
        TK->>TK: Lập Phiếu nhập kho (Số phiếu, ngày, NCC, chi tiết hàng)
        TK->>TrK: Trình Phiếu nhập kho để phê duyệt
        deactivate TK
        activate TrK
        
        TrK->>TrK: Đối chiếu Phiếu NK với Hóa đơn gốc
        
        alt ✅ Phê duyệt
            TrK->>TK: Ký duyệt Phiếu nhập kho
            deactivate TrK
            activate TK
            TK->>TK: Sắp xếp hàng vào vị trí kho
            TK->>TK: Cập nhật Thẻ kho / Sổ tồn kho
            TK->>TK: Lưu trữ hồ sơ (Phiếu NK + HĐ)
            deactivate TK
        else ❌ Từ chối
            TrK-->>TK: Trả phiếu + Ghi lý do từ chối
            deactivate TrK
            Note right of TK: Thủ kho sửa lại phiếu<br/>và trình lại
        end
        
    else ❌ Hàng lỗi / Thiếu (<<extend>> UC_NV04)
        Note over NVMH, NCC: Kích hoạt UC_NV04 –<br/>Xử lý chênh lệch
        NVMH->>NVMH: Tách riêng hàng lỗi/thiếu
        NVMH->>NVMH: Lập Biên bản chênh lệch
        NVMH->>NCC: Yêu cầu ký xác nhận Biên bản
        NCC->>NVMH: Ký xác nhận Biên bản chênh lệch
        NVMH->>NCC: Trả hàng lỗi cho NCC
        deactivate NVMH
        
        Note right of NVMH: Nếu còn hàng hợp lệ<br/>→ Tiếp tục bàn giao<br/>cho Thủ kho
    end
```
