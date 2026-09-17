# PLAN-001: CHUNKS Unified Test Suite Implementation

## Giai đoạn 1: Khởi tạo Cấu trúc & Hạ tầng Dự án (Foundations)
1. **Thiết lập Core Project `chunks-test`**:
   - Khởi tạo thư mục `chunks-test/` với `package.json`, `tsconfig.json`, `vite.config.ts`, `vercel.json`.
   - Cài đặt Tailwind CSS v4, Motion, Lucide Icons, Recharts, @supabase/supabase-js.
   - Kết nối git với remote repository: `https://github.com/genshai-11/chunks-test`.
2. **Thiết lập Supabase Client & Model Dữ liệu**:
   - `src/lib/supabase.ts` kết nối với `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
   - Viết các typed definitions cho Learners, Test Packages, Standalone Runs, Attempts, và Blue Metrics.
   - Tạo file migration SQL mở rộng database Supabase: `blue_test_attempt_metrics` và `blue_test_component_events`.

## Giai đoạn 2: Hợp nhất Domain Engines (Domain Logic)
1. **M.C.T Timing Engine**:
   - Hàm lũy thừa $L_n = 1.86^n$, tính toán thời gian tối đa theo session $n$ và câu $j$.
   - Định dạng hiển thị và kiểm soát ngưỡng Auto-Max.
2. **7-Color Spectrum & Rules Engine**:
   - Quy tắc 7 màu: Red, Orange, Yellow, Green, Blue, Indigo, Purple.
   - Hàm chuyển đổi tỉ lệ thời gian dừng sang dải màu sắc.
   - Phân loại màu Warm (%RFC) vs Cool (%RAC, %c, %i).
3. **Cumulative Component Exposure Engine**:
   - Ma trận theo dõi $49 \times 49$ thử thách.
   - Thuật toán tính `%CPD Component Mastery` và `deriveComponentRawSummaries`.
4. **CPD Demand Engine**:
   - $CPD = CVR \times CCI$ cho Red và Green test.

## Giai đoạn 3: Xây dựng 3 Phòng Test (Test Rooms)
1. **Unified Shell & Launcher**:
   - Header hiển thị trạng thái kết nối, chọn giáo viên & chọn học viên.
   - Test Mode Launcher: Thẻ điều hướng trực quan đến Red Test, Green Test, Blue Test.
2. **🔴 Red Test Room**:
   - Trình duyệt câu hỏi 56 items, audio player gating, CVR/CCI/CPD demand bar, bảng chấm 7 màu.
3. **🟢 Green Test Room**:
   - 49 câu hỏi chia 7 sessions, audio song ngữ VI/EN, quy trình Probe Flow (Provisional Green ➔ Yellow/Blue/Indigo).
4. **🔵 Blue Test Room**:
   - 49 thử thách với 7 công cụ tương tác.
   - Đồng hồ đếm thời gian thực (Stopwatch), M.C.T progress bar, âm thanh chuông báo (start, tick, finish, ring).
   - Modal/Rail ghi nhận Component Exposure ($1..q$).

## Giai đoạn 4: Báo cáo & Phân tích Đa chiều (Unified Analytics)
1. **Instant Test Scorecard**: Báo cáo ngay sau khi kết thúc một bài test.
2. **Longitudinal Cross-Test Card**: Bảng so sánh 3 chiều (Red, Green, Blue) trên cùng một học viên.

## Giai đoạn 5: Build, Test, Git Push & Vercel Deploy
1. Typecheck (`tsc --noEmit`) và Vite build (`npm run build`).
2. Push code lên repository `https://github.com/genshai-11/chunks-test`.
3. Cấu hình Vercel domain `chunks-test`.
