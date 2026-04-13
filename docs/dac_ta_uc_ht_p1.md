# Đặc tả Use Case Hệ thống – HTTT Quản lý Kho hàng (Phần 1/2)

> Tài liệu này chứa đặc tả chi tiết cho UC_HT01 → UC_HT09.  
> Phần 2 (UC_HT10 → UC_HT17) xem tại [`dac_ta_uc_ht_p2.md`](file:///Users/khoado/code/PTTKHT/docs/dac_ta_uc_ht_p2.md)

---

## UC_HT01 – Đăng nhập / Phân quyền

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Đăng nhập / Phân quyền |
| **Mã Use Case** | UC_HT01 |
| **Tóm tắt** | Người dùng đăng nhập vào hệ thống bằng tài khoản được cấp. Hệ thống xác thực và phân quyền chức năng tương ứng với vai trò (Thủ kho, Trưởng kho, Kế toán kho, Bộ phận yêu cầu, Ban GĐ). |
| **Tác nhân** | Tất cả: Thủ kho, Trưởng kho, Kế toán kho, Bộ phận yêu cầu, Ban Giám đốc |
| **UC liên quan** | Không có |
| **Tiền điều kiện** | Người dùng đã được Admin tạo tài khoản trong hệ thống với vai trò xác định. |
| **Hậu điều kiện** | Người dùng đăng nhập thành công, hệ thống hiển thị giao diện tương ứng vai trò; hoặc hiển thị thông báo lỗi nếu sai thông tin. |

### Dòng sự kiện chính
1. Người dùng truy cập trang đăng nhập của hệ thống.
2. Người dùng nhập Tên đăng nhập và Mật khẩu.
3. Người dùng nhấn nút "Đăng nhập".
4. Hệ thống xác thực thông tin đăng nhập với CSDL.
5. Hệ thống xác định vai trò (role) của người dùng.
6. Hệ thống chuyển hướng người dùng đến trang Dashboard tương ứng vai trò, hiển thị menu chức năng đã phân quyền.

### Dòng sự kiện phụ
- **4a.** Sai tên đăng nhập hoặc mật khẩu → Hệ thống hiển thị thông báo "Tên đăng nhập hoặc mật khẩu không đúng" → Quay lại bước 2.
- **4b.** Tài khoản bị khóa (quá 5 lần sai liên tiếp) → Hệ thống hiển thị thông báo "Tài khoản đã bị khóa. Liên hệ quản trị viên." → Kết thúc.

---

## UC_HT02 – Quản lý danh mục Nhà cung cấp

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Quản lý danh mục Nhà cung cấp |
| **Mã Use Case** | UC_HT02 |
| **Tóm tắt** | Kế toán kho thực hiện các thao tác CRUD (Thêm / Xem / Sửa / Vô hiệu hóa) đối với danh mục nhà cung cấp trên hệ thống. |
| **Tác nhân** | Kế toán kho |
| **UC liên quan** | UC_HT01 (tiền đề: phải đăng nhập) |
| **Tiền điều kiện** | Kế toán kho đã đăng nhập thành công (UC_HT01) với vai trò "Kế toán kho". |
| **Hậu điều kiện** | Thông tin NCC được thêm mới / cập nhật / vô hiệu hóa thành công trong CSDL. |

### Dòng sự kiện chính (Thêm mới NCC)
1. Kế toán kho chọn menu "Quản lý Nhà cung cấp".
2. Hệ thống hiển thị danh sách NCC hiện có (bảng dữ liệu có phân trang, tìm kiếm).
3. Kế toán kho nhấn nút "Thêm NCC mới".
4. Hệ thống hiển thị form nhập thông tin: Mã NCC (tự sinh), Tên NCC, Địa chỉ, SĐT, Email, Mã số thuế.
5. Kế toán kho nhập đầy đủ thông tin và nhấn "Lưu".
6. Hệ thống kiểm tra tính hợp lệ (validate) và kiểm tra trùng lặp (tên NCC, MST).
7. Hệ thống lưu NCC mới vào CSDL và hiển thị thông báo "Thêm NCC thành công".
8. Danh sách NCC được cập nhật tự động.

### Dòng sự kiện phụ
- **6a.** Thông tin bắt buộc bị bỏ trống → Hệ thống highlight trường lỗi + thông báo "Vui lòng nhập đầy đủ thông tin" → Quay lại bước 5.
- **6b.** Phát hiện trùng lặp (MST đã tồn tại) → Hệ thống thông báo "NCC với MST này đã tồn tại" → Quay lại bước 5.
- **Sửa NCC:** Người dùng chọn NCC từ danh sách → nhấn "Sửa" → Form hiển thị với dữ liệu hiện tại → Chỉnh sửa → Lưu → Validate → Cập nhật CSDL.
- **Vô hiệu hóa NCC:** Chọn NCC → nhấn "Vô hiệu hóa" → Hệ thống đánh dấu trạng thái "Ngừng hợp tác" (không xóa vĩnh viễn để bảo toàn lịch sử giao dịch).

---

## UC_HT03 – Quản lý danh mục Hàng hóa

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Quản lý danh mục Hàng hóa |
| **Mã Use Case** | UC_HT03 |
| **Tóm tắt** | Kế toán kho hoặc Thủ kho thực hiện CRUD đối với danh mục hàng hóa, bao gồm: thông tin mã hàng, tên, đơn vị tính, quy cách, nhóm hàng, hạn mức tồn kho tối thiểu. |
| **Tác nhân** | Kế toán kho, Thủ kho |
| **UC liên quan** | UC_HT01 |
| **Tiền điều kiện** | Tác nhân đã đăng nhập thành công. |
| **Hậu điều kiện** | Danh mục hàng hóa được cập nhật chính xác trong CSDL. |

### Dòng sự kiện chính (Thêm mới Hàng hóa)
1. Tác nhân chọn menu "Quản lý Hàng hóa".
2. Hệ thống hiển thị danh sách hàng hóa (có filter theo nhóm hàng, tìm kiếm, phân trang).
3. Tác nhân nhấn "Thêm Hàng hóa mới".
4. Hệ thống hiển thị form: Mã hàng (tự sinh), Tên hàng, Đơn vị tính (dropdown), Quy cách đóng gói, Nhóm hàng (dropdown), Hạn mức tồn tối thiểu, Trạng thái (mặc định: Hoạt động).
5. Tác nhân nhập thông tin và nhấn "Lưu".
6. Hệ thống validate + kiểm tra trùng lặp (tên hàng + ĐVT) → Lưu vào CSDL.
7. Hiển thị thông báo thành công.

### Dòng sự kiện phụ
- **6a.** Validate lỗi → Thông báo → Quay lại bước 5.
- **Sửa / Vô hiệu hóa:** Tương tự UC_HT02 (đánh dấu "Ngừng kinh doanh" thay vì xóa).

---

## UC_HT04 – Lập Phiếu nhập kho

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Lập Phiếu nhập kho |
| **Mã Use Case** | UC_HT04 |
| **Tóm tắt** | Thủ kho lập phiếu nhập kho trên hệ thống sau khi tiếp nhận hàng hóa từ NCC, ghi nhận đầy đủ thông tin chứng từ, danh sách hàng và số liệu nhập. Hệ thống tự động <<include>> kiểm tra hàng hóa (UC_HT09). |
| **Tác nhân** | Thủ kho |
| **UC liên quan** | UC_HT01 (tiền đề), UC_HT09 (<<include>>), UC_HT10 (<<extend>>) |
| **Tiền điều kiện** | Thủ kho đã đăng nhập. Hàng hóa đã được tiếp nhận vật lý. NCC và Hàng hóa đã tồn tại trong danh mục (UC_HT02, UC_HT03). |
| **Hậu điều kiện** | Phiếu nhập kho được tạo với trạng thái "Chờ duyệt". Số liệu tồn kho **chưa** được cập nhật (chờ Trưởng kho duyệt ở UC_HT05). |

### Dòng sự kiện chính
1. Thủ kho chọn menu "Nhập kho" → "Lập Phiếu nhập kho".
2. Hệ thống tự sinh Số phiếu (NK-YYYYMMDD-XXX) và ngày nhập (mặc định hôm nay).
3. Thủ kho chọn Nhà cung cấp từ dropdown (dữ liệu từ danh mục NCC).
4. Thủ kho nhập Số hóa đơn mua hàng.
5. Thủ kho thêm từng dòng chi tiết hàng:
   - Chọn Mã hàng / Tên hàng từ dropdown (dữ liệu từ danh mục Hàng hóa).
   - Hệ thống tự điền ĐVT theo mã hàng đã chọn.
   - Nhập SL đặt, SL thực nhận, Đơn giá.
   - **<<include>> UC_HT09**: Hệ thống tự động đối chiếu SL đặt vs SL thực nhận.
   - Hệ thống tự tính Thành tiền = SL thực nhận × Đơn giá.
6. Thủ kho nhập Ghi chú (nếu có).
7. Thủ kho nhấn "Lưu Phiếu".
8. Hệ thống validate toàn bộ → Lưu phiếu với trạng thái "Chờ duyệt".
9. Hệ thống gửi thông báo đến Trưởng kho (có phiếu mới chờ duyệt).

### Dòng sự kiện phụ
- **5a. (<<extend>> UC_HT10):** Nếu UC_HT09 phát hiện SL thực nhận ≠ SL đặt hoặc ghi chú hàng lỗi → Hệ thống hiển thị cảnh báo → Thủ kho có thể tạo Biên bản chênh lệch (UC_HT10).
- **8a.** Dữ liệu thiếu/sai → Validate lỗi → Highlight trường lỗi → Quay lại bước tương ứng.

---

## UC_HT05 – Phê duyệt Phiếu nhập kho

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Phê duyệt Phiếu nhập kho |
| **Mã Use Case** | UC_HT05 |
| **Tóm tắt** | Trưởng kho xem xét và phê duyệt (hoặc từ chối) phiếu nhập kho do Thủ kho lập. Khi duyệt, hệ thống tự động cập nhật số liệu tồn kho. |
| **Tác nhân** | Trưởng kho |
| **UC liên quan** | UC_HT01, UC_HT04 |
| **Tiền điều kiện** | Trưởng kho đã đăng nhập. Có ít nhất 1 phiếu nhập kho ở trạng thái "Chờ duyệt". |
| **Hậu điều kiện** | Phiếu được chuyển sang trạng thái "Đã duyệt" (và tồn kho cộng thêm) hoặc "Từ chối" (kèm lý do). |

### Dòng sự kiện chính
1. Trưởng kho chọn menu "Phê duyệt" → Hệ thống hiển thị danh sách phiếu "Chờ duyệt".
2. Trưởng kho chọn một phiếu nhập kho để xem chi tiết.
3. Hệ thống hiển thị toàn bộ thông tin phiếu (NCC, Số HĐ, danh sách hàng, SL, giá, tổng tiền).
4. Trưởng kho đối chiếu với hóa đơn gốc (bên ngoài hệ thống).
5. Trưởng kho nhấn "Phê duyệt".
6. Hệ thống chuyển trạng thái phiếu thành "Đã duyệt", ghi nhận người duyệt và thời gian duyệt.
7. **Hệ thống tự động cộng SL thực nhận vào tồn kho** cho từng mặt hàng trong phiếu.
8. Hệ thống ghi log vào Thẻ kho (lịch sử giao dịch).
9. Hệ thống gửi thông báo cho Thủ kho: "Phiếu NK-xxx đã được duyệt".

### Dòng sự kiện phụ
- **5a.** Trưởng kho nhấn "Từ chối" → Nhập lý do từ chối → Hệ thống chuyển trạng thái "Từ chối" → Gửi thông báo cho Thủ kho kèm lý do → Thủ kho có thể sửa lại phiếu và trình duyệt lại.

---

## UC_HT06 – Lập Phiếu đề nghị xuất kho

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Lập Phiếu đề nghị xuất kho |
| **Mã Use Case** | UC_HT06 |
| **Tóm tắt** | Bộ phận yêu cầu (KD/SX) lập phiếu đề nghị xuất kho trên hệ thống, nêu rõ hàng hóa cần, số lượng và mục đích sử dụng, gửi cho Trưởng kho phê duyệt trước khi Thủ kho thực hiện xuất. |
| **Tác nhân** | Bộ phận yêu cầu |
| **UC liên quan** | UC_HT01, UC_HT07 (sau khi duyệt) |
| **Tiền điều kiện** | Bộ phận yêu cầu đã đăng nhập. Hàng hóa cần xuất đã tồn tại trong danh mục. |
| **Hậu điều kiện** | Phiếu đề nghị xuất kho được tạo với trạng thái "Chờ duyệt". |

### Dòng sự kiện chính
1. Người dùng chọn "Xuất kho" → "Lập Phiếu đề nghị".
2. Hệ thống tự sinh Số phiếu (DN-YYYYMMDD-XXX) và ngày lập.
3. Người dùng nhập Mục đích sử dụng (dropdown: Sản xuất / Bán hàng / Nội bộ / Khác).
4. Người dùng thêm từng dòng chi tiết:
   - Chọn Mã hàng / Tên hàng (hệ thống hiển thị SL tồn hiện tại).
   - Nhập SL yêu cầu.
   - Hệ thống cảnh báo nếu SL yêu cầu > SL tồn hiện tại.
5. Nhấn "Gửi phê duyệt" → Hệ thống lưu phiếu "Chờ duyệt" → Thông báo Trưởng kho.

### Dòng sự kiện phụ
- **4a.** SL yêu cầu > SL tồn → Hệ thống hiển thị cảnh báo nhưng vẫn cho phép gửi (Trưởng kho sẽ quyết định).

---

## UC_HT07 – Lập Phiếu xuất kho

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Lập Phiếu xuất kho |
| **Mã Use Case** | UC_HT07 |
| **Tóm tắt** | Sau khi Phiếu đề nghị xuất kho được Trưởng kho duyệt, Thủ kho lập Phiếu xuất kho chính thức trên hệ thống, ghi nhận SL thực xuất. Hệ thống <<include>> kiểm tra hàng hóa (UC_HT09). |
| **Tác nhân** | Thủ kho |
| **UC liên quan** | UC_HT01, UC_HT06 (tiền đề), UC_HT08 (hậu), UC_HT09 (<<include>>) |
| **Tiền điều kiện** | Có Phiếu đề nghị đã được duyệt. Thủ kho đã đăng nhập. |
| **Hậu điều kiện** | Phiếu xuất kho được tạo trạng thái "Chờ duyệt". |

### Dòng sự kiện chính
1. Thủ kho chọn "Xuất kho" → "Lập Phiếu xuất".
2. Hệ thống hiển thị danh sách Phiếu đề nghị đã duyệt (chưa tạo phiếu xuất).
3. Thủ kho chọn Phiếu đề nghị → Hệ thống tự fill thông tin (Bộ phận nhận, danh sách hàng, SL yêu cầu).
4. Hệ thống tự sinh Số phiếu (XK-YYYYMMDD-XXX), ngày xuất.
5. Thủ kho nhập SL thực xuất cho từng mặt hàng.
   - **<<include>> UC_HT09**: Hệ thống tự động kiểm tra SL tồn hiện tại ≥ SL thực xuất.
6. Nhấn "Lưu Phiếu" → Validate → Lưu trạng thái "Chờ duyệt" → Thông báo Trưởng kho.

### Dòng sự kiện phụ
- **5a.** SL tồn < SL thực xuất → Hệ thống block và thông báo "Không đủ hàng. Tồn kho hiện tại: X" → Không cho phép lưu.

---

## UC_HT08 – Phê duyệt Phiếu xuất kho

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Phê duyệt Phiếu xuất kho |
| **Mã Use Case** | UC_HT08 |
| **Tóm tắt** | Trưởng kho phê duyệt hoặc từ chối phiếu xuất kho. Khi duyệt, hệ thống tự động trừ tồn kho. |
| **Tác nhân** | Trưởng kho |
| **UC liên quan** | UC_HT01, UC_HT07 |
| **Tiền điều kiện** | Trưởng kho đã đăng nhập. Có phiếu xuất trạng thái "Chờ duyệt". |
| **Hậu điều kiện** | Phiếu "Đã duyệt" → tồn kho tự động trừ; hoặc "Từ chối" kèm lý do. |

### Dòng sự kiện chính
1. Trưởng kho chọn "Phê duyệt" → Xem danh sách phiếu xuất chờ duyệt.
2. Chọn phiếu → Xem chi tiết (Bộ phận nhận, hàng, SL yêu cầu, SL thực xuất, tồn kho hiện tại).
3. Nhấn "Phê duyệt".
4. Hệ thống chuyển trạng thái "Đã duyệt" + ghi nhận người duyệt, thời gian.
5. **Hệ thống tự động trừ SL thực xuất khỏi tồn kho** cho từng mặt hàng.
6. Ghi log vào Thẻ kho. Thông báo Thủ kho.

### Dòng sự kiện phụ
- **3a.** Từ chối → Nhập lý do → Thông báo Thủ kho.

---

## UC_HT09 – Kiểm tra hàng hóa (Tự động đối chiếu)

| Thông tin | Nội dung |
|---|---|
| **Tên Use Case** | Kiểm tra hàng hóa (Tự động đối chiếu) |
| **Mã Use Case** | UC_HT09 |
| **Tóm tắt** | Chức năng hệ thống tự động thực hiện đối chiếu số liệu khi nhập/xuất kho: so sánh SL đặt vs SL thực nhận (nhập), hoặc SL yêu cầu vs SL tồn kho (xuất). Đây là UC <<include>> được gọi tự động bởi UC_HT04 và UC_HT07. |
| **Tác nhân** | Thủ kho (gián tiếp – qua UC_HT04 hoặc UC_HT07) |
| **UC liên quan** | UC_HT04 (gọi khi nhập), UC_HT07 (gọi khi xuất) |
| **Tiền điều kiện** | Đang trong quá trình lập phiếu nhập hoặc phiếu xuất. |
| **Hậu điều kiện** | Kết quả đối chiếu được hiển thị cho người dùng (khớp / chênh lệch / không đủ hàng). |

### Dòng sự kiện chính
1. Hệ thống nhận dữ liệu đầu vào từ UC gọi (UC_HT04 hoặc UC_HT07).
2. **Trường hợp Nhập kho (từ UC_HT04):**
   - Hệ thống so sánh SL đặt và SL thực nhận cho từng dòng hàng.
   - Nếu SL đặt = SL thực nhận → Đánh dấu ✅ "Khớp".
   - Nếu SL đặt ≠ SL thực nhận → Đánh dấu ⚠️ "Chênh lệch" + tính toán mức chênh.
3. **Trường hợp Xuất kho (từ UC_HT07):**
   - Hệ thống tra cứu SL tồn kho hiện tại cho từng mặt hàng.
   - Nếu SL tồn ≥ SL thực xuất → Đánh dấu ✅ "Đủ hàng".
   - Nếu SL tồn < SL thực xuất → Đánh dấu ❌ "Không đủ hàng" + hiển thị SL tồn hiện tại.
4. Hệ thống trả kết quả kiểm tra về UC gốc để hiển thị cho người dùng.
