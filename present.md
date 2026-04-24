# 📖 Kịch Bản & Cẩm Nang Bảo Vệ Đồ Án Quản Lý Kho Minh Phát

Tài liệu này được biên soạn để giúp bạn nắm vững 100% ngữ cảnh nghiệp vụ, sự liên kết hệ thống, cấu trúc cơ sở dữ liệu và cách trình bày trôi chảy trước Hội đồng / Giáo viên.

---

## 1️⃣ Bối cảnh Nhập/Xuất của Công ty Minh Phát
Công ty Minh Phát trong đồ án của chúng ta hoạt động với tư cách là một *Nhà Phân Phối Kép* (Vừa phân phối hàng tiêu dùng nhanh - FMCG, vừa phân phối vật tư xây dựng).

- **Nhập kho (Inbound):** Là quá trình công ty mua sỉ hàng hóa từ các tập đoàn lớn (Unilever, Vinamilk, Thép Hòa Phát...) mang về cất trữ tại kho của mình. Quá trình này làm **TĂNG** tài sản tồn kho.
- **Xuất kho (Outbound):** Là quá trình xuất hàng ra khỏi kho để giao cho khách hàng (các siêu thị mini, tiệm tạp hóa) hoặc giao đến các công trình xây dựng. Yêu cầu xuất này thường xuất phát từ phòng Kinh doanh (khi chốt được hợp đồng). Quá trình này làm **GIẢM** tồn kho.
- **Kiểm kê:** Là hoạt động định kỳ đếm tay số lượng thực tế trong kho so với số trên phần mềm, nếu lệch thì điều chỉnh lại phần mềm cho đúng thực tế.

---

## 2️⃣ Cấu trúc Cơ sở dữ liệu (Database Schema)
Hệ thống sử dụng **SQLite** làm cơ sở dữ liệu với các cấu hình tối ưu như `PRAGMA journal_mode = WAL` (giúp đọc ghi đồng thời tốt hơn) và sử dụng tính năng **GENERATED ALWAYS AS** để tự động tính toán (yêu cầu SQLite >= 3.31.0).

Dưới đây là giải thích chi tiết về 8 cụm bảng cốt lõi trong hệ thống:

### 2.1. Bảng Nền tảng (Nhân sự & Phân quyền)
- **`NhanVien`**: Lưu thông tin cơ bản của nhân viên (Mã NV, Họ tên, SĐT, Địa chỉ, Bộ phận).
- **`TaiKhoan`**: Quản lý đăng nhập và phân quyền. 
  - Liên kết 1-1 với `NhanVien` qua `nhan_vien_id`.
  - Cột `VaiTro` giới hạn cứng (Enum) bằng Check Constraint: 'ThuKho', 'TruongKho', 'KeToan', 'BoPhanYC', 'BanGD'. Điều này đảm bảo tính bảo mật từ tầng Database.

### 2.2. Bảng Danh mục (Master Data)
- **`NhaCungCap`**: Chứa thông tin đối tác cung cấp hàng hóa.
- **`HangHoa`**: Quản lý thông tin vật tư, sản phẩm. 
  - Cột quan trọng: `SoLuongTonKho` (tổng tồn hiện tại) và `HanMucTonToiThieu` (ngưỡng báo động đỏ khi hàng sắp hết để hiển thị lên Dashboard).

### 2.3. Bảng Phiếu Nhập Kho (Inbound Workflow)
- **`PhieuNhapKho`**: Lưu thông tin chung của 1 lần nhập hàng (Ngày lập, Người lập, Nhà cung cấp).
  - Cột `TrangThai`: Rất quan trọng, quản lý luồng chạy ('ChoDuyet', 'DaDuyet', 'TuChoi').
  - Có các cột theo dõi người duyệt (`nguoi_duyet_id`, `ngay_duyet`, `ly_do_tu_choi`).
- **`ChiTietPhieuNhapKho`**: Lưu danh sách các mặt hàng trong phiếu.
  - Tối ưu CSDL: Cột `ThanhTien` được cấu hình `GENERATED ALWAYS AS (SoLuong * DonGia) STORED`. Hệ thống tự động tính toán dưới CSDL, tiết kiệm logic xử lý ở code Backend.

### 2.4. Bảng Phiếu Xuất Kho (Outbound Workflow)
- **`PhieuXuatKho`**: Tương tự Phiếu nhập, nhưng không có Nhà cung cấp. Chứa thông tin về tiến trình xuất hàng và duyệt phiếu.
- **`ChiTietPhieuXuatKho`**: Chứa danh sách mặt hàng xuất đi. Cột `ThanhTien` cũng được tự động tính toán.

### 2.5. Bảng Phiếu Kiểm Kê (Inventory Checking)
- **`PhieuKiemKe`**: Lưu thông tin đợt kiểm kê.
- **`ChiTietPhieuKiemKe`**: 
  - Lưu `SoLuongThucTe` (đếm tay) và `SoLuongSoSach` (trên máy).
  - Cột `ChenhLech` được tự động tính bằng `GENERATED ALWAYS AS (SoLuongThucTe - SoLuongSoSach) STORED`. Số âm là thiếu hụt, số dương là dư thừa.

### 2.6. Bảng Phục vụ luồng Đề Nghị (Giao tiếp liên phòng ban)
- **`PhieuDeNghiXuat`**: Cầu nối giữa Phòng Kinh Doanh và Kho.
  - Khi có đơn hàng, Sale tạo đề nghị tại đây (`TrangThai` = 'ChoXuLy'). 
  - Khi thủ kho nhận lệnh và lập phiếu xuất thực tế, hệ thống sẽ link sang `phieu_xuat_id` và đổi trạng thái thành 'DaTaoPhieu'.

### 2.7. Bảng Lịch Sử Biến Động Tồn Kho (Stock Ledger - Tính năng đắt giá)
- **`LichSuTonKho`**: Là "Hộp đen" của kho. Bất kỳ khi nào Tồn kho thay đổi (nhập, xuất, kiểm kê chênh lệch), một dòng sẽ được ghi nhận vào đây (Gồm Số lượng thay đổi, Tồn kho sau khi đổi, và Mã chứng từ liên quan).
- **Ý nghĩa:** Chống gian lận tuyệt đối. Không ai (kể cả admin) được quyền sửa bảng này từ giao diện. Dùng để đối soát và vẽ biểu đồ.

### 2.8. Bảng Dự Báo Trí Tuệ Nhân Tạo
- **`KetQuaDuBao`**: Lưu lại các lần gọi API Google Gemini hoặc thuật toán SMA để dự báo. Chứa số liệu `SoLuongDuBao` để đánh giá `DoChinhXac` sau này.

---

## 3️⃣ Tổng hợp 8 Chức năng (Module) cốt lõi

1. **Dashboard & Thống kê:** Báo cáo tồn kho bằng biểu đồ trực quan, hiển thị cảnh báo khi hàng sắp hết (dựa vào `HanMucTonToiThieu`).
2. **Quản lý Danh mục:** Quản lý thông tin Hàng Hóa và Nhà Cung Cấp (Thêm, sửa, xóa, tìm kiếm, phân trang).
3. **Quản lý Nhập Kho:** Quy trình tạo phiếu nhập chờ duyệt ➔ Trưởng kho duyệt ➔ Cập nhật tồn (`SoLuongTonKho`) ➔ Ghi nhận Lịch sử (`LichSuTonKho`).
4. **Quản lý Xuất Kho:** Quy trình lập phiếu Đề nghị (`PhieuDeNghiXuat`) ➔ Thủ kho làm phiếu xuất (`PhieuXuatKho`) ➔ Trưởng kho duyệt.
5. **Kiểm Kê Kho:** Lập phiếu đối chiếu sổ sách và thực tế ➔ Chốt kiểm kê & Ghi đè tồn kho mới ➔ Lưu lịch sử chênh lệch.
6. **Lịch Sử Tồn Kho (Stock Ledger):** Lưu vết mọi biến động (Tăng/Giảm/Chênh lệch) không thể bị xóa sửa, minh họa bằng biểu đồ Line Chart.
7. **Dự Báo Tồn Kho:** Áp dụng thuật toán AI (hoặc Moving Average) để dự báo số lượng cần chuẩn bị trong tháng tới dựa trên data quá khứ.
8. **Phân quyền & Tài khoản:** Bảo mật đa lớp, mỗi vai trò thấy một màn hình khác nhau dựa vào `VaiTro` trong bảng `TaiKhoan`.

---

## 4️⃣ Ai làm việc nấy (Vai trò & Phân quyền)

