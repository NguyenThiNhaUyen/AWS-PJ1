# 🚇 Metropolitano Train Service – AWS Cloud Architecture

## 📝 Giới thiệu
Metropolitano Train Service là hệ thống vận hành tàu điện hiện đại hóa giao thông đô thị, chạy trên AWS Cloud với các mục tiêu:

- Hiệu năng cao
- Khả năng mở rộng linh hoạt
- Bảo mật nhiều lớp
- CI/CD tự động hóa
- Thu thập & phân tích dữ liệu theo thời gian thực

---

# 🏛️ 1. Kiến trúc tổng thể

## 🌍 Global Access Layer
- **Route 53** – DNS routing
- **CloudFront** – CDN tăng tốc truy cập
- **AWS WAF** – Bảo vệ khỏi tấn công web

---

## 🏢 Application Layer (VPC)

### Public Subnet → EC2
- Chạy backend Spring Boot
- Nhận request từ CloudFront/WAF
- Triển khai qua CodeDeploy

### Private Subnet → RDS
- Database (PostgreSQL/MySQL/MSSQL)
- Không public Internet
- Chỉ EC2 được phép truy cập

---

## ⚙️ CI/CD Pipeline

1. Developer push code lên GitLab  
2. **CodePipeline** trigger build  
3. **CodeBuild**: build + test  
4. **CodeDeploy**: deploy lên EC2  
5. Zero downtime deployment

---

## 📡 Event & Messaging
- **EventBridge** – Xử lý sự kiện hệ thống
- **SNS** – Gửi thông báo (SMS, Email)
- **SQS** – Queue xử lý bất đồng bộ

---

## 📊 Analytics & Reporting
- **Kinesis** – Thu thập dữ liệu real-time
- **S3** – Lưu dữ liệu thô & log
- **QuickSight** – Dashboard phân tích

---

## 🔍 Monitoring
- **CloudWatch** – Logs, metrics, alarms

---

# 🔁 2. Luồng hoạt động chính

## 1️⃣ Người dùng truy cập hệ thống
1. User → Route 53  
2. Route 53 → CloudFront  
3. CloudFront → WAF  
4. WAF → EC2  

## 2️⃣ Backend xử lý
- EC2 nhận request
- Giao tiếp với RDS
- Trả dữ liệu về CloudFront → User

## 3️⃣ Sự kiện nội bộ
- EC2 phát sự kiện → EventBridge  
- EventBridge phân phối đến:
  - SNS (thông báo)
  - SQS (background jobs)
  - Kinesis (phân tích dữ liệu)

## 4️⃣ Phân tích
- Kinesis → S3  
- QuickSight đọc S3 → Dashboard

## 5️⃣ CI/CD
- GitLab → CodePipeline  
- Build → CodeBuild  
- Deploy → CodeDeploy → EC2  

# 🏗️ Kiến trúc hệ thống Metropolitano – AWS

                    ┌───────────────────────────┐
                    │          USERS            │
                    └──────────────┬────────────┘
                                   │
                              (HTTP/HTTPS)
                                   │
                     ┌─────────────▼──────────────┐
                     │        Route 53            │
                     └─────────────┬──────────────┘
                                   │
                          DNS + Routing
                                   │
                     ┌─────────────▼──────────────┐
                     │        CloudFront          │
                     └─────────────┬──────────────┘
                                   │
                             DDoS / Web Filter
                                   │
                     ┌─────────────▼──────────────┐
                     │            WAF             │
                     └─────────────┬──────────────┘
                                   │
                                   ▼
                  ┌───────────────────────────────────────┐
                  │                 VPC                   │
                  │───────────────────────────────────────│
                  │                                       │
                  │   PUBLIC SUBNET                       │
                  │   ┌───────────────────────────────┐   │
                  │   │             EC2               │   │
                  │   │  (Spring Boot Backend API)    │   │
                  │   └───────────────────────────────┘   │
                  │                 │                     │
                  │                 │ JDBC                │
                  │                 ▼                     │
                  │   PRIVATE SUBNET                      │
                  │   ┌───────────────────────────────┐   │
                  │   │              RDS              │   │
                  │   │     (Database: MSSQL)         │   │
                  │   └───────────────────────────────┘   │
                  └───────────────────────────────────────┘

                                   │
                                   ▼
         ┌──────────────────────────────────────────────────────┐
         │                     Event System                     │
         │──────────────────────────────────────────────────────│
         │  EventBridge   |   SNS (notifications)  |   SQS Queue│
         └──────────────────────────────────────────────────────┘

                                   │
                                   ▼
         ┌──────────────────────────────────────────────────────┐
         │                 Analytics & Reporting                │
         │──────────────────────────────────────────────────────│
         │   Kinesis  →  S3 → QuickSight Dashboard              │
         └──────────────────────────────────────────────────────┘


# CI/CD Pipeline
GitLab → CodePipeline → CodeBuild → CodeDeploy → EC2

# Monitoring
CloudWatch (Logs, Metrics, Alerts)



---

# 🔐 4. Bảo mật
- WAF lọc tấn công web  
- VPC tách public/private  
- RDS không public  
- IAM phân quyền tối thiểu  
- CloudWatch cảnh báo theo thời gian thực  

---

# 🚀 5. Ưu điểm
- Tốc độ cao
- Bảo mật mạnh
- Tự động hóa CI/CD
- Phân tích real-time
- Dễ mở rộng

---

# 🧾 6. Công nghệ sử dụng

| Layer | Service |
|-------|---------|
| App | EC2, RDS |
| Security | WAF, IAM, VPC |
| Delivery | Route 53, CloudFront |
| CI/CD | CodePipeline, CodeBuild, CodeDeploy |
| Messaging | EventBridge, SNS, SQS |
| Analytics | Kinesis, S3, QuickSight |
| Monitoring | CloudWatch |

---

# 📌 7. Kết luận
Kiến trúc AWS này mang lại tốc độ, bảo mật và khả năng mở rộng rất cao, phù hợp cho hệ thống vận hành tàu điện quy mô lớn.


