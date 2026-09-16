# Ánh Vi 🫙

Một chiếc bình thư cho hai người yêu xa. Mỗi ngày, một người bốc một lá thư
trong bình và viết một yêu cầu nhỏ cho người kia — người kia có 7 ngày để
hoàn thành. Mục tiêu là giữ cảm giác luôn đồng hành cùng nhau dù cách xa.

## Cách hoạt động

1. Hai người tạo tài khoản, một người tạo "bình thư" và chia sẻ mã mời 6 ký
   tự, người còn lại nhập mã để ghép đôi.
2. Mỗi ngày chỉ có một lượt mở bình, luân phiên giữa hai người. Người đến
   lượt bốc một gợi ý ngẫu nhiên rồi viết yêu cầu thật của riêng mình.
3. Người nhận có 7 ngày để hoàn thành, có thể để lại vài dòng khi xác nhận
   xong. Người gửi có thể thả cảm xúc để ăn mừng cùng nhau.
4. Lịch sử các lá thư đã hoàn thành/hết hạn được lưu lại như một cuốn nhật
   ký chung.

## Công nghệ

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma 7 (driver adapters) + PostgreSQL (`@prisma/adapter-pg`)
- Xác thực bằng cookie phiên JWT (`jose`) + mật khẩu băm bằng `bcryptjs`

## Bắt đầu (local)

Cần một database Postgres đang chạy (local hoặc cloud, ví dụ tạo miễn phí
tại [neon.tech](https://neon.tech)).

```bash
npm install
cp .env.example .env   # điền DATABASE_URL + AUTH_SECRET của riêng bạn
npx prisma migrate dev
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Biến môi trường

Xem `.env.example`. Cần có:

- `DATABASE_URL` — chuỗi kết nối Postgres.
- `AUTH_SECRET` — chuỗi bí mật để ký session, tạo bằng
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Deploy lên Vercel

1. Tạo một database Postgres miễn phí, ví dụ tại
   [neon.tech](https://neon.tech) hoặc [supabase.com](https://supabase.com),
   rồi lấy connection string của nó.
2. Trên [vercel.com](https://vercel.com), chọn **Add New → Project** và kết
   nối repo GitHub này.
3. Trong phần **Environment Variables** của project, thêm:
   - `DATABASE_URL` = connection string ở bước 1
   - `AUTH_SECRET` = một chuỗi ngẫu nhiên riêng (xem lệnh ở trên)
4. Bấm **Deploy**. Lệnh `npm run build` đã được cấu hình để tự chạy
   `prisma migrate deploy` trước khi build, nên schema sẽ tự động được áp
   dụng vào database — không cần thao tác thủ công nào thêm.
5. Sau lần deploy đầu tiên, mỗi lần push lên nhánh chính Vercel sẽ tự động
   build & deploy lại, và mọi migration mới (nếu có) cũng được áp dụng tự
   động nhờ bước 4.
