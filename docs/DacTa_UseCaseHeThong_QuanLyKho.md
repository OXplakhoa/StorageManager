1. Đặc tả Use Case: Kiểm kê hàng hóa
Tên Use Case: Kiểm kê hàng hóa.

Actor: Thủ kho (người thực hiện đếm), Trưởng kho (người giám sát/chủ trì).

Mô tả: Cho phép Thủ kho và Trưởng kho ghi nhận số lượng hàng hóa thực tế có trong kho để đối chiếu với số liệu đang lưu trên hệ thống.

Tiền điều kiện: Người dùng đã đăng nhập vào hệ thống.

Luồng sự kiện chính:

Người dùng chọn chức năng "Kiểm kê hàng hóa".

Hệ thống hiển thị màn hình tạo kỳ kiểm kê mới, tự động lấy danh sách hàng hóa và số lượng tồn kho hiện tại trên hệ thống.

Người dùng tiến hành đếm và nhập "Số lượng thực tế" cho từng mặt hàng vào form.

Người dùng nhấn "Lưu kết quả kiểm kê".

Hệ thống tính toán độ lệch (Số lượng thực tế - Số lượng hệ thống).

Hệ thống lưu lại biên bản kiểm kê và thông báo thành công.

Luồng mở rộng (Dựa trên <<extend>> Báo cáo chênh lệch):

Tại bước 5: Nếu hệ thống phát hiện có sự chênh lệch số liệu giữa thực tế và hệ thống, Use Case mở rộng "Báo cáo chênh lệch" được kích hoạt. Hệ thống tự động trích xuất danh sách các mặt hàng bị lệch, tạo thành một báo cáo riêng và gửi thông báo đến Kế toán để xử lý.

Hậu điều kiện: Biên bản kiểm kê được lưu trữ.

2. Đặc tả Use Case: Lập phiếu nhập kho
Tên Use Case: Lập phiếu nhập kho.

Actor: Thủ kho.

Mô tả: Thủ kho tạo một phiếu chứng từ để ghi nhận việc hàng hóa được đưa từ nhà cung cấp vào kho.

Tiền điều kiện: Thủ kho đã đăng nhập.

Luồng sự kiện chính:

Thủ kho chọn chức năng "Lập phiếu nhập kho".

Hệ thống hiển thị form tạo phiếu mới.

Thủ kho chọn thông tin Nhà cung cấp từ danh sách.

Thủ kho tìm kiếm, chọn các mặt hàng cần nhập và nhập số lượng, đơn giá thực tế.

Hệ thống tự động tính thành tiền cho từng dòng và tổng tiền của phiếu.

Thủ kho nhấn nút "Lưu và Gửi duyệt".

Hệ thống lưu phiếu vào cơ sở dữ liệu với trạng thái "Chờ phê duyệt".

Hệ thống thông báo tạo phiếu thành công.

Luồng ngoại lệ:

Tại bước 4: Nếu Thủ kho để trống số lượng hoặc nhập số âm, hệ thống báo lỗi và yêu cầu nhập lại hợp lệ.

Hậu điều kiện: Phiếu nhập kho được tạo. Lưu ý: Tồn kho thực tế chưa tăng lên cho đến khi phiếu được phê duyệt.

3. Đặc tả Use Case: Phê duyệt xuất/nhập kho
Tên Use Case: Phê duyệt xuất/nhập kho.

Actor: Trưởng kho.

Mô tả: Trưởng kho kiểm tra tính hợp lệ của các phiếu nhập/xuất do Thủ kho lập và quyết định thông qua để chính thức cập nhật tồn kho.

Tiền điều kiện (<<include>>): Trưởng kho đã đăng nhập. Phải tồn tại ít nhất một phiếu nhập hoặc phiếu xuất ở trạng thái "Chờ phê duyệt" (Phải thực hiện xong U-C Lập phiếu).

Luồng sự kiện chính:

Trưởng kho chọn chức năng "Phê duyệt phiếu".

Hệ thống hiển thị danh sách các phiếu (nhập/xuất) đang chờ duyệt.

