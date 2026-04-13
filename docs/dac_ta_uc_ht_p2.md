# Đặc tả Use Case Hệ thống – HTTT Quản lý Kho hàng (Phần 2/2)

> Phần 1 (UC_HT01 → UC_HT09) xem tại [`dac_ta_uc_ht_p1.md`](file:///Users/khoado/code/PTTKHT/docs/dac_ta_uc_ht_p1.md)

---

## UC_HT10 – Lập Biên bản chênh lệch

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Lập Biên bản chênh lệch |
| **Mã Use Case** | UC_HT10 |
| **Tóm tắt** | Khi phát hiện chênh lệch trong quá trình nhập kho (UC_HT04), Thủ kho lập biên bản chênh lệch trên hệ thống để ghi nhận số lượng sai lệch, nguyên nhân và phương án xử lý, làm cơ sở khiếu nại NCC. |
| **Tác nhân** | Thủ kho |
| **UC liên quan** | UC_HT04 (<<extend>> – kích hoạt khi phát hiện chênh lệch) |
| **Tiền điều kiện** | Đang lập phiếu nhập kho (UC_HT04) và UC_HT09 phát hiện chênh lệch SL hoặc lỗi chất lượng. |
| **Hậu điều kiện** | Biên bản chênh lệch được lưu trong hệ thống, liên kết với Phiếu nhập kho tương ứng. |

### Dòng sự kiện chính
1. Tại giao diện lập phiếu nhập (UC_HT04), khi có cảnh báo chênh lệch, Thủ kho nhấn "Lập Biên bản chênh lệch".
2. Hệ thống mở form biên bản, tự fill: Số phiếu NK liên quan, NCC, ngày lập, danh sách hàng chênh lệch.
3. Thủ kho bổ sung: Loại chênh lệch (Thiếu SL / Lỗi CL / Sai chủng loại), Mô tả chi tiết, SL chênh lệch cụ thể từng dòng.
4. Thủ kho nhấn "Lưu Biên bản".
5. Hệ thống lưu biên bản, liên kết với phiếu nhập kho.
6. Hệ thống cho phép xuất biên bản ra file PDF để in cho NCC ký.

---

## UC_HT11 – Lập kế hoạch kiểm kê

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Lập kế hoạch kiểm kê |
| **Mã Use Case** | UC_HT11 |
| **Tóm tắt** | Trưởng kho lập kế hoạch kiểm kê định kỳ hoặc đột xuất trên hệ thống: xác định phạm vi, thời gian, phân công nhân sự thực hiện. |
| **Tác nhân** | Trưởng kho |
| **UC liên quan** | UC_HT01, UC_HT12 (tiếp nối) |
| **Tiền điều kiện** | Trưởng kho đã đăng nhập. Đến kỳ hạn kiểm kê hoặc có yêu cầu đột xuất. |
| **Hậu điều kiện** | Kế hoạch kiểm kê được tạo, thông báo đến nhân sự được phân công. |

### Dòng sự kiện chính
1. Trưởng kho chọn "Kiểm kê" → "Lập kế hoạch".
2. Nhập thông tin: Kỳ kiểm kê (tháng/quý), Ngày dự kiến thực hiện, Loại kiểm kê (Định kỳ / Đột xuất).
3. Chọn Phạm vi: Toàn kho hoặc chọn nhóm hàng cụ thể.
4. Phân công: Chọn Thủ kho + Kế toán kho từ danh sách nhân viên.
5. Nhấn "Tạo kế hoạch" → Lưu → Hệ thống gửi thông báo đến nhân sự được phân công.

---

## UC_HT12 – Thực hiện kiểm kê & Lập Biên bản

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Thực hiện kiểm kê & Lập Biên bản |
| **Mã Use Case** | UC_HT12 |
| **Tóm tắt** | Thủ kho và Kế toán kho thực hiện nhập kết quả kiểm đếm thực tế vào hệ thống. Hệ thống tự động đối chiếu với số liệu sổ sách, tính chênh lệch và tạo Biên bản kiểm kê. |
| **Tác nhân** | Thủ kho, Kế toán kho |
| **UC liên quan** | UC_HT11 (tiền đề) |
| **Tiền điều kiện** | Có kế hoạch kiểm kê đã được tạo (UC_HT11). Tác nhân đã đăng nhập. |
| **Hậu điều kiện** | Biên bản kiểm kê được lập, tự động tính chênh lệch. Số liệu tồn kho đã/chưa điều chỉnh (tùy Trưởng kho duyệt). |

### Dòng sự kiện chính
1. Tác nhân chọn "Kiểm kê" → "Thực hiện kiểm kê" → Chọn kế hoạch kiểm kê.
2. Hệ thống hiển thị danh sách hàng hóa cần kiểm (theo phạm vi đã lập ở UC_HT11).
3. Hệ thống tự động fill cột "SL sổ sách" từ CSDL tồn kho hiện tại.
4. Tác nhân nhập "SL thực tế" cho từng mặt hàng (từ kết quả kiểm đếm thực tế).
5. **Hệ thống tự động tính:** Chênh lệch = SL thực tế – SL sổ sách → Hiển thị (Thừa/Thiếu/Khớp).
6. Với mặt hàng có chênh lệch, tác nhân nhập: Nguyên nhân chênh lệch (dropdown: Hao hụt tự nhiên / Mất mát / Ghi sổ sai / Khác) + Đề xuất xử lý.
7. Nhấn "Hoàn tất kiểm kê" → Hệ thống tạo Biên bản kiểm kê, gửi Trưởng kho duyệt.
8. Khi Trưởng kho duyệt → **Hệ thống tự động điều chỉnh tồn kho** theo SL thực tế.

### Dòng sự kiện phụ
- **8a.** Trưởng kho từ chối → Ghi lý do → Yêu cầu kiểm tra lại.

---

## UC_HT13 – Xem Báo cáo Nhập–Xuất–Tồn

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Xem Báo cáo Nhập–Xuất–Tồn |
| **Mã Use Case** | UC_HT13 |
| **Tóm tắt** | Hiển thị báo cáo tổng hợp số liệu nhập – xuất – tồn kho theo kỳ (tháng/quý/năm). Hỗ trợ filter, biểu đồ trực quan và xuất PDF. |
| **Tác nhân** | Kế toán kho, Trưởng kho, Ban Giám đốc |
| **UC liên quan** | UC_HT01 |
| **Tiền điều kiện** | Tác nhân đã đăng nhập. Hệ thống có dữ liệu phiếu nhập/xuất/kiểm kê. |
| **Hậu điều kiện** | Báo cáo NXT được hiển thị theo tiêu chí lọc. |

### Dòng sự kiện chính
1. Tác nhân chọn "Báo cáo" → "Báo cáo NXT".
2. Chọn tiêu chí lọc: Kỳ báo cáo (tháng/quý/năm), Nhóm hàng (tất cả hoặc chọn cụ thể), NCC (nếu cần).
3. Nhấn "Xem báo cáo".
4. Hệ thống truy vấn CSDL, tổng hợp: Tồn đầu kỳ + SL nhập trong kỳ – SL xuất trong kỳ ± Điều chỉnh kiểm kê = Tồn cuối kỳ.
5. Hiển thị bảng dữ liệu (chi tiết từng mặt hàng) + Biểu đồ cột (nhập/xuất/tồn).
6. Tác nhân có thể nhấn "Xuất PDF" để tải báo cáo.

---

## UC_HT14 – Xem Báo cáo hàng dưới mức tối thiểu

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Xem Báo cáo hàng dưới mức tối thiểu |
| **Mã Use Case** | UC_HT14 |
| **Tóm tắt** | Hiển thị danh sách hàng hóa có SL tồn kho hiện tại thấp hơn hạn mức tồn tối thiểu đã thiết lập, giúp bộ phận mua hàng chủ động đặt hàng bổ sung. |
| **Tác nhân** | Kế toán kho, Trưởng kho |
| **UC liên quan** | UC_HT01, UC_HT03 (sử dụng hạn mức tồn tối thiểu từ danh mục HH) |
| **Tiền điều kiện** | Tác nhân đã đăng nhập. Hàng hóa đã có thiết lập hạn mức tồn tối thiểu. |
| **Hậu điều kiện** | Danh sách hàng dưới mức tối thiểu được hiển thị. |

### Dòng sự kiện chính
1. Tác nhân chọn "Báo cáo" → "Hàng dưới mức tối thiểu".
2. Hệ thống truy vấn: Tìm tất cả hàng hóa có `SL_ton_hien_tai < Han_muc_ton_toi_thieu`.
3. Hiển thị bảng: Mã hàng, Tên hàng, ĐVT, SL tồn hiện tại, Hạn mức tối thiểu, Mức thiếu hụt, NCC đề xuất.
4. Sắp xếp theo mức thiếu hụt giảm dần (hàng thiếu nhiều nhất lên đầu).
5. Tác nhân có thể "Xuất PDF" hoặc "Gửi email thông báo NV mua hàng".

---

## UC_HT15 – Tra cứu lịch sử Nhập / Xuất

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Tra cứu lịch sử Nhập / Xuất |
| **Mã Use Case** | UC_HT15 |
| **Tóm tắt** | Tra cứu, tìm kiếm và xem chi tiết các phiếu nhập/xuất kho đã thực hiện theo nhiều tiêu chí lọc: theo ngày, NCC, hàng hóa, trạng thái phiếu. |
| **Tác nhân** | Thủ kho, Kế toán kho |
| **UC liên quan** | UC_HT01 |
| **Tiền điều kiện** | Tác nhân đã đăng nhập. |
| **Hậu điều kiện** | Danh sách phiếu phù hợp tiêu chí được hiển thị. |

### Dòng sự kiện chính
1. Tác nhân chọn "Tra cứu lịch sử".
2. Nhập tiêu chí lọc: Loại phiếu (Nhập/Xuất/Tất cả), Từ ngày – Đến ngày, NCC (dropdown), Mã hàng/Tên hàng, Trạng thái (Chờ duyệt / Đã duyệt / Từ chối).
3. Nhấn "Tìm kiếm".
4. Hệ thống hiển thị danh sách phiếu khớp tiêu chí (bảng phân trang).
5. Tác nhân có thể click vào 1 phiếu để xem chi tiết đầy đủ.

---

## UC_HT16 – 🤖 Dự báo nhu cầu tiêu thụ (AI Forecast)

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Dự báo nhu cầu tiêu thụ (AI Forecast) |
| **Mã Use Case** | UC_HT16 |
| **Tóm tắt** | Hệ thống sử dụng trí tuệ nhân tạo (thông qua API Gemini/OpenAI) để phân tích dữ liệu lịch sử xuất kho và dự báo nhu cầu tiêu thụ cho từng mặt hàng trong kỳ tới, hỗ trợ Trưởng kho và Ban GĐ lên kế hoạch nhập hàng chủ động. |
| **Tác nhân** | Trưởng kho, Ban Giám đốc |
| **UC liên quan** | UC_HT01 |
| **Tiền điều kiện** | Tác nhân đã đăng nhập. Hệ thống có dữ liệu xuất kho ít nhất 3 tháng gần nhất cho mặt hàng cần dự báo. |
| **Hậu điều kiện** | Kết quả dự báo được hiển thị dưới dạng biểu đồ và bảng số liệu. Kết quả được lưu vào CSDL để theo dõi độ chính xác. |

### Dòng sự kiện chính
1. Tác nhân chọn menu "AI" → "Dự báo nhu cầu tiêu thụ".
2. Chọn mặt hàng cần dự báo (hoặc chọn "Tất cả nhóm hàng").
3. Chọn kỳ dự báo: Tuần tới / Tháng tới / Quý tới.
4. Nhấn "Phân tích & Dự báo".
5. Hệ thống thu thập dữ liệu lịch sử xuất kho (SL xuất theo ngày/tuần/tháng).
6. Hệ thống tạo prompt phân tích và gửi đến API AI (Gemini/OpenAI).
7. API trả về: `predicted_quantity` (SL dự báo), `confidence_score` (độ tin cậy %), `reasoning` (giải thích).
8. Hệ thống hiển thị:
   - **Biểu đồ đường (Line chart):** Lịch sử xuất kho (thực tế) + Đường dự báo (tương lai).
   - **Bảng số liệu:** Mặt hàng, SL dự báo, Độ tin cậy, SL tồn hiện tại, SL cần nhập bổ sung.
   - **Lời khuyên AI:** Mô tả xu hướng và đề xuất hành động.
9. Hệ thống lưu kết quả dự báo vào CSDL (để sau này đối chiếu độ chính xác).

### Dòng sự kiện phụ
- **5a.** Không đủ dữ liệu (< 3 tháng) → Hệ thống thông báo "Chưa đủ dữ liệu để dự báo. Cần ít nhất 3 tháng lịch sử xuất kho." → Kết thúc.
- **6a.** API AI bị lỗi/timeout → Hệ thống thông báo "Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau." → Kết thúc.

---

## UC_HT17 – 🤖 Cảnh báo tồn kho thông minh (AI Smart Alert)

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Cảnh báo tồn kho thông minh (AI Smart Alert) |
| **Mã Use Case** | UC_HT17 |
| **Tóm tắt** | Hệ thống AI phân tích tổng thể dữ liệu kho và tự động đưa ra các cảnh báo có ngữ cảnh: hàng sắp hết, hàng tồn lâu, xu hướng bất thường. Các cảnh báo được hiển thị trên Dashboard và có thể gửi email thông báo. |
| **Tác nhân** | Trưởng kho, Thủ kho |
| **UC liên quan** | UC_HT01 |
| **Tiền điều kiện** | Tác nhân đã đăng nhập. Hệ thống có dữ liệu tồn kho và lịch sử giao dịch. |
| **Hậu điều kiện** | Danh sách cảnh báo được hiển thị, mỗi cảnh báo có mức độ ưu tiên và đề xuất hành động. |

### Dòng sự kiện chính
1. Tác nhân chọn "AI" → "Cảnh báo thông minh" (hoặc xem trực tiếp trên Dashboard).
2. Hệ thống tổng hợp dữ liệu: Tồn kho hiện tại, Hạn mức tối thiểu, Lịch sử nhập/xuất 6 tháng, Tần suất xuất theo mặt hàng.
3. Hệ thống gửi dữ liệu tổng hợp đến API AI.
4. API AI phân tích và trả về danh sách cảnh báo (JSON):
   - 🔴 **Cảnh báo cấp cao:** Hàng sắp hết (dưới mức tối thiểu) + SL đề xuất đặt.
   - 🟡 **Cảnh báo trung bình:** Hàng tồn kho lâu không xuất (> 90 ngày) + đề xuất thanh lý/giảm giá.
   - 🟠 **Cảnh báo bất thường:** Phát hiện xuất kho tăng đột biến / giá nhập tăng bất thường.
5. Hệ thống hiển thị danh sách cảnh báo theo mức độ ưu tiên (cấp cao → trung bình).
6. Mỗi cảnh báo có: Mã hàng, Tên hàng, Mô tả cảnh báo, Lời khuyên AI, Nút hành động (ví dụ: "Tạo Phiếu đề nghị nhập bổ sung").

### Dòng sự kiện phụ
- **3a.** API AI không khả dụng → Hệ thống fallback về logic cảnh báo đơn giản (chỉ so sánh SL tồn vs hạn mức, không có phân tích xu hướng).
