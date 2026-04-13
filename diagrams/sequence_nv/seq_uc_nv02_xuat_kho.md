# Sơ đồ Tuần tự Nghiệp vụ – UC_NV02: Xuất kho hàng hóa

```mermaid
sequenceDiagram
    actor BPYC as 🏢 Bộ phận yêu cầu
    actor TK as 📦 Thủ kho
    actor TrK as 👔 Trưởng kho
    actor NVMH as 👷 NV Mua hàng

    Note over BPYC, NVMH: UC_NV02 – QUY TRÌNH XUẤT KHO HÀNG HÓA

    BPYC->>BPYC: Lập Phiếu đề nghị xuất kho (Mã hàng, SL, mục đích)
    BPYC->>TrK: Trình Phiếu đề nghị xuất kho
    activate TrK
    
    alt ✅ Phê duyệt phiếu đề nghị
        TrK->>TK: Chuyển phiếu đề nghị đã duyệt
        deactivate TrK
        activate TK
        
        TK->>TK: Kiểm tra SL tồn kho hiện tại
        Note right of TK: <<include>> UC_NV03<br/>Kiểm tra hàng hóa
        
        alt ✅ Đủ hàng trong kho
            TK->>TK: Lập Phiếu xuất kho (Số phiếu, ngày, BP nhận, chi tiết)
            TK->>TrK: Trình Phiếu xuất kho phê duyệt
            activate TrK
            TrK->>TrK: Đối chiếu phiếu xuất với phiếu đề nghị
            
            alt ✅ Duyệt phiếu xuất
                TrK->>TK: Ký duyệt Phiếu xuất kho
                deactivate TrK
                TK->>TK: Soạn hàng theo phiếu
                TK->>BPYC: Bàn giao hàng hóa
                BPYC->>TK: Kiểm nhận + Ký xác nhận phiếu xuất
                TK->>TK: Cập nhật trừ tồn kho (Thẻ kho / Sổ tồn)
                TK->>TK: Lưu trữ hồ sơ (Phiếu XK + Phiếu ĐN)
                deactivate TK
            else ❌ Từ chối phiếu xuất
                TrK-->>TK: Trả phiếu + Ghi lý do
                deactivate TrK
            end
            
        else ❌ Không đủ hàng
            TK-->>BPYC: Thông báo không đủ hàng
            TK->>NVMH: Chuyển yêu cầu đặt hàng bổ sung từ NCC
            deactivate TK
            Note right of NVMH: Chờ nhập bổ sung<br/>→ Kích hoạt UC_NV01
        end
        
    else ❌ Từ chối phiếu đề nghị
        TrK-->>BPYC: Trả phiếu + Ghi lý do từ chối
        deactivate TrK
    end
```
