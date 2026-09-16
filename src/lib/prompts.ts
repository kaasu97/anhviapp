export type JarPrompt = {
  emoji: string;
  text: string;
};

// Gợi ý được rút ra khi "bốc thăm" từ bình — người bốc sẽ dựa vào đây
// để viết yêu cầu thật của riêng mình cho người kia.
export const JAR_PROMPTS: JarPrompt[] = [
  { emoji: "🎧", text: "Gửi cho đối phương một bài hát đang khiến bạn nhớ tới họ." },
  { emoji: "📸", text: "Yêu cầu một tấm ảnh chụp góc làm việc/học tập hôm nay của họ." },
  { emoji: "🍳", text: "Thử nấu hoặc mua một món ăn mà bạn hay ăn cùng nhau, rồi khoe kết quả." },
  { emoji: "✍️", text: "Viết ra 3 điều bạn biết ơn về người ấy và gửi qua tin nhắn." },
  { emoji: "🎬", text: "Cùng xem chung một bộ phim/tập phim vào cuối tuần này, dù ở xa nhau." },
  { emoji: "🌅", text: "Gửi một tấm ảnh bầu trời hoặc khung cảnh nơi bạn đang ở lúc này." },
  { emoji: "📞", text: "Gọi video ít nhất 20 phút không làm việc gì khác, chỉ để trò chuyện." },
  { emoji: "💌", text: "Viết một lá thư tay ngắn kể về một ngày đáng nhớ gần đây." },
  { emoji: "🎁", text: "Đặt một món quà nhỏ bất ngờ gửi đến tận nơi cho người ấy." },
  { emoji: "🕺", text: "Quay một video nhảy hoặc hát vui nhộn để chọc cười đối phương." },
  { emoji: "📖", text: "Kể một kỷ niệm vui giữa hai người mà lâu rồi chưa nhắc lại." },
  { emoji: "🧸", text: "Gửi một đoạn voice note chúc ngủ ngon thật dịu dàng." },
  { emoji: "🗓️", text: "Lên kế hoạch chi tiết cho lần gặp mặt tiếp theo của hai người." },
  { emoji: "🌱", text: "Chia sẻ một điều mới bạn vừa học được trong tuần này." },
  { emoji: "☕", text: "Cùng nhau 'uống cà phê' qua video call vào một buổi sáng." },
  { emoji: "🎨", text: "Vẽ hoặc viết một điều gì đó thật ngẫu hứng dành tặng người ấy." },
  { emoji: "🛍️", text: "Hỏi họ đang cần món đồ gì và âm thầm chuẩn bị gửi tặng." },
  { emoji: "🏃", text: "Rủ nhau cùng tập thể dục vào cùng một khung giờ trong tuần." },
  { emoji: "📝", text: "Viết ra 5 lý do vì sao bạn yêu người ấy và đọc cho họ nghe." },
  { emoji: "🌙", text: "Thức đến cùng một giờ để 'ngắm trăng cùng nhau' qua điện thoại." },
];

export function drawRandomPrompt(): JarPrompt {
  const index = Math.floor(Math.random() * JAR_PROMPTS.length);
  return JAR_PROMPTS[index];
}
