# Skill: Object-Oriented Analysis and Design (OOAD) Best Practices

## 1. Phân biệt Nghiệp vụ và Hệ thống (Business vs. System)
Sai lầm phổ biến nhất khi phân tích thiết kế là nhầm lẫn giữa Business Use Case và System Use Case.
- **Business Use Case (BUC):** Miêu tả cái mà doanh nghiệp (hoặc tổ chức) thực hiện để mang lại giá trị cho nội bộ hoặc khách hàng. Các Actor ở đây là con người, phòng ban hoặc đối tác bên ngoài trong thế giới thực.
- **System Use Case (SUC):** Miêu tả chức năng mà phần mềm phải cung cấp để hỗ trợ hoặc tự động hóa phần nào (hoặc toàn bộ) Business Use Case. Actor ở đây là người sử dụng trực tiếp có tài khoản tương tác với hệ thống.

## 2. Mô hình hóa quy trình (Process Modeling)
Khi diễn tả nghiệp vụ, luôn sử dụng một (hoặc nhiều) trong các dạng sau:
- **Sơ đồ hoạt động (Activity Diagram):** Thể hiện rõ các Swimlanes (làn bơi) đại diện cho các phòng ban, cá nhân hoặc hệ thống con chịu trách nhiệm cho mỗi hành động.
- **Sơ đồ tuần tự (Sequence Diagram) cấp nghiệp vụ:** Minh họa tương tác giữa các tác nhân thực và quy trình thực mà chưa nhất thiết phải có hệ thống phần mềm can thiệp sâu.

## 3. Class Diagram: Mức phân tích vs. Mức thiết kế
- **Sơ đồ lớp mức phân tích (Analysis Class Diagram):** Tập trung vào các lớp thực thể (Entity Classes) lưu thông tin trong hệ thống. Không cần quan tâm quá sâu vào kiểu dữ liệu, các hàm (methods) hay các lớp giao diện/điều khiển chưa phân định rõ rệt. Quan trọng là xác định đúng mối quan hệ (Association, Aggregation, Composition, Generalization) và bản số (Multiplicity).
- **Sơ đồ lớp mức thiết kế (Design Class Diagram):** Rất chi tiết. Bao gồm:
  + Các thuộc tính đầy đủ kiểu dữ liệu, mức cấp quyền truy cập (Private/Public/Protected).
  + Các phương thức (Methods/Operations) bao gồm cả tham số truyền vào và kiểu trả về.
  + Áp dụng kiến trúc 3 lớp: Boundary/View Classes (Giao diện), Control/Business Classes (Nghiệp vụ), Entity/Data Classes (Truy cập CSDL).

## 4. Chuyển đổi sang CSDL (Database Mapping)
- **1-1:** Gộp bảng hoặc tách theo khóa ngoại.
- **1-N:** Đưa khóa chính của bên "1" sang làm khóa ngoại ở bên "N".
- **M-N:** Bắt buộc sinh ra bảng trung gian (Junction Table) chứa khóa chính của cả 2 bảng.