| Vai Trò | Chức năng được phép thao tác | Trách nhiệm thực tế |
| :--- | :--- | :--- |
| **Thủ Kho** (ThuKho) | Lập phiếu Nhập, Lập phiếu Xuất, Lập phiếu Kiểm kê, Quản lý Hàng hóa/NCC. | Là người khuân vác, đếm hàng thực tế dưới kho và nhập số liệu lên máy. *(Chỉ có quyền LẬP, KHÔNG CÓ QUYỀN DUYỆT)*. |
| **Trưởng Kho** (TruongKho) | Duyệt hoặc Từ chối Phiếu Nhập/Xuất, Chốt Kiểm Kê. Xem mọi Báo Cáo. | Là người chịu trách nhiệm cao nhất về kho. Thấy phiếu đúng mới ấn nút Duyệt để hàng chính thức được ghi nhận. |
| **Bộ Phận Yêu Cầu** (Kinh Doanh) | Lập Phiếu Đề Nghị Xuất. | Là người chạy sale, khi có đơn hàng sẽ tạo "Đề nghị" gửi xuống kho để báo kho soạn hàng. |
| **Kế Toán** (KeToan) | Quản lý Hàng hóa, NCC, Xem danh sách phiếu Nhập/Xuất, Xem Lịch sử tồn. | Quan tâm đến số liệu, đơn giá, nhà cung cấp để xuất hóa đơn và đối soát công nợ. |
| **Ban Giám Đốc** (BanGD) | Xem Dashboard, Thống kê, Dự báo. | Tài khoản mang quyền này chỉ có chức năng "Chỉ Xem" (Read-only) các báo cáo để ra quyết định, không có quyền duyệt hay sửa dữ liệu để tránh bấm nhầm. |

---

## 5️⃣ Sự liên kết và Đường đi của chức năng (Workflows)

Để cô giáo thấy hệ thống có logic nghiệp vụ sâu (Business Logic), hãy giải thích theo **3 Luồng chảy (Flows)** sau:

### 🟢 Luồng Nhập Kho (Hàng vào)
1. **Khởi nguồn:** Hàng trong kho hiển thị vạch đỏ (dưới định mức) trên phần mềm.
2. **Hành động 1:** Thủ kho đăng nhập, tạo Phiếu Nhập Kho mới. Nhập 100 bịch Omo. Lúc này phiếu ở trạng thái **Chờ Duyệt**. (Tồn kho lúc này VẪN CHƯA TĂNG).
3. **Hành động 2:** Trưởng Kho đăng nhập, kiểm tra giấy tờ thấy khớp với xe tải giao hàng ➔ Ấn **Duyệt**.
4. **Kết quả hệ thống:** Bảng `HangHoa` cộng thêm 100 vào `SoLuongTonKho`. Bảng `LichSuTonKho` tự động sinh 1 dòng: "+100 (Nhập) - Mã phiếu: PNK001".

### 🔴 Luồng Xuất Kho (Hàng ra)
1. **Khởi nguồn:** Phòng Kinh Doanh (Huỳnh Minh Quân) chốt được đơn hàng 50 bịch Omo ➔ Tạo `PhieuDeNghiXuat`.
2. **Hành động 1:** Thủ kho (Dương Minh Nghĩa) nhìn thấy đề nghị này ➔ Click tạo `PhieuXuatKho` tương ứng để xin xuất kho. Trạng thái: **Chờ Duyệt**.
3. **Hành động 2:** Trưởng Kho (Đỗ Hoàng Anh Khoa) vào xem. Hệ thống tự động kiểm tra `SoLuongTonKho`, nếu "Số lượng yêu cầu > Số tồn kho" thì Nút Duyệt sẽ bị khóa. Nếu hợp lệ ➔ Ấn **Duyệt**.
4. **Kết quả hệ thống:** Tồn kho Omo giảm đi 50. Bảng `LichSuTonKho` ghi nhận: "-50 (Xuất) - Mã phiếu: PXK001". Đề nghị xuất đổi trạng thái thành "Đã Xử Lý".

### 🔵 Luồng Kiểm Kê (Chống thất thoát)
1. Cuối tháng, Thủ Kho lập Phiếu Kiểm kê Omo. Sổ sách báo có 50 bịch, nhưng đếm tay thực tế chỉ có 48 bịch (Bị rách, mất cắp 2 bịch).
2. Thủ kho nhập số 48 vào phần mềm. Trạng thái: **Đang Kiểm**. Database tự tính ra `ChenhLech` = -2.
3. Trưởng Kho vào xem, thấy lệch -2. Sau khi điều tra xong, Trưởng kho ấn **Chốt Kiểm Kê**.
4. Hệ thống tàn nhẫn GHI ĐÈ `SoLuongTonKho` của Omo từ 50 thành 48. Bảng `LichSuTonKho` sinh dòng mới: "-2 (Kiểm kê) - Ghi chú: Chênh lệch kiểm kê". Sự thất thoát bị "vạch mặt".

