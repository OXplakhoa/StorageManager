# Sơ đồ Tuần tự Nghiệp vụ – UC_NV06: Quản lý danh mục cơ sở

```plantuml
@startuml
title UC_NV06 – Quản lý danh mục cơ sở

actor "Trưởng kho" as TrK
actor "Kế toán kho" as KTK
actor "Thủ kho" as TK
participant "Sổ Danh mục\n(NCC / Hàng hóa)" as DM

TrK -> KTK : [Từ chỉ đạo] Chỉ đạo\ncập nhật danh mục
note left of KTK : Hoặc phát sinh từ\nnhu cầu thực tế\n(NCC mới, hàng mới)

activate KTK

KTK -> KTK : [Danh mục NCC] Thu thập\nthông tin NCC\n(Mã, Tên, ĐC, SĐT, Email, MST)
KTK -> DM : Kiểm tra NCC đã tồn tại?
DM --> KTK : Kết quả tra cứu
KTK -> DM : [Chưa tồn tại] Thêm mới\nNCC vào danh mục
KTK -> DM : [Đã tồn tại] Cập nhật\nthông tin NCC

KTK -> KTK : [Danh mục HH] Thu thập\nthông tin HH\n(Mã, Tên, ĐVT, Quy cách,\nNhóm, HM tồn min)
KTK -> DM : Kiểm tra HH đã tồn tại?
DM --> KTK : Kết quả tra cứu
KTK -> DM : [Chưa tồn tại] Thêm mới\nHàng hóa
KTK -> DM : [Đã có & còn KD] Cập nhật\nthông tin HH
KTK -> DM : [Đã có & ngừng KD] Đánh dấu\n"Ngừng hoạt động"

KTK -> KTK : Kiểm tra tính chính xác\n& không trùng lặp
KTK -> DM : Lưu trữ danh mục đã cập nhật
KTK -> TK : Thông báo danh mục\nđã cập nhật
deactivate KTK

note right of TK : Thủ kho & NV mua hàng\nsử dụng danh mục mới\nkhi lập phiếu

@enduml
```
