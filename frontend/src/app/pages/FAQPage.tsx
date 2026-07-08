import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

const categories = [
  {
    label: "Tổng Quan",
    faqs: [
      {
        q: "WEMO là gì và hoạt động như thế nào?",
        a: "WEMO là nền tảng quà tặng kỹ thuật số NFC cá nhân hóa, biến hộp quà vật lý thành trải nghiệm web tương tác. Người nhận chỉ cần chạm điện thoại thông minh vào hộp quà NFC để mở khóa một trang web đẹp mắt với ảnh, video, tin nhắn giọng nói và nhiều hơn nữa. Không cần cài ứng dụng!",
      },
      {
        q: "Tôi có cần thiết bị đặc biệt hay kiến thức kỹ thuật không?",
        a: "Không cần gì cả! Chúng tôi cung cấp hộp quà tích hợp NFC, và việc tạo trải nghiệm đơn giản như tải ảnh lên và chọn mẫu. Người nhận chỉ cần điện thoại thông minh có NFC (hầu hết điện thoại hiện đại đều có) hoặc có thể dùng mã QR thay thế.",
      },
      {
        q: "Trải nghiệm kỹ thuật số tồn tại trong bao lâu?",
        a: "Trải nghiệm quà WEMO của bạn là vĩnh viễn! Không giống quà truyền thống có thể hao mòn hay thất lạc, ký ức kỹ thuật số của bạn được lưu trữ an toàn và có thể truy cập mãi mãi. Chúng tôi duy trì sao lưu và đảm bảo ký ức của bạn luôn an toàn.",
      },
    ],
  },
  {
    label: "Kỹ Thuật",
    faqs: [
      {
        q: "Những thiết bị nào tương thích với WEMO?",
        a: "WEMO hoạt động trên tất cả điện thoại thông minh hiện đại có NFC (iPhone 7 trở lên, hầu hết điện thoại Android). Với thiết bị không có NFC, chúng tôi cung cấp mã QR thay thế hoạt động trên bất kỳ điện thoại nào. Trải nghiệm web được tối ưu cho mọi kích thước màn hình.",
      },
      {
        q: "Tôi có thể cập nhật nội dung sau khi tặng quà không?",
        a: "Có! Với gói Cao Cấp và Doanh Nghiệp, bạn có thể cập nhật trải nghiệm quà bất cứ lúc nào. Thêm ảnh, video hay tin nhắn mới khi có ký ức mới. Người nhận luôn thấy phiên bản mới nhất khi chạm vào hộp quà.",
      },
      {
        q: "Chuyện gì xảy ra nếu tôi làm mất hộp quà NFC?",
        a: "Đừng lo! Bạn có thể truy cập trải nghiệm quà qua bảng điều khiển tài khoản WEMO và tạo thẻ NFC hoặc mã QR mới. Chúng tôi cũng gửi mã QR sao lưu qua email khi bạn tạo quà, vì vậy bạn luôn có quyền truy cập vào ký ức của mình.",
      },
    ],
  },
  {
    label: "Bảo Mật",
    faqs: [
      {
        q: "Dữ liệu của tôi có được bảo mật và riêng tư không?",
        a: "Bảo mật và quyền riêng tư là ưu tiên hàng đầu của chúng tôi. Tất cả nội dung được mã hóa và lưu trữ an toàn. Chỉ người có thẻ NFC hoặc mã QR mới xem được trải nghiệm. Bạn kiểm soát ai xem ký ức của mình và có thể bảo vệ nội dung nhạy cảm bằng mật khẩu.",
      },
      {
        q: "WEMO có tuân thủ GDPR không?",
        a: "Có, WEMO hoàn toàn tuân thủ GDPR và các quy định bảo vệ dữ liệu quốc tế. Bạn có quyền yêu cầu xóa hoặc xuất dữ liệu cá nhân bất cứ lúc nào.",
      },
    ],
  },
  {
    label: "Doanh Nghiệp",
    faqs: [
      {
        q: "Tôi có thể dùng WEMO cho sự kiện doanh nghiệp hay đám cưới không?",
        a: "Tất nhiên! Gói Doanh Nghiệp hoàn hảo cho đám cưới, sự kiện công ty, hội nghị và tặng quà hàng loạt. Chúng tôi cung cấp thương hiệu tùy chỉnh, tùy chọn nhãn trắng và có thể tạo mẫu riêng cho nhu cầu cụ thể của bạn.",
      },
      {
        q: "Tôi có thể tạo quà bằng tiếng Việt không?",
        a: "Có! WEMO hỗ trợ nhiều ngôn ngữ bao gồm tiếng Việt. Bạn có thể tạo toàn bộ trải nghiệm bằng tiếng Việt và các mẫu thiết kế được thiết kế để hiển thị đẹp mắt với văn bản bất kỳ ngôn ngữ nào.",
      },
    ],
  },
  {
    label: "Hỗ Trợ",
    faqs: [
      {
        q: "Nếu tôi cần hỗ trợ tạo quà thì sao?",
        a: "Chúng tôi luôn sẵn sàng hỗ trợ! Đội ngũ hỗ trợ có thể liên hệ qua email cho tất cả người dùng. Khách hàng Cao Cấp được hỗ trợ ưu tiên, và khách hàng gói Doanh Nghiệp có quản lý tài khoản riêng. Chúng tôi cũng có video hướng dẫn chi tiết và tài liệu tham khảo.",
      },
    ],
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <span
          style={{
            fontWeight: 600,
            color: "#1A1818",
            fontSize: "1rem",
            lineHeight: 1.5,
          }}
        >
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5" style={{ color: "#E8B4A8" }} />
        </motion.div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ overflow: "hidden" }}
      >
        <div
          className="px-5 pb-5"
          style={{ color: "#6B6B6B", lineHeight: 1.7, fontSize: "0.9375rem" }}
        >
          {faq.a}
        </div>
      </motion.div>
    </div>
  );
}

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="pt-20" style={{ background: "#FCEBE7" }}>
      {/* Hero */}
      <section className="py-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: "rgba(232,180,168,0.2)", color: "#A85B4C" }}
          >
            Câu Hỏi Thường Gặp
          </span>
          <h1
            className="mb-4"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#1A1818",
              lineHeight: 1.2,
            }}
          >
            Có Câu Hỏi?
          </h1>
          <p
            className="max-w-xl mx-auto"
            style={{
              fontSize: "1.150rem",
              color: "#6B6B6B",
              lineHeight: 1.6,
              whiteSpace: "nowrap",
            }}
          >
            Chúng tôi có câu trả lời. Tìm kiếm theo danh mục hoặc liên hệ đội
            ngũ hỗ trợ.
          </p>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                activeCategory === i
                  ? {
                      background:
                        "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                      color: "white",
                    }
                  : {
                      background: "white",
                      color: "#6B6B6B",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {categories[activeCategory].faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-3xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
          }}
        >
          <MessageCircle className="w-10 h-10 mx-auto mb-3 text-white" />
          <h3
            className="mb-2 text-white"
            style={{ fontSize: "1.5rem", fontWeight: 700 }}
          >
            Chưa Tìm Thấy Câu Trả Lời?
          </h3>
          <p className="mb-5 text-white/90" style={{ fontSize: "1rem" }}>
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.
          </p>
          <a
            href="https://www.facebook.com/hieu.kimxuan.7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-3 rounded-full font-semibold text-sm"
            style={{ background: "white", color: "#E8B4A8" }}
          >
            Liên Hệ Hỗ Trợ
          </a>
        </motion.div>
      </section>
    </div>
  );
}
