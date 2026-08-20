📄 Product Requirement Document (PRD): Kolify Tracker
1. Product Overview
Product Name: Kolify Tracker (Micro SaaS)
Objective: เครื่องมือติดตามผลลัพธ์ (Engagement) ของแคมเปญ Influencer Marketing แบบรวดเร็วและจ่ายตามจริง (Pay-as-you-go) เน้นไปที่ TikTok เป็นหลัก และทำหน้าที่เป็นสะพานเชื่อม (Upsell) ผู้ใช้งานไปยังแพลตฟอร์ม Kolify.one
2. Target Audience
เอเจนซี่โฆษณา, แบรนด์ขนาดกลาง-เล็ก (SME), และ Influencer Manager ที่ต้องการทำ Report อย่างรวดเร็ว
3. Core Features & User Flow
🔐 3.1 Authentication: ระบบ Login/Signup แบบง่าย (เน้น Google Single Sign-On)
💳 3.2 Credit System (Omise Integration):
ระบบเติมเครดิตอัตโนมัติ 1 Credit = ~5 บาท
หัก 1 Credit / 1 Link สำหรับ Standard Track
หัก 3 Credits / 1 Link สำหรับ Auto-Track 7 วัน
📥 3.3 Data Input & AI Formatting:
Download Template: ไฟล์ Excel ที่มีคอลัมน์ Name, Link, Followers, Category, Tags
Smart Import: AI ช่วยจับคู่คอลัมน์ให้อัตโนมัติ หากลูกค้านำไฟล์ Format อื่นมาอัปโหลด
Manual Input: ตารางกรอกข้อมูลบนหน้าเว็บ พร้อมฟีเจอร์ Auto-Tiering (ระบบจัดกลุ่ม Macro/Micro อัตโนมัติจากยอด Followers)
⚙️ 3.4 Tracking Engine:
ระบบ Validate Link ก่อนเริ่ม (เช็คว่าลิงก์พังไหม ก่อนตัดเครดิต)
หน้าจอ Loading ระหว่างบอททำงาน (แสดงโลโก้ Kolify หมุน)
📊 3.5 Dashboard & Export:
แสดง Overall Performance และ Top 5 Leaderboard (แบ่งตาม Tiers/Category ได้)
ปุ่ม Export to PDF (ติดโลโก้ Kolify)
🗄️ 3.6 Campaign Historical Data:
เก็บ Raw Data และ Dashboard เป็นรายแคมเปญ
แสดงค่า Delta (+/-) เมื่อมีการเข้ามากด Track ซ้ำ





🗺️ 1. Kolify Tracker: System Architecture & Data Flow
เราจะแบ่งระบบหลังบ้านออกเป็น 5 Microservices (โมดูลย่อย) เพื่อให้ระบบสเกลได้ง่ายและไม่ดึงโหลดกันเองครับ
Module 1: Auth & User Management
Flow: User เข้าเว็บ -> กด Login with Google -> สร้าง Account ใน DB -> รับ JWT Token เพื่อใช้งาน API
Module 2: Credit & Payment Gateway (Omise/Opn)
Flow: User กด Top-up -> Backend สร้าง Payment Intent ส่งให้ Omise -> User สแกนจ่าย -> Omise ยิง Webhook กลับมาที่ Backend -> Backend อัปเดตยอด Credit ในฐานข้อมูล -> แจ้งเตือน User (WebSocket/Polling) ว่าเครดิตเข้าแล้ว
Module 3: Campaign & Data Input Processor
Flow (Excel): User อัปโหลดไฟล์ -> ส่งให้ AI Column Mapper (LLM) ช่วยอ่านและจับคู่หัวคอลัมน์ -> เข้าสู่กระบวนการ Auto-Tiering (จัดกลุ่ม Macro/Micro จากยอด Followers) -> บันทึกลงตารางชั่วคราว
Flow (Pre-check): ระบบทำการ Validate Links (เช็คว่าเป็นลิงก์ TikTok/Shopee จริงไหม และลิงก์ไม่เสีย) -> แจ้งเตือนสถานะให้ User ทราบ
Module 4: Tracking Engine (The Worker)
Flow: User กด Start Tracking -> Backend หักเครดิต -> ส่งคำสั่งเข้า Message Queue (เช่น Redis/RabbitMQ) -> Worker Server (เซิร์ฟเวอร์ที่รันโค้ด Python DrissionPage ของเรา) รับงานไปทำทีละลิงก์ -> เมื่อดึง Data เสร็จ อัปเดตผลลัพธ์กลับมาที่ Database (ทีละแถว)
Module 5: Analytics & Dashboard Generator
Flow: ดึง Raw Data จาก DB -> คำนวณผลรวม (Total) และหา Delta Variance (เทียบกับข้อมูลรอบก่อนหน้า) -> ส่ง Data ให้ Frontend วาดกราฟ -> ถ้า User กด Export Backend จะใช้เครื่องมือแปลง HTML เป็น PDF (พร้อมแปะโลโก้ Kolify) แล้วส่งไฟล์ให้ดาวน์โหลด