Trưởng kho chọn một phiếu để xem chi tiết thông tin đối chiếu.

Trưởng kho nhấn "Phê duyệt".

Hệ thống cập nhật trạng thái phiếu thành "Đã duyệt".

Hệ thống tự động thực hiện giao dịch: Cộng số lượng vào tồn kho (nếu là phiếu nhập) hoặc trừ số lượng khỏi tồn kho (nếu là phiếu xuất).

Hệ thống thông báo phê duyệt thành công.

Luồng thay thế:

Tại bước 4: Trưởng kho chọn "Từ chối" và nhập lý do. Hệ thống đổi trạng thái phiếu thành "Đã từ chối", số lượng tồn kho giữ nguyên không đổi.

Hậu điều kiện: Trạng thái phiếu được cập nhật. Số lượng hàng hóa trong kho được thay đổi chính thức.

4. Đặc tả Use Case: Xem báo cáo nhập/xuất kho
Tên Use Case: Xem báo cáo nhập/xuất kho.

Actor: Ban giám đốc.

Mô tả: Cung cấp cho Ban giám đốc các số liệu thống kê tổng quan về tình hình luân chuyển hàng hóa trong kho.

Tiền điều kiện: Ban giám đốc đã đăng nhập tài khoản hợp lệ.

Luồng sự kiện chính:

Ban giám đốc chọn chức năng "Xem báo cáo nhập/xuất".

Hệ thống hiển thị giao diện bộ lọc thời gian (Từ ngày... Đến ngày...) và loại báo cáo (Báo cáo nhập, Báo cáo xuất, Tồn kho hiện tại).

Ban giám đốc chọn tham số và nhấn "Xem".

Hệ thống truy vấn cơ sở dữ liệu, tổng hợp số liệu dựa trên các phiếu đã được phê duyệt.

Hệ thống hiển thị kết quả dưới dạng bảng biểu và biểu đồ thống kê.

Hậu điều kiện: Hệ thống giữ nguyên trạng thái, không thay đổi dữ liệu.

5. Đặc tả Use Case: Nhóm CRUD Quản lý hàng hóa (Đại diện 2 luồng)
Vì U-C m ghi là <<CRUD>> Quản lý hàng hóa, trong đặc tả thực tế mình phải chẻ ra tối thiểu là Thêm mới và Cập nhật để thầy cô thấy được logic.

5.1. Đặc tả luồng: Thêm mới hàng hóa (Create)

Actor: Thủ kho.

Mô tả: Thêm một danh mục sản phẩm mới hoàn toàn vào hệ thống.

Luồng sự kiện chính:

Thủ kho vào "Quản lý hàng hóa", nhấn "Thêm mới".

Hệ thống hiển thị form điền thông tin (Mã hàng, Tên hàng, Đơn vị tính, Quy cách...).

Thủ kho điền đầy đủ dữ liệu hợp lệ và nhấn "Lưu".

Hệ thống kiểm tra trùng lặp Mã hàng. Nếu hợp lệ, lưu vào cơ sở dữ liệu với số lượng tồn kho mặc định ban đầu là 0.

Hệ thống thông báo thêm thành công và cập nhật lại danh sách.

5.2. Đặc tả luồng: Cập nhật thông tin hàng hóa (Update)

Actor: Thủ kho.

Mô tả: Sửa đổi các thông tin cơ bản của một mặt hàng đã có sẵn (Ví dụ: sửa tên, đổi đơn vị tính). Lưu ý: Không được sửa số lượng tồn kho tại đây.

Luồng sự kiện chính:

Thủ kho tìm kiếm và chọn một mặt hàng trong danh sách, nhấn "Chỉnh sửa".

Hệ thống hiển thị form chứa thông tin hiện tại của mặt hàng.

Thủ kho sửa đổi các trường thông tin cho phép và nhấn "Cập nhật".

Hệ thống lưu các thay đổi đè lên bản ghi cũ trong cơ sở dữ liệu.

Hệ thống thông báo cập nhật thành công.