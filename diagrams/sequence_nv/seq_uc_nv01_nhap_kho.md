# Sơ đồ Tuần tự Nghiệp vụ – UC_NV01: Nhập kho hàng hóa

## Mô tả
Sơ đồ tuần tự thể hiện trình tự tương tác giữa các tác nhân, thừa tác viên và thực thể nghiệp vụ trong quy trình nhập kho hàng hóa.

```plantuml
@startuml
title UC_NV01 – Nhập kho hàng hóa

actor "Nhà cung cấp" as NCC
actor "NV Mua hàng" as NVMH
actor "Thủ kho" as TK
actor "Trưởng kho" as TrK
entity "Phiếu nhập kho" as PNK <<Business Entity>>
entity "Thẻ kho" as TheKho <<Business Entity>>
entity "Biên bản\nchênh lệch" as BBCL <<Business Entity>>

NCC -> NVMH : Giao hàng hóa +\nHóa đơn mua hàng
activate NVMH
NVMH -> NVMH : Kiểm tra đối chiếu SL,\nchủng loại theo hóa đơn
note right of NVMH : <<include>> UC_NV03\nKiểm tra hàng hóa

NVMH -> TK : [Hàng đúng & đủ]\nBàn giao hàng hợp lệ + Hóa đơn
deactivate NVMH

activate TK
TK -> TK : Kiểm tra lại lần cuối\n(ngoại quan, SL)
TK -> PNK : Lập Phiếu nhập kho\n(Số phiếu, ngày, NCC, chi tiết hàng)
TK -> TrK : Trình Phiếu nhập kho\nđể phê duyệt
deactivate TK

activate TrK
TrK -> PNK : Đối chiếu Phiếu NK\nvới Hóa đơn gốc
TrK -> PNK : [Duyệt] Ký duyệt\nPhiếu nhập kho
deactivate TrK

activate TK
TK -> TK : Sắp xếp hàng\nvào vị trí kho
TK -> TheKho : Cập nhật Thẻ kho\n(Ghi nhận nhập)
TK -> PNK : Lưu trữ hồ sơ\n(Phiếu NK + Hóa đơn)
deactivate TK

TrK --> TK : [Từ chối] Trả phiếu +\nGhi lý do từ chối
note right of TK : Thủ kho sửa lại\nphiếu và trình lại

NVMH -> NVMH : [Hàng lỗi/thiếu]\nTách riêng hàng lỗi
activate NVMH
note right of NVMH : <<extend>> UC_NV04\nXử lý chênh lệch
NVMH -> BBCL : Lập Biên bản chênh lệch
NVMH -> NCC : Yêu cầu NCC\nký xác nhận BB
NCC -> BBCL : Ký xác nhận\nBB chênh lệch
NVMH -> NCC : Trả hàng lỗi cho NCC
deactivate NVMH

@enduml
```
