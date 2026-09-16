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
- Prisma 7 (driver adapters) + SQLite (`@prisma/adapter-better-sqlite3`)
- Xác thực bằng cookie phiên JWT (`jose`) + mật khẩu băm bằng `bcryptjs`

## Bắt đầu

```bash
npm install
cp .env.example .env   # rồi thay AUTH_SECRET bằng một chuỗi ngẫu nhiên riêng
npx prisma migrate dev
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Biến môi trường

Xem `.env.example`. Cần có `DATABASE_URL` (đường dẫn SQLite) và
`AUTH_SECRET` (chuỗi bí mật để ký session, tạo bằng
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
