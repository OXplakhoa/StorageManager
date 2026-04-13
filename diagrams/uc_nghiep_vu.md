# Sơ đồ Use Case Nghiệp vụ – HTTT Quản lý Kho hàng

## Mô tả tổng quan
Sơ đồ Use Case nghiệp vụ dưới đây mô tả toàn bộ các quy trình nghiệp vụ (Business Processes) diễn ra trong hoạt động quản lý kho hàng tại Công ty TNHH TM-DV Hàng Tiêu Dùng Minh Phát. Các tác nhân nghiệp vụ (Business Actors) được xác định bao gồm cả nhân sự nội bộ và đối tác bên ngoài ranh giới tổ chức.

### Quy ước ký hiệu
- **Hình người (Actor):** Tác nhân nghiệp vụ tham gia trực tiếp vào quy trình.
- **Hình ellipse (Use Case):** Một quy trình nghiệp vụ có đầu vào, đầu ra và mục tiêu rõ ràng.
- **`<<include>>`:** UC phụ bắt buộc phải được thực thi khi UC chính được kích hoạt.
- **`<<extend>>`:** UC phụ chỉ được kích hoạt khi có điều kiện ngoại lệ xảy ra.
- **Đường thẳng (Association):** Tác nhân tham gia trực tiếp vào quy trình.

## Sơ đồ

> **Lưu ý:** Mermaid chưa hỗ trợ trực tiếp Use Case Diagram chuẩn UML. Dưới đây sử dụng `flowchart` để biểu diễn tương đương về mặt ngữ nghĩa. Nếu cần sơ đồ chuẩn UML hoàn hảo, có thể dùng PlantUML hoặc StarUML để vẽ lại từ cấu trúc này.

```mermaid
flowchart LR
    %% ===== TÁC NHÂN NGHIỆP VỤ =====
    NCC["🏭 Nhà cung cấp<br/>(Tác nhân ngoài)"]
    NVMH["👷 Nhân viên<br/>Mua hàng"]
    TK["📦 Thủ kho"]
    TrK["👔 Trưởng kho<br/>/ Quản lý"]
    KTK["📊 Kế toán kho"]
    BPYC["🏢 Bộ phận yêu cầu<br/>(KD/SX)"]
    BGD["🏛️ Ban Giám đốc<br/>(Tác nhân ngoài)"]

    %% ===== RANH GIỚI HỆ THỐNG =====
    subgraph boundary["🔲 Ranh giới Hệ thống Quản lý Kho hàng – Công ty Minh Phát"]
        direction TB

        UC_NV06(["📋 UC_NV06<br/>Quản lý danh mục<br/>cơ sở"])
        UC_NV01(["📥 UC_NV01<br/>Nhập kho<br/>hàng hóa"])
        UC_NV02(["📤 UC_NV02<br/>Xuất kho<br/>hàng hóa"])
        UC_NV03(["🔍 UC_NV03<br/>Kiểm tra<br/>hàng hóa"])
        UC_NV04(["⚠️ UC_NV04<br/>Xử lý<br/>chênh lệch"])
        UC_NV07(["📝 UC_NV07<br/>Kiểm kê hàng hóa<br/>định kỳ"])
        UC_NV05(["📈 UC_NV05<br/>Lập báo cáo<br/>kho"])
    end

    %% ===== QUAN HỆ TÁC NHÂN - USE CASE =====
    %% Quản lý danh mục
    KTK --- UC_NV06
    TK --- UC_NV06

    %% Nhập kho
    NCC -.->|"Giao hàng +<br/>Hóa đơn"| UC_NV01
    NVMH --- UC_NV01
    TK --- UC_NV01
    TrK --- UC_NV01

    %% Xuất kho
    BPYC --- UC_NV02
    TK --- UC_NV02
    TrK --- UC_NV02

    %% Kiểm kê
    TrK --- UC_NV07
    TK --- UC_NV07
    KTK --- UC_NV07

    %% Báo cáo
    KTK --- UC_NV05
    TrK --- UC_NV05
    BGD -.->|"Nhận báo cáo"| UC_NV05

    %% Xử lý chênh lệch
    NVMH --- UC_NV04
    NCC -.->|"Ký xác nhận<br/>biên bản"| UC_NV04

    %% ===== QUAN HỆ INCLUDE / EXTEND =====
    UC_NV01 -->|"≪include≫"| UC_NV03
    UC_NV02 -->|"≪include≫"| UC_NV03
    UC_NV01 -.->|"≪extend≫<br/>[Hàng lỗi/thiếu]"| UC_NV04

    %% ===== STYLING =====
    style boundary fill:#f0f4ff,stroke:#4a6fa5,stroke-width:2px,color:#1a1a2e
    style UC_NV01 fill:#d4edda,stroke:#28a745,color:#155724
    style UC_NV02 fill:#d4edda,stroke:#28a745,color:#155724
    style UC_NV03 fill:#fff3cd,stroke:#ffc107,color:#856404
    style UC_NV04 fill:#f8d7da,stroke:#dc3545,color:#721c24
    style UC_NV05 fill:#cce5ff,stroke:#0d6efd,color:#004085
    style UC_NV06 fill:#e2e3e5,stroke:#6c757d,color:#383d41
    style UC_NV07 fill:#d1ecf1,stroke:#17a2b8,color:#0c5460
```

## Giải thích mối quan hệ giữa các Use Case

### Quan hệ `<<include>>` (Bắt buộc)
| UC Chính | UC Được Include | Giải thích |
|---|---|---|
| UC_NV01 – Nhập kho | UC_NV03 – Kiểm tra hàng hóa | Mỗi lần nhập kho, nghiệp vụ kiểm tra hàng hóa (đếm số lượng, kiểm ngoại quan, đối chiếu chứng từ) **bắt buộc** phải được thực hiện trước khi lập phiếu. |
| UC_NV02 – Xuất kho | UC_NV03 – Kiểm tra hàng hóa | Mỗi lần xuất kho, thủ kho **bắt buộc** phải kiểm tra số lượng tồn và chất lượng hàng trước khi tiến hành xuất. |

### Quan hệ `<<extend>>` (Có điều kiện)
| UC Chính | UC Mở rộng | Điều kiện kích hoạt |
|---|---|---|
| UC_NV01 – Nhập kho | UC_NV04 – Xử lý chênh lệch | Chỉ kích hoạt khi phát hiện hàng hóa bị lỗi, thiếu hụt hoặc sai quy cách so với hóa đơn trong quá trình kiểm tra tại bước nhập kho. |

### Tác nhân ngoài ranh giới
| Tác nhân | Vai trò | Tương tác |
|---|---|---|
| Nhà cung cấp (NCC) | Đối tác thương mại bên ngoài | Giao hàng + hóa đơn cho UC_NV01; Ký xác nhận biên bản chênh lệch tại UC_NV04. |
| Ban Giám đốc | Cấp quản trị cao nhất | Nhận báo cáo kho định kỳ từ UC_NV05 để ra quyết định chiến lược. |