### 🟡 Luồng Báo Cáo & Thống Kê (Dashboard)
1. **Khởi nguồn:** Ban Giám Đốc hoặc Trưởng Kho cần bức tranh toàn cảnh.
2. **Hành động:** Đăng nhập vào hệ thống, xem **Dashboard**.
3. **Kết quả:** Hệ thống truy vấn SQL JOIN các bảng để show:
   - Các Stat Cards (Tổng số dư hàng, Cảnh báo phiếu chờ duyệt).
   - Danh sách "Hàng hóa dưới định mức" (Truy vấn `WHERE SoLuongTonKho <= HanMucTonToiThieu`).

### 🟣 Luồng Dự Báo Tồn Kho AI (Tích hợp Trí tuệ Nhân tạo)
1. **Khởi nguồn:** Lên kế hoạch nhập hàng tháng tới.
2. **Hành động:** Vào màn hình **Dự Báo Tồn Kho**. Chọn mặt hàng (VD: Xi măng Hà Tiên).
3. **Kết quả hệ thống:** Backend query bảng `LichSuTonKho` lấy toàn bộ xu hướng xuất/nhập trong 3-6 tháng qua, đóng gói thành Prompt gửi cho API **Google Gemini AI**.
4. **Output:** Mô hình trả về số lượng cần dự báo, tự động lưu vào bảng `KetQuaDuBao`.
5. **Fallback an toàn:** Nếu API đứt mạng, Backend tự động chạy hàm SMA (Simple Moving Average) tính toán chay để trả về số liệu, đảm bảo user luôn nhận được kết quả.

---

## 💡 Bí kíp khi trình bày (Tips for Presentation)

1. **Nhấn mạnh vào Thiết kế CSDL thông minh:** *"Thưa hội đồng, thay vì dùng code Backend để tính toán thành tiền hay chênh lệch kiểm kê, nhóm em đã sử dụng tính năng **GENERATED ALWAYS AS STORED** của SQLite. Điều này giúp tối ưu hiệu năng và đảm bảo tính toàn vẹn dữ liệu từ tầng Database thấp nhất."*
2. **Nhấn mạnh vào UX/UI:** *"Thay vì dùng pop-up alert thô cứng, em đã tự build Component ActionModal. Nó hỗ trợ đóng bằng Escape, click overlay, và tự disable nút submit khi form không hợp lệ."*
3. **Nhấn mạnh vào Lịch Sử Tồn Kho (Audit Trail):** *"Thưa cô, bảng LichSuTonKho được thiết kế như hộp đen máy bay. Không có bất kỳ API hay nút xóa nào được phép tác động vào lịch sử này. Nó giúp ngăn chặn tình trạng thủ kho và trưởng kho thông đồng sửa số liệu."*
4. **Cách Demo thu hút:** Mở sẵn **3 trình duyệt (hoặc 3 tab ẩn danh)** đăng nhập 3 account: `truongkho`, `thukho1` và `kinhdoanh1`. Demo bắn phiếu chéo cho nhau để thấy dữ liệu nhảy Real-time mà không cần Log-out/Log-in nhiều lần.

---

## 🚀 KỊCH BẢN DEMO THỰC TẾ TRÊN MÁY TÍNH (STEP-BY-STEP)
*Chuẩn bị: Mở 3 tab ẩn danh. Tab 1: Kinh Doanh. Tab 2: Thủ Kho. Tab 3: Trưởng Kho.*

**Bước 1: Show Dashboard & Cấu trúc Database (Tại Tab 3 - Trưởng kho)**
- 🗣️ **Nói:** "Chào cô, màn hình đầu tiên hệ thống hiển thị là Dashboard tổng quan. Hệ thống có script tự sinh hàng ngàn dữ liệu. Tại đây cô thấy ngay các mặt hàng bị bôi đỏ cảnh báo vì `SoLuongTonKho` đang rớt xuống dưới `HanMucTonToiThieu`."
- 🖱️ **Hành động:** Trỏ chuột vào các chỉ số, cuộn xem bảng cảnh báo.

**Bước 2: Kinh doanh lên đơn (Tại Tab 1 - Kinh doanh)**
- 🗣️ **Nói:** "Để minh họa luồng Xuất Kho, phòng Kinh Doanh có đơn hàng nên sẽ tạo Phiếu Đề Nghị Xuất."
- 🖱️ **Hành động:** Tạo Đề nghị xuất cho "Bột giặt Omo 3kg", SL: 50. Nhấn Lưu.

