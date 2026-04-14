1. Đặc tả Usecase: Lập phiếu nhập kho (Luồng nghiệp vụ lõi)
Actor chính: Thủ kho.

Mô tả tóm tắt: Thủ kho tạo một phiếu ghi nhận hàng hóa chuẩn bị nhập vào kho.

Tiền điều kiện: Thủ kho đã đăng nhập vào ứng dụng thành công.

Luồng sự kiện chính (Basic Flow):

Thủ kho chọn chức năng "Lập phiếu nhập kho" trên giao diện.

Hệ thống hiển thị form tạo phiếu mới (gồm mã phiếu tự tạo, ngày lập, người lập).

Thủ kho chọn Nhà cung cấp từ danh sách.

Thủ kho tìm kiếm và chọn các mặt hàng cần nhập, điền số lượng và đơn giá nhập.

Hệ thống tự động tính thành tiền cho từng dòng và tổng tiền của toàn bộ phiếu.

Thủ kho nhấn nút "Lưu phiếu".

Hệ thống lưu phiếu vào cơ sở dữ liệu với trạng thái là "Chờ phê duyệt".

Hệ thống thông báo tạo phiếu thành công.

Luồng ngoại lệ (Alternative Flow):

Bước 4: Nếu Thủ kho nhập số lượng là số âm hoặc chữ, hệ thống báo lỗi validation và yêu cầu nhập lại.

Hậu điều kiện: Một phiếu nhập kho mới được tạo ra và chờ Trưởng kho duyệt. Số lượng tồn kho thực tế chưa thay đổi.

2. Đặc tả Usecase: Phê duyệt phiếu nhập/xuất kho (Luồng tương tác & Include)
Actor chính: Trưởng kho.

Mô tả tóm tắt: Trưởng kho kiểm tra và quyết định thông qua hoặc từ chối phiếu do Thủ kho lập.

Tiền điều kiện: Trưởng kho đã đăng nhập. Tồn tại ít nhất một phiếu ở trạng thái "Chờ phê duyệt" (Đảm bảo logic <<include>>).

Luồng sự kiện chính:

Trưởng kho chọn chức năng "Phê duyệt phiếu".

Hệ thống hiển thị danh sách các phiếu đang "Chờ phê duyệt".

Trưởng kho chọn một phiếu để xem chi tiết (các mặt hàng, số lượng, tổng tiền).

Trưởng kho nhấn nút "Phê duyệt".

Hệ thống cập nhật trạng thái phiếu thành "Đã duyệt".

Hệ thống tự động cộng (nếu là phiếu nhập) hoặc trừ (nếu là phiếu xuất) số lượng tương ứng vào bảng Tồn kho.

Hệ thống hiển thị thông báo thành công.

Luồng thay thế:

Bước 4: Trưởng kho chọn "Từ chối". Hệ thống yêu cầu nhập lý do. Trạng thái phiếu đổi thành "Đã hủy/Từ chối" và tồn kho giữ nguyên.

Hậu điều kiện: Phiếu thay đổi trạng thái. Số lượng hàng hóa trong kho được cập nhật chính thức.

3. Đặc tả Usecase: Dự đoán số lượng hàng hóa (Luồng AI / Xử lý Dữ liệu)
Đây là Usecase "ăn tiền", t thiết kế theo hướng tận dụng thuật toán phân loại và dữ liệu để hợp với tư duy làm Data/AI.

Actor chính: Trưởng kho.

Actor phụ: Hệ thống (System).

Mô tả tóm tắt: Hệ thống phân tích dữ liệu lịch sử xuất/nhập để dự báo các mặt hàng có nguy cơ cạn kiệt, hỗ trợ Trưởng kho lập kế hoạch nhập hàng.

Tiền điều kiện: Hệ thống đã có đủ dữ liệu lịch sử giao dịch (phiếu xuất, phiếu nhập) trong một khoảng thời gian nhất định (ví dụ: 3 tháng).

Luồng sự kiện chính:

Trong lúc đang ở màn hình "Lập kế hoạch", Trưởng kho chọn chức năng "Dự báo thông minh".

Web gửi request yêu cầu phân tích dữ liệu xuống backend.

Hệ thống trích xuất dữ liệu lịch sử bán hàng và tồn kho hiện tại.

Hệ thống chạy mô hình máy học (ví dụ: áp dụng thuật toán cây quyết định phân loại mức độ thiếu hụt, hoặc thuật toán hồi quy) để tính toán sức mua và dự đoán số lượng tồn kho trong tháng tới.

Hệ thống trả về danh sách các sản phẩm có "Nguy cơ hết hàng cao", kèm theo "Số lượng đề xuất nhập".

Trưởng kho xem xét danh sách và chọn các mặt hàng đồng ý nhập.

Hệ thống tự động đẩy các mặt hàng đã chọn vào bản nháp của "Kế hoạch nhập hàng".

Luồng ngoại lệ:

Bước 3: Hệ thống báo lỗi "Dữ liệu lịch sử không đủ để chạy dự báo" nếu số lượng giao dịch quá ít.

Hậu điều kiện: Trưởng kho có được một bản kế hoạch nhập hàng sơ bộ dựa trên số liệu thực tế.

4. Đặc tả Usecase: Quản lý hàng hóa (Đại diện luồng Thêm Mới - Create)
Actor chính: Thủ kho.

Mô tả tóm tắt: Thủ kho thêm một mã hàng hóa mới vào danh mục hệ thống.

Tiền điều kiện: Thủ kho đã đăng nhập.

Luồng sự kiện chính:

Thủ kho chọn "Quản lý hàng hóa" -> Nhấn "Thêm mới".

Hệ thống hiển thị form nhập liệu (Mã SP, Tên SP, Đơn vị tính, Danh mục...).

Thủ kho điền đầy đủ thông tin và chọn ảnh sản phẩm (nếu có).

Thủ kho nhấn "Lưu".

Hệ thống kiểm tra tính hợp lệ (validate) của dữ liệu (VD: Mã SP không được trùng).

Hệ thống lưu thông tin vào cơ sở dữ liệu.

Hệ thống làm mới danh sách hàng hóa và thông báo thành công.

Ngoại lệ:

Bước 5: Nếu Mã SP đã tồn tại, hệ thống báo lỗi "Mã sản phẩm đã trùng lặp" và giữ nguyên form nhập liệu.