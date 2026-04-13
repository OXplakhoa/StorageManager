# Đặc tả Use Case Nghiệp vụ Bổ sung

## UC_NV06 – Quản lý danh mục cơ sở

| Thông tin | Nội dung |
|---|---|
| **Tên Use-Case** | Quản lý danh mục cơ sở |
| **Mã Use-Case** | UC_NV06 |
| **Tóm tắt** | Quy trình thiết lập, duy trì và cập nhật các thông tin nền tảng của hệ thống kho hàng, bao gồm danh mục nhà cung cấp và danh mục hàng hóa. Đây là nghiệp vụ tiền đề bắt buộc phải hoàn tất trước khi tiến hành bất kỳ giao dịch nhập, xuất hay kiểm kê nào. |
| **Tác nhân** | Kế toán kho, Thủ kho |
| **Tiền điều kiện** | Tác nhân đã được phân công trách nhiệm quản lý danh mục bởi Trưởng kho/Quản lý. |
| **Hậu điều kiện** | Danh mục nhà cung cấp và/hoặc danh mục hàng hóa được cập nhật chính xác, đồng bộ và sẵn sàng phục vụ cho các nghiệp vụ giao dịch (nhập kho, xuất kho). |

### Dòng sự kiện chính
1. Kế toán kho hoặc Thủ kho nhận được yêu cầu bổ sung/chỉnh sửa thông tin danh mục (từ nhu cầu thực tế hoặc chỉ đạo của Trưởng kho).
2. Tác nhân thu thập thông tin chi tiết cần cập nhật:
   - **Nhà cung cấp:** Mã NCC, tên công ty, địa chỉ, số điện thoại liên hệ, email, mã số thuế.
   - **Hàng hóa:** Mã hàng, tên hàng, đơn vị tính, quy cách đóng gói, nhóm hàng, hạn mức tồn kho tối thiểu.
3. Tác nhân tiến hành ghi nhận thông tin mới vào sổ danh mục (sổ giấy hoặc file Excel hiện tại).
4. Tác nhân kiểm tra lại tính chính xác và không trùng lặp của dữ liệu vừa nhập.
5. Danh mục được lưu trữ và thông báo cho các bộ phận liên quan (Thủ kho, NV mua hàng) để sử dụng khi lập phiếu.

### Dòng sự kiện phụ (Luồng thay thế)
- **3a.** Nếu phát hiện nhà cung cấp hoặc mặt hàng đã tồn tại trong danh mục → Tác nhân tiến hành cập nhật (sửa đổi) thông tin thay vì thêm mới.
- **3b.** Nếu một mặt hàng ngừng kinh doanh hoặc một nhà cung cấp ngừng hợp tác → Tác nhân đánh dấu trạng thái "Ngừng hoạt động" thay vì xóa vĩnh viễn (để bảo toàn lịch sử giao dịch cũ).

---

## UC_NV07 – Kiểm kê hàng hóa định kỳ

| Thông tin | Nội dung |
|---|---|
| **Tên Use-Case** | Kiểm kê hàng hóa định kỳ |
| **Mã Use-Case** | UC_NV07 |
| **Tóm tắt** | Quy trình kiểm đếm thực tế toàn bộ hàng hóa trong kho theo định kỳ (cuối tháng/cuối quý) hoặc đột xuất, nhằm đối chiếu số liệu thực tế với sổ sách và phát hiện, xử lý chênh lệch. Đây là nghiệp vụ kiểm soát nội bộ quan trọng, khác biệt hoàn toàn với UC_NV03 (Kiểm tra hàng hóa – chỉ kiểm tra một lô hàng cụ thể tại thời điểm nhập/xuất). |
| **Tác nhân** | Trưởng kho (khởi xướng), Thủ kho (thực hiện), Kế toán kho (phối hợp đối chiếu) |
| **Tiền điều kiện** | Đến kỳ hạn kiểm kê định kỳ (cuối tháng hoặc cuối quý) hoặc có yêu cầu kiểm kê đột xuất từ Ban Giám đốc. Tất cả giao dịch nhập/xuất trong ngày kiểm kê đã được tạm dừng hoặc hoàn tất. |
| **Hậu điều kiện** | Biên bản kiểm kê được lập, ký duyệt bởi đầy đủ các bên. Số liệu tồn kho trên sổ sách/hệ thống được điều chỉnh khớp với thực tế (nếu có chênh lệch). |

### Dòng sự kiện chính
1. Trưởng kho ra quyết định và lập kế hoạch kiểm kê: xác định phạm vi (toàn kho hoặc theo nhóm hàng), thời gian thực hiện và phân công nhân sự.
2. Trưởng kho thông báo kế hoạch kiểm kê đến Thủ kho và Kế toán kho.
3. Thủ kho chuẩn bị biểu mẫu kiểm kê (Biên bản kiểm kê trắng) theo danh mục hàng hóa hiện có.
4. Đội kiểm kê (Thủ kho + Kế toán kho) tiến hành kiểm đếm thực tế từng mặt hàng tại hiện trường kho:
   - Đếm số lượng thực tế từng mặt hàng.
   - Kiểm tra tình trạng chất lượng (hàng hư hỏng, hết hạn, mất mát).
   - Ghi nhận kết quả vào Biên bản kiểm kê hiện trường.
5. Kế toán kho lấy số liệu tồn kho trên sổ sách/hệ thống tại cùng thời điểm cắt (cut-off).
6. Đội kiểm kê đối chiếu số liệu thực tế (bước 4) với số liệu sổ sách (bước 5) cho từng mặt hàng.
7. Nếu **không có chênh lệch** → Ghi nhận "Khớp" vào biên bản → chuyển sang bước 9.
8. Nếu **phát hiện chênh lệch** → Ghi rõ mức chênh lệch (thừa/thiếu bao nhiêu), xác định và ghi nhận nguyên nhân (hao hụt tự nhiên, mất mát, ghi sổ sai, v.v.), đề xuất phương án xử lý (điều chỉnh sổ, quy trách nhiệm, bổ sung hàng).
9. Đội kiểm kê hoàn thiện Biên bản kiểm kê đầy đủ và trình Trưởng kho.
10. Trưởng kho rà soát, kiểm tra số liệu trên biên bản và ký xác nhận phê duyệt.
11. Kế toán kho thực hiện điều chỉnh số liệu tồn kho trên sổ sách/hệ thống theo biên bản đã được duyệt.

### Dòng sự kiện phụ (Luồng thay thế)
- **1a.** Kiểm kê đột xuất: Ban Giám đốc hoặc Trưởng kho yêu cầu kiểm kê ngoài kỳ hạn (do nghi ngờ thất thoát, sau sự cố thiên tai, v.v.) → Quy trình tương tự nhưng phạm vi có thể giới hạn cho một nhóm hàng hoặc một khu vực kho cụ thể.
- **8a.** Chênh lệch nghiêm trọng (vượt ngưỡng cho phép): → Trưởng kho lập báo cáo riêng trình Ban Giám đốc để xin chỉ đạo xử lý (quy trách nhiệm vật chất, kiểm tra camera, v.v.) trước khi điều chỉnh sổ.
- **10a.** Trưởng kho phát hiện sai sót trong biên bản → Yêu cầu đội kiểm kê kiểm tra lại các mặt hàng có nghi vấn → Quay lại bước 4 cho các mặt hàng đó.