**Bước 3: Thủ kho tiếp nhận (Tại Tab 2 - Thủ kho)**
- 🗣️ **Nói:** "Bên dưới kho, Thủ kho lập tức thấy đề nghị này. Thủ kho tiến hành lập Phiếu Xuất thực tế và chờ duyệt."
- 🖱️ **Hành động:** Chuyển Tab 2, tạo phiếu xuất từ đề nghị vừa rồi. Thử cố tình bỏ trống một ô để khoe chức năng Disable nút Lưu tự động. Nhập đúng và Lưu.

**Bước 4: Trưởng kho duyệt & Dòng lịch sử bất tử (Tại Tab 3 - Trưởng kho)**
- 🗣️ **Nói:** "Phiếu xuất đang chờ duyệt, tồn kho chưa bị trừ. Trưởng kho đăng nhập vào kiểm tra."
- 🖱️ **Hành động:** Tab 3, duyệt phiếu. Mở tiếp tab **Lịch sử tồn kho**.
- 🗣️ **Nói:** "Em xin giới thiệu tính năng Audit Trail (Lịch sử biến động). Ngay khi phiếu được duyệt, 1 dòng trừ 50 bịch Omo được ghi vĩnh viễn vào hệ thống. Biểu đồ Line Chart lập tức phản ứng."

**Bước 5: Chốt hạ bằng AI (Tại Tab 3)**
- 🗣️ **Nói:** "Để lên kế hoạch nhập hàng tháng tới, em tích hợp AI. Khi chọn 'Dự báo', hệ thống gom toàn bộ lịch sử biến động gửi lên Google Gemini."
- 🖱️ **Hành động:** Demo bấm nút dự báo 1 mặt hàng. Đợi AI trả lời.
- 🗣️ **Nói:** "Bên cạnh kết quả AI, nếu mất kết nối, hệ thống đã trang bị Fallback tự động tính Trung Bình Cộng SMA. Đây là tư duy xử lý Exception trong thiết kế phần mềm. Em xin cảm ơn hội đồng đã theo dõi luồng tự động hóa của nhóm em."

---

## ❓ 6️⃣ Câu Hỏi Thường Gặp (Q&A Phản Biện)

Dưới đây là những câu hỏi "xoáy" mà hội đồng rất hay hỏi và cách trả lời thông minh nhất để bảo vệ điểm số:

**❓ Câu hỏi 1: "Hiện tại muốn thêm 1 nhân viên mới vào hệ thống thì làm thế nào? Chẳng lẽ phải hardcode hoặc thêm trực tiếp bằng SQL?"**
👉 **Cách trả lời:** 
*"Dạ thưa cô, hiện tại do giới hạn thời gian của đồ án môn học, nhóm em tập trung 100% công lực vào việc giải quyết bài toán nghiệp vụ cốt lõi (Core Business) là Quản lý Nhập - Xuất - Tồn - Kiểm kê và Dự báo AI. Tính năng tạo tài khoản thuộc về phân hệ Quản trị Hệ Thống (System Admin) hoặc Quản lý Nhân sự (HRM). Trong thực tế triển khai, hệ thống sẽ có thêm 1 Role là `Admin` để thao tác CRUD trên bảng `NhanVien` và `TaiKhoan` này ạ. Tạm thời nhóm em đang seed data mẫu để chạy demo luồng kho ạ."*

**❓ Câu hỏi 2: "Vậy nếu một nhân viên (VD: Thủ kho) nghỉ việc thì làm sao để khóa tài khoản của họ?"**
👉 **Cách trả lời:**
*"Dạ, nhóm em đã lường trước nghiệp vụ này nên trong thiết kế Database (bảng `TaiKhoan`), em đã thiết kế sẵn cột `TrangThai` với 2 giá trị là `HoatDong` và `Khoa`. Khi Admin hoặc Ban Giám Đốc tick chọn 'Khóa tài khoản' trên giao diện (tương lai), phần mềm sẽ update cột này thành `Khoa`. Ở Backend, middleware kiểm tra Token của em sẽ tự động chặn mọi request từ tài khoản có trạng thái `Khoa`, nhân viên đó sẽ lập tức bị văng ra khỏi phần mềm và không thể đăng nhập lại được nữa ạ."*

**❓ Câu hỏi 3: "Tại sao không cho người dùng tự đăng ký (Register) tài khoản?"**
👉 **Cách trả lời:**
*"Dạ thưa cô, đây là phần mềm nội bộ doanh nghiệp (B2B/Enterprise Software), không phải phần mềm mạng xã hội hay thương mại điện tử (B2C) nên tuyệt đối KHÔNG có chức năng tự đăng ký. Mọi tài khoản đều phải do phòng Hành chính Nhân sự hoặc Admin cấp phát dựa trên hợp đồng lao động để kiểm soát chặt chẽ bảo mật thông tin kho ạ."*