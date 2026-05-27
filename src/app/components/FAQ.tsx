import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "WEMO là gì và hoạt động như thế nào?",
    answer:
      "WEMO là nền tảng quà tặng kỹ thuật số NFC cá nhân hóa, biến hộp quà vật lý thành trải nghiệm web tương tác. Người nhận chỉ cần chạm điện thoại thông minh vào hộp quà NFC để mở khóa một trang web đẹp mắt, cá nhân hóa với ảnh, video, tin nhắn giọng nói và nhiều hơn nữa. Không cần cài ứng dụng!",
  },
  {
    question: "Tôi có cần thiết bị đặc biệt hay kiến thức kỹ thuật không?",
    answer:
      "Không cần gì cả! Chúng tôi cung cấp hộp quà tích hợp NFC, và việc tạo trải nghiệm đơn giản như tải ảnh lên và chọn mẫu. Người nhận chỉ cần điện thoại thông minh có NFC (hầu hết điện thoại hiện đại đều có) hoặc có thể dùng mã QR thay thế.",
  },
  {
    question: "Tôi có thể cập nhật nội dung sau khi tặng quà không?",
    answer:
      "Có! Với gói Cao Cấp và Doanh Nghiệp, bạn có thể cập nhật trải nghiệm quà bất cứ lúc nào. Thêm ảnh, video hay tin nhắn mới khi có ký ức mới. Người nhận luôn thấy phiên bản mới nhất khi chạm vào hộp quà.",
  },
  {
    question: "Những thiết bị nào tương thích với WEMO?",
    answer:
      "WEMO hoạt động trên tất cả điện thoại thông minh hiện đại có NFC (iPhone 7 trở lên, hầu hết điện thoại Android). Với thiết bị không có NFC, chúng tôi cung cấp mã QR thay thế hoạt động trên bất kỳ điện thoại nào. Trải nghiệm web được tối ưu cho mọi kích thước màn hình.",
  },
  {
    question: "Trải nghiệm kỹ thuật số tồn tại trong bao lâu?",
    answer:
      "Trải nghiệm quà WEMO của bạn là vĩnh viễn! Không giống quà truyền thống có thể hao mòn hay thất lạc, ký ức kỹ thuật số của bạn được lưu trữ an toàn và có thể truy cập mãi mãi. Chúng tôi duy trì sao lưu và đảm bảo ký ức của bạn luôn an toàn.",
  },
  {
    question:
      "Tôi có thể dùng WEMO cho sự kiện doanh nghiệp hay đám cưới không?",
    answer:
      "Tất nhiên! Gói Doanh Nghiệp hoàn hảo cho đám cưới, sự kiện công ty, hội nghị và tặng quà hàng loạt. Chúng tôi cung cấp thương hiệu tùy chỉnh, tùy chọn nhãn trắng và có thể tạo mẫu riêng cho nhu cầu cụ thể của bạn. Liên hệ đội ngũ tư vấn để được giải pháp phù hợp.",
  },
  {
    question: "Dữ liệu của tôi có được bảo mật và riêng tư không?",
    answer:
      "Bảo mật và quyền riêng tư là ưu tiên hàng đầu của chúng tôi. Tất cả nội dung được mã hóa và lưu trữ an toàn. Chỉ người có thẻ NFC hoặc mã QR mới xem được trải nghiệm. Bạn kiểm soát ai xem ký ức của mình và có thể bảo vệ nội dung nhạy cảm bằng mật khẩu.",
  },
  {
    question: "Chuyện gì xảy ra nếu tôi làm mất hộp quà NFC?",
    answer:
      "Đừng lo! Bạn có thể truy cập trải nghiệm quà qua bảng điều khiển tài khoản WEMO và tạo thẻ NFC hoặc mã QR mới. Chúng tôi cũng gửi mã QR sao lưu qua email khi bạn tạo quà, vì vậy bạn luôn có quyền truy cập vào ký ức của mình.",
  },
  {
    question: "Tôi có thể tạo quà bằng tiếng Việt không?",
    answer:
      "Có! WEMO hỗ trợ nhiều ngôn ngữ bao gồm tiếng Việt. Bạn có thể tạo toàn bộ trải nghiệm bằng tiếng Việt và các mẫu thiết kế được thiết kế để hiển thị đẹp mắt với văn bản bất kỳ ngôn ngữ nào.",
  },
  {
    question: "Nếu tôi cần hỗ trợ tạo quà thì sao?",
    answer:
      "Chúng tôi luôn sẵn sàng hỗ trợ! Đội ngũ hỗ trợ có thể liên hệ qua email cho tất cả người dùng. Khách hàng Cao Cấp được hỗ trợ ưu tiên, và khách hàng gói Doanh Nghiệp có quản lý tài khoản riêng. Chúng tôi cũng có video hướng dẫn chi tiết và tài liệu tham khảo.",
  },
];

export function FAQ() {
  return (
    <section className="relative py-24 overflow-hidden webo-animated-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="mb-4"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              color: "#1A1818",
            }}
          >
            Câu Hỏi Thường Gặp
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: "1.125rem",
              color: "#6B6B6B",
              lineHeight: 1.6,
            }}
          >
            Có câu hỏi? Chúng tôi có câu trả lời.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="webo-glass-card rounded-3xl p-6 md:p-8"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-none"
              >
                <AccordionTrigger
                  className="text-left hover:no-underline py-4 px-6 rounded-2xl transition-all"
                  style={{
                    background: "rgba(232, 180, 168, 0.05)",
                    color: "#1A1818",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: "1.0625rem" }}>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent
                  className="px-6 pt-4 pb-2"
                  style={{
                    color: "#6B6B6B",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
