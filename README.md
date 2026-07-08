# WEMO - Premium Digital NFC Gift Platform

**WEMO** là nền tảng tạo thiệp quà tặng kỹ thuật số cao cấp tích hợp chip NFC thông minh. Nền tảng cho phép người dùng cá nhân hóa trải nghiệm quà tặng bằng cách kết nối thiệp kỹ thuật số sinh động (chứa hình ảnh, video, ghi âm lời chúc, nhạc nền và các hiệu ứng tương tác 3D độc đáo) vào một món quà/thẻ vật lý có gắn chip NFC. Khi người nhận chạm nhẹ điện thoại vào thẻ hoặc quét mã QR WEMO, thiệp tương tác 3D sẽ tự động mở ra trực quan trên màn hình di động.

---

## ✨ Chức Năng Của Hệ Thống

### 1. Mẫu Thiệp Tương Tác 3D (WebGL / Three.js)
Hệ thống tích hợp các không gian 3D tương tác sử dụng **React Three Fiber (R3F)** và **Drei**:
- **Mẫu Tinh Cầu Vũ Trụ (Universe 3D - solid-heart)**: Quả cầu hạt tinh vân phát sáng rực rỡ kèm vành đai Saturn, các thẻ Polaroid ảnh kỷ niệm xoay quanh quỹ đạo không gian và sao băng rơi đa góc luân phiên.
- **Mẫu Ký Ức Lãng Mạn (Neural Heart - love-romantic)**: Mạng lưới trái tim rơi 3D kết hợp dòng thời gian kỷ niệm và hộp thư bí mật để xem các tin nhắn và tệp đa phương tiện của người tặng.
- **Bộ Lọc Cắt Bo Góc Bằng GPU (Custom Shader)**: Áp dụng thuật toán SDF (Signed Distance Field) và Smoothstep trực tiếp trên Fragment Shader của `PlaneGeometry` để bo tròn góc ảnh mà hoàn toàn không bị lỗi méo hay kéo dãn vân bề mặt (texture warping).
- **Chống Vỡ Ảnh & Giữ Màu Nguyên Bản**: Kích hoạt cơ chế tạo **Mipmapping** kết hợp bộ lọc trilinear (`LinearMipmapLinearFilter`) để chống răng cưa/vỡ ảnh khi ở xa, đồng thời vô hiệu hóa tone mapping (`toneMapped={false}`) giúp giữ màu ảnh hiển thị sáng đẹp, chuẩn xác như ảnh gốc.

### 2. Tự Động Hóa Thanh Toán & Gửi Thông Báo (Webhook, Telegram, Email, Zalo)
- **Webhook Payment**: Endpoint `/api/webhook/payment` tiếp nhận callback tự động từ cổng thanh toán để cập nhật trạng thái đơn hàng sang "đã cọc" (deposited).
- **Resend Email Service**: Gửi email tự động xác nhận đặt cọc thành công cho khách hàng qua Resend HTTP API với giao diện HTML thiết kế sang trọng và cơ chế fallback URL thông minh.
- **Telegram Bot Alert**: Gửi thông báo real-time kèm Album ảnh (Ảnh Gốc + Ảnh Chibi) về nhóm quản trị khi có đơn hàng mới hoặc khi khách thiết lập xong thiệp.
- **Zalo ZNS Integration**: Gửi tin nhắn chăm sóc khách hàng qua Zalo OA ngay sau khi thanh toán cọc thành công.

### 3. Quản Lý Đơn Hàng & Xóa Liên Đới (Cascading Delete)
Hệ thống quản lý chặt chẽ vòng đời của đơn hàng để tránh dữ liệu mồ côi:
- Khi một đơn hàng bị xóa (`DELETE /api/orders/:id`), toàn bộ các món quà (`Gift`) liên kết với đơn hàng đó sẽ tự động bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
- Các thẻ chip NFC liên kết với các món quà bị xóa đó sẽ tự động được giải phóng về trạng thái chưa gán (`unassigned`, `giftId = ""`) để tái sử dụng ngay lập tức.

### 4. Kênh Trò Chuyện Trực Tuyến Trợ Giúp Real-time (Server-Sent Events)
- Tích hợp khung chat trợ giúp trực tuyến giữa khách hàng và Admin.
- Sử dụng giải pháp kết nối **Server-Sent Events (SSE)** giúp truyền nhận tin nhắn hai chiều ổn định, tức thì (<50ms) mà không tốn tài nguyên CPU như giải pháp Polling.

---

## 🔒 Bảo Mật Admin Dashboard & API

Hệ thống thiết lập cơ chế bảo mật nghiêm ngặt để bảo vệ trang quản trị Admin Dashboard và các đầu cuối API nhạy cảm:

### 1. Xác Thực Bằng JSON Web Token (JWT)
- Toàn bộ các API nghiệp vụ quản trị (quản lý đơn hàng, danh sách thiệp, cấu hình chip NFC, xem tin nhắn trợ giúp) đều được bảo vệ nghiêm ngặt bằng phần mềm trung gian `authMiddleware`.
- Quản trị viên sau khi đăng nhập thành công sẽ nhận được một JWT Token được ký mã hóa bằng thuật toán an toàn, lưu trữ phía Client và gửi kèm trong tiêu đề `Authorization: Bearer <token>` ở mỗi yêu cầu API tiếp theo.

### 2. Mã Hóa Mật Khẩu Bằng Thuật Toán PBKDF2
- Mật khẩu tài khoản quản trị được băm bảo mật bằng thuật toán **PBKDF2** kết hợp chuỗi muối ngẫu nhiên (salt) thông qua thư viện gốc `crypto` của Node.js, ngăn chặn hoàn toàn nguy cơ bị dò quét hoặc tấn công vét cạn bảng băm (rainbow table).

### 3. Xác Thực Webhook An Toàn
- Endpoint Webhook thanh toán được bảo vệ bằng cơ chế khóa bí mật dùng chung (`WEBHOOK_SECRET`). Yêu cầu gửi đến bắt buộc phải đính kèm chữ ký mã khóa hợp lệ, ngăn chặn việc giả mạo thông tin thanh toán từ các nguồn bên ngoài.

### 4. Ký Số Xác Thực Đơn Hàng (Order Verification Signatures)
- Khi khách hàng truy cập thiết kế thiệp từ đường dẫn đặt cọc thành công, hệ thống sử dụng thuật toán HMAC để sinh ra một chữ ký số (`orderSignature`) liên kết trực tiếp với `orderId`.
- Chỉ khi chữ ký số này hợp lệ hoặc đơn hàng được xác nhận trạng thái thanh toán là đã đặt cọc (`deposited` / `paid`) trực tiếp trong cơ sở dữ liệu thì hệ thống mới cho phép tiến hành lưu trữ phôi thiệp, tránh việc giả lập đơn hàng để tạo thiệp trái phép.