📊 2. System Architecture Diagram 

graph TD
    %% User & Client
    User((User / Client))
    
    %% Frontend Application
    subgraph Frontend [Kolify Tracker UI (React/Vue)]
        UI_Auth[Login / SSO]
        UI_Workspace[Workspace & Input]
        UI_Dash[Dashboard & Export]
        UI_History[Campaign History]
    end

    %% External Services
    subgraph External [External APIs]
        Google[Google OAuth]
        Omise[Omise / Opn Payment]
        OpenAI[AI Formatting / Mapper]
    end

    %% Backend Services (API Gateway)
    subgraph Backend [Backend API (Node.js / Python / Go)]
        API_Auth[Auth Service]
        API_Billing[Billing & Webhook]
        API_Campaign[Campaign Manager]
        API_Report[Report & PDF Generator]
    end

    %% Tracking Engine (Python Workers)
    subgraph Engine [Tracking Engine (DrissionPage / Selenium)]
        Queue[(Message Queue\nRedis / RabbitMQ)]
        Worker_TikTok[TikTok Scraper Node]
        Worker_Shopee[Shopee Scraper Node]
    end

    %% Databases
    subgraph Database [Database Cluster (PostgreSQL / MongoDB)]
        DB_Users[(Users & Credits)]
        DB_Campaigns[(Campaigns Meta)]
        DB_RawData[(Raw Tracking Data & Snapshots)]
    end

    %% --- Connections ---

    %% Auth Flow
    User -->|Logs in| UI_Auth
    UI_Auth <--> API_Auth
    API_Auth <--> Google
    API_Auth --> DB_Users

    %% Payment Flow
    User -->|Buys Credits| UI_Workspace
    UI_Workspace --> API_Billing
    API_Billing --> Omise
    Omise -.->|Webhook Success| API_Billing
    API_Billing --> DB_Users

    %% Input Flow
    User -->|Upload Excel / Manual| UI_Workspace
    UI_Workspace --> API_Campaign
    API_Campaign <--> OpenAI
    API_Campaign --> DB_Campaigns

    %% Tracking Flow
    UI_Workspace -->|Start Track (Deduct Credit)| API_Campaign
    API_Campaign -->|Push Job| Queue
    Queue --> Worker_TikTok
    Queue --> Worker_Shopee
    Worker_TikTok -.->|Save Data| DB_RawData
    Worker_Shopee -.->|Save Data| DB_RawData

    %% Dashboard & History Flow
    User -->|View Results| UI_Dash
    User -->|View History| UI_History
    UI_Dash --> API_Report
    UI_History --> API_Report
    API_Report --> DB_RawData
    API_Report --> DB_Campaigns

🗄️ 3. แนะนำการวางโครงสร้าง Database (Database Schema Guide)
Table 1: Users
user_id (PK)
email, name, company
credit_balance (Int) -> สำคัญมาก ต้องทำ Transaction Lock ตอนหักเครดิตเพื่อป้องกันการกดเบิ้ล (Race condition)
Table 2: Campaigns
campaign_id (PK)
user_id (FK)
campaign_name
status (Pending, Tracking, Completed)
created_at, updated_at
Table 3: Campaign_Posts (เก็บรายชื่อ Influencer ที่ใส่เข้ามา)
post_id (PK)
campaign_id (FK)
influencer_name, platform (TikTok/Shopee), post_link
followers_count, tier (Auto-generated), category, tags
tracking_status (Valid, Invalid, Scraped)
Table 4: Tracking_Snapshots (หัวใจหลักของระบบ DB)
ตารางนี้จะบันทึกข้อมูล "ทุกครั้ง" ที่กด Track เพื่อให้สืบประวัติย้อนหลังได้
snapshot_id (PK)
post_id (FK)
batch_id (เอาไว้จัดกลุ่มว่ากด Track ครั้งที่ 1, 2, 3)
views, likes, comments, shares, saves
tracked_at (Timestamp)






