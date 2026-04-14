# Sơ đồ Tuần tự Nghiệp vụ – UC_NV03: Kiểm tra hàng hóa

```plantuml
@startuml
title UC_NV03 – Kiểm tra hàng hóa (<<include>>)

actor "Thừa tác viên\n(NV Mua hàng / Thủ kho)" as TAV
entity "Chứng từ gốc\n(Hóa đơn / Phiếu ĐN)" as CT <<Business Entity>>
entity "Hàng hóa\nvật lý" as HH <<Business Entity>>

note over TAV, HH : UC này được gọi <<include>>\ntừ UC_NV01 hoặc UC_NV02

TAV -> CT : Tiếp nhận chứng từ gốc
TAV -> HH : Tiếp nhận hàng hóa vật lý
activate TAV

TAV -> HH : Đếm số lượng\nhàng hóa thực tế
TAV -> HH : Kiểm tra ngoại quan\n(bao bì, HSD, móp méo)
TAV -> CT : Đọc số liệu trên chứng từ
TAV -> TAV : Đối chiếu chéo\nSL + CL thực tế vs chứng từ

TAV -> TAV : [Khớp & Đạt CL] Xác nhận:\nHàng hóa HỢP LỆ
note right of TAV : → Trả kết quả DƯƠNG\nvề UC gốc (Tiếp tục)

TAV -> TAV : [Chênh lệch SL, CL đạt]\nGhi nhận số lượng chênh lệch
note right of TAV : → Trả kết quả + GHI CHÚ\nvề UC gốc

TAV -> TAV : [Không đạt CL] Xác nhận:\nKHÔNG HỢP LỆ (ghi lý do)
note right of TAV : → Kích hoạt UC_NV04\n(nếu ở UC_NV01)\nhoặc từ chối xuất\n(nếu ở UC_NV02)

deactivate TAV

@enduml
```
