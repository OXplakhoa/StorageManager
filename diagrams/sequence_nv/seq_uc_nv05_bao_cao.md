# Sơ đồ Tuần tự Nghiệp vụ – UC_NV05: Lập báo cáo kho

```plantuml
@startuml
title UC_NV05 – Lập báo cáo kho

actor "Kế toán kho" as KTK
participant "Hồ sơ / Chứng từ" as HS
actor "Trưởng kho" as TrK
actor "Ban Giám đốc" as BGD

note left of KTK : Sự kiện kích hoạt:\nĐến kỳ hạn báo cáo\n(cuối tháng / cuối quý)

activate KTK
KTK -> HS : Thu thập Phiếu nhập, xuất,\nBB kiểm kê trong kỳ
HS --> KTK : Trả về chứng từ gốc

KTK -> KTK : Tổng hợp số liệu\nNhập – Xuất – Tồn theo mặt hàng
KTK -> HS : Đối chiếu số liệu\ntổng hợp với phiếu gốc

KTK -> HS : [Sai lệch] Đối chiếu lại\ntừng phiếu gốc
KTK -> KTK : [Sai lệch] Chỉnh sửa\nsố liệu cho khớp thực tế

KTK -> KTK : Lập Báo cáo tồn kho\ntheo danh mục hàng
KTK -> KTK : Lập Báo cáo NXT\n(Nhập – Xuất – Tồn) theo kỳ
KTK -> KTK : Lập Danh sách hàng\ndưới mức tồn tối thiểu

KTK -> TrK : Trình bộ 3 báo cáo\nlên Trưởng kho
deactivate KTK

activate TrK
TrK -> TrK : Kiểm tra, rà soát\nsố liệu trên báo cáo

TrK -> TrK : [Hợp lệ] Ký xác nhận\nbộ báo cáo
TrK -> BGD : [Hợp lệ] Gửi bộ báo cáo\nhoàn chỉnh đến Ban GĐ
deactivate TrK

BGD -> BGD : Tiếp nhận &\nra quyết định chiến lược

TrK --> KTK : [Phát hiện sai sót]\nYêu cầu kiểm tra lại\nmục có nghi vấn
note right of KTK : Kế toán đối chiếu lại\n→ Sửa → Trình lại

@enduml
```