🎨 1. Design System & Moodboard (บรีฟสไตล์ของงาน)
Vibe: คลีน, ทันสมัย, ดูน่าเชื่อถือแบบแอปการเงิน/สถิติ (Data-Driven SaaS)
Colors:
Primary Action (ปุ่มหลัก): ใช้สีรุ้ง/Gradient จากโลโก้ Kolify (ส้ม-ชมพู-ม่วง-ฟ้า) เพื่อกระตุ้นการกด
Background: เน้นสีขาว และเทาอ่อน เพื่อขับให้ข้อมูลที่เป็นตัวเลข (Data) โดดเด่น
Status Colors: ต้องมีสี 🟢 เขียว (ผ่าน/บวก), 🔴 แดง (พัง/ลบ), 🟡 เหลือง (กำลังประมวลผล)
📱 2. Screen-by-Screen Component List (เช็คลิสต์สิ่งที่ต้องวาดในแต่ละหน้า)
🖥️ หน้า 1: Login / Sign up
[ ] ภาพกราฟิกฝั่งซ้าย (อิงโลโก้ Kolify)
[ ] ช่องกรอก Email / Password
[ ] ปุ่ม Log in with Google (เน้นให้ใหญ่และเด่นที่สุด)
🖥️ หน้า 2: Workspace (หน้าหลัก) หน้าที่ยากที่สุด
[ ] Top Navbar: โลโก้, ลิงก์เมนู, สถานะเครดิตคงเหลือ, รูปโปรไฟล์
[ ] Header: ช่องกรอกชื่อ Campaign
[ ] Import Area: กล่องสี่เหลี่ยมเส้นประ สำหรับลากไฟล์มาวาง (Drag & Drop)
[ ] Data Table: ตารางที่มีคอลัมน์ (Influencer, Link, Followers, Category, Tags)
[ ] Bottom Bar (Sticky): แถบติดขอบจอด้านล่าง สรุปค่าใช้จ่ายเครดิต และปุ่ม "Start Tracking"
🖥️ หน้า 3: Tracking Progress (หน้าโหลด)
[ ] แอนิเมชันโลโก้ Kolify หมุนๆ หรือ Progress Bar
[ ] ข้อความ "Extracting Data... Please do not close"
🖥️ หน้า 4: Dashboard (หน้ารายงาน)
[ ] Hero Metrics: การ์ดสี่เหลี่ยม 4 ใบ โชว์ตัวเลขใหญ่ๆ (Total Views, Likes, Comments, ER%)
[ ] Leaderboard Table: ตารางจัดอันดับ โชว์ป้ายกำกับ Tier (Macro/Micro) สวยๆ
[ ] Upsell Banner: ป้ายโฆษณาชวนไปใช้ Kolify.one
[ ] ปุ่ม Export to PDF
🖥️ หน้า 5: Campaign History (หน้าฐานข้อมูล)
[ ] รายการแคมเปญเก่าเรียงลงมา
[ ] คอลัมน์ "Delta (+/-)" เพื่อโชว์การเติบโต เช่น +12,400 📈 (สีเขียว)
[ ] ปุ่ม Download .CSV ของแต่ละรอบ
🖥️ หน้า 6: Top-Up (หน้าซื้อเครดิต)
[ ] การ์ดแพ็กเกจราคา 3 ใบ (Starter, Pro, Agency) ให้ใบตรงกลาง (Pro) ใหญ่และเด่นกว่าเพื่อน
[ ] ส่วนแสดงยอดสรุปที่จะต้องจ่าย และปุ่มชำระเงินผ่าน Omise
