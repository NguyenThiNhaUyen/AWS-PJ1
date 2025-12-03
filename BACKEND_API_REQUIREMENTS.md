# 📋 BACKEND API REQUIREMENTS

**Ngày:** 03/12/2025  
**Dự án:** Metropolitano Metro System  
**Yêu cầu từ:** Frontend Team

---

## 🎯 TỔNG QUAN

Frontend đã tạo sẵn **25 API functions** và đang gọi các endpoints sau. Backend cần implement **19 endpoints** trong **7 controllers**.

---

## ✅ APIs ĐÃ CÓ BACKEND (Không cần làm thêm)

| Endpoint | Method | Controller | Status |
|----------|--------|------------|--------|
| `/api/admin/stats/summary` | GET | AdminStatsController | ✅ Đã có |
| `/api/admin/stats/revenue-by-day` | GET | AdminStatsController | ✅ Đã có |
| `/api/admin/stats/top-routes` | GET | AdminStatsController | ✅ Đã có |
| `/api/auth/login` | POST | AuthController | ✅ Đã có |
| `/api/auth/register` | POST | AuthController | ✅ Đã có |
| `/api/tickets/my` | GET | TicketController | ✅ Đã có |
| `/api/routes` | GET | RouteController | ✅ Đã có |
| `/api/routes/{lineName}/stations` | GET | RouteController | ✅ Đã có |

---

## ❌ APIs CẦN TẠO MỚI

### 📊 **PRIORITY 1: User Dashboard (Cần gấp nhất)** ⭐⭐⭐

#### 1.1. UserStatsController.java

**Location:** `backend/src/main/java/com/metro/metropolitano/controller/UserStatsController.java`

```java
package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.UserStatsDTO;
import com.metro.metropolitano.dto.UserTicketDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user/stats")
@RequiredArgsConstructor
public class UserStatsController {
    
    // ❌ ENDPOINT 1: GET /api/user/stats/summary?accountId={id}
    @GetMapping("/summary")
    public UserStatsDTO getSummary(@RequestParam Long accountId) {
        // TODO: Implement
        // Query: 
        // SELECT 
        //   COUNT(*) as totalTickets,
        //   SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as activeTickets,
        //   SUM(CASE WHEN status = 'USED' THEN 1 ELSE 0 END) as usedTickets,
        //   SUM(price) as totalSpent
        // FROM Ticket
        // WHERE account_id = ?
        return null;
    }
    
    // ❌ ENDPOINT 2: GET /api/user/stats/recent-tickets?accountId={id}&limit={n}
    @GetMapping("/recent-tickets")
    public List<UserTicketDTO> getRecentTickets(
        @RequestParam Long accountId,
        @RequestParam(defaultValue = "3") int limit
    ) {
        // TODO: Implement
        // Query:
        // SELECT TOP {limit} 
        //   id, 
        //   CONCAT(start_station, ' → ', end_station) as route,
        //   price,
        //   status,
        //   FORMAT(created_at, 'dd/MM/yyyy') as purchaseDate
        // FROM Ticket
        // WHERE account_id = ?
        // ORDER BY created_at DESC
        return null;
    }
}
```

**DTOs cần tạo:**

`UserStatsDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {
    private int totalTickets;      // Tổng số vé
    private int activeTickets;     // Vé đang hoạt động
    private int usedTickets;       // Vé đã sử dụng
    private long totalSpent;       // Tổng chi tiêu (VNĐ)
}
```

`UserTicketDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTicketDTO {
    private Long id;
    private String route;          // "Bến Thành → Thủ Đức"
    private long price;            // Giá vé (VNĐ)
    private String status;         // PAID, ACTIVE, USED
    private String purchaseDate;   // "01/12/2025"
}
```

**Frontend đang gọi:**
```javascript
// UserDashboard.jsx - line ~25
const [statsData, ticketsData] = await Promise.all([
  userStatsAPI.getStats(user.id),              // → /api/user/stats/summary
  userStatsAPI.getRecentTickets(user.id, 3)    // → /api/user/stats/recent-tickets
])
```

---

### 📊 **PRIORITY 2: Admin Management (Quan trọng)** ⭐⭐

#### 2.1. AdminTicketController.java

**Location:** `backend/src/main/java/com/metro/metropolitano/controller/AdminTicketController.java`

```java
package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.AdminTicketDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tickets")
@RequiredArgsConstructor
public class AdminTicketController {
    
    // ❌ ENDPOINT 3: GET /api/admin/tickets?page={n}&size={n}&search={text}
    @GetMapping
    public Page<AdminTicketDTO> getAllTickets(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String search
    ) {
        // TODO: Implement with pagination
        // Query:
        // SELECT 
        //   t.id,
        //   a.username,
        //   a.full_name as fullName,
        //   CONCAT(t.start_station, ' → ', t.end_station) as route,
        //   t.ticket_type_name as ticketType,
        //   t.price,
        //   t.status,
        //   t.created_at as purchaseDate
        // FROM Ticket t
        // JOIN Account a ON t.account_id = a.id
        // WHERE (search IS NULL OR 
        //        t.id LIKE %search% OR 
        //        a.username LIKE %search% OR
        //        a.full_name LIKE %search%)
        // ORDER BY t.created_at DESC
        // LIMIT {size} OFFSET {page * size}
        return null;
    }
    
    // ❌ ENDPOINT 4: GET /api/admin/tickets/{id}
    @GetMapping("/{id}")
    public AdminTicketDTO getTicketDetails(@PathVariable Long id) {
        // TODO: Implement - Chi tiết 1 vé
        return null;
    }
    
    // ❌ ENDPOINT 5: DELETE /api/admin/tickets/{id}
    @DeleteMapping("/{id}")
    public void cancelTicket(@PathVariable Long id) {
        // TODO: Implement - Hủy vé (set status = CANCELLED)
    }
}
```

**DTO cần tạo:**

`AdminTicketDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminTicketDTO {
    private Long id;
    private String username;       // Tên đăng nhập
    private String fullName;       // Họ tên người mua
    private String route;          // "Bến Thành → Thảo Điền"
    private String ticketType;     // "Vé lượt", "Vé ngày"...
    private long price;            // Giá vé
    private String status;         // PAID, ACTIVE, USED, CANCELLED
    private LocalDateTime purchaseDate;
}
```

---

#### 2.2. AdminUserController.java

**Location:** `backend/src/main/java/com/metro/metropolitano/controller/AdminUserController.java`

```java
package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.AdminUserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    
    // ❌ ENDPOINT 6: GET /api/admin/users?page={n}&size={n}&search={text}
    @GetMapping
    public Page<AdminUserDTO> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String search
    ) {
        // TODO: Implement with pagination
        // Query:
        // SELECT 
        //   id, username, email, full_name, role, 
        //   CASE WHEN is_active = 1 THEN 'Active' ELSE 'Locked' END as status,
        //   created_at
        // FROM Account
        // WHERE (search IS NULL OR username LIKE %search% OR email LIKE %search%)
        // ORDER BY created_at DESC
        return null;
    }
    
    // ❌ ENDPOINT 7: GET /api/admin/users/{id}
    @GetMapping("/{id}")
    public AdminUserDTO getUserDetails(@PathVariable Long id) {
        // TODO: Implement - Chi tiết user
        return null;
    }
    
    // ❌ ENDPOINT 8: POST /api/admin/users
    @PostMapping
    public AdminUserDTO createUser(@RequestBody AdminUserDTO dto) {
        // TODO: Implement - Tạo user mới
        // Validate: username unique, email unique
        // Hash password before save
        return null;
    }
    
    // ❌ ENDPOINT 9: PUT /api/admin/users/{id}
    @PutMapping("/{id}")
    public AdminUserDTO updateUser(
        @PathVariable Long id, 
        @RequestBody AdminUserDTO dto
    ) {
        // TODO: Implement - Cập nhật thông tin user
        return null;
    }
    
    // ❌ ENDPOINT 10: PATCH /api/admin/users/{id}/toggle-status
    @PatchMapping("/{id}/toggle-status")
    public void toggleUserStatus(@PathVariable Long id) {
        // TODO: Implement - Khóa/mở khóa user
        // Toggle is_active field: true → false, false → true
    }
}
```

**DTO cần tạo:**

`AdminUserDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;           // ADMIN, CUSTOMER
    private String status;         // Active, Locked
    private LocalDateTime createdAt;
}
```

---

#### 2.3. AdminPaymentController.java

**Location:** `backend/src/main/java/com/metro/metropolitano/controller/AdminPaymentController.java`

```java
package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.AdminPaymentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {
    
    // ❌ ENDPOINT 11: GET /api/admin/payments?page={n}&size={n}&status={text}
    @GetMapping
    public Page<AdminPaymentDTO> getAllPayments(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String status
    ) {
        // TODO: Implement with pagination
        // Query:
        // SELECT 
        //   p.id,
        //   p.vnpay_txn_ref as transactionId,
        //   p.ticket_id as ticketId,
        //   a.username,
        //   p.amount,
        //   'VNPay' as method,
        //   p.status,
        //   p.created_at as timestamp
        // FROM Payment p
        // JOIN Ticket t ON p.ticket_id = t.id
        // JOIN Account a ON t.account_id = a.id
        // WHERE (status IS NULL OR p.status = ?)
        // ORDER BY p.created_at DESC
        return null;
    }
    
    // ❌ ENDPOINT 12: GET /api/admin/payments/{id}
    @GetMapping("/{id}")
    public AdminPaymentDTO getPaymentDetails(@PathVariable Long id) {
        // TODO: Implement - Chi tiết payment
        return null;
    }
}
```

**DTO cần tạo:**

`AdminPaymentDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPaymentDTO {
    private Long id;
    private String transactionId;  // Mã giao dịch VNPay
    private Long ticketId;         // ID vé
    private String username;       // Người mua
    private long amount;           // Số tiền
    private String method;         // "VNPay"
    private String status;         // SUCCESS, FAILED, PENDING
    private LocalDateTime timestamp;
}
```

---

### 📊 **PRIORITY 3: Advanced Features (Có thể làm sau)** ⭐

#### 3.1. AdminRouteController.java

```java
package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.RouteStatsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/routes")
@RequiredArgsConstructor
public class AdminRouteController {
    
    // ❌ ENDPOINT 13: GET /api/admin/routes/stats
    @GetMapping("/stats")
    public List<RouteStatsDTO> getAllRoutesWithStats() {
        // TODO: Implement
        // Query:
        // SELECT 
        //   r.line_name as lineName,
        //   r.station_count as stationCount,
        //   COUNT(t.id) as ticketsSold,
        //   COALESCE(SUM(t.price), 0) as revenue,
        //   'ACTIVE' as status
        // FROM Route r
        // LEFT JOIN Ticket t ON t.start_station IN (SELECT station_name FROM Station WHERE line_name = r.line_name)
        // GROUP BY r.line_name, r.station_count
        return null;
    }
    
    // ❌ ENDPOINT 14: GET /api/admin/routes/{lineName}
    @GetMapping("/{lineName}")
    public RouteStatsDTO getRouteDetails(@PathVariable String lineName) {
        // TODO: Implement - Chi tiết 1 tuyến
        return null;
    }
}
```

**DTO cần tạo:**

`RouteStatsDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteStatsDTO {
    private String lineName;       // "Bến Thành - Bến xe Suối Tiên"
    private int stationCount;      // 14
    private int ticketsSold;       // 2286
    private long revenue;          // Tổng doanh thu (VNĐ)
    private String status;         // "ACTIVE"
}
```

---

#### 3.2. AdminFareController.java

```java
package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.FareDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/fares")
@RequiredArgsConstructor
public class AdminFareController {
    
    // ❌ ENDPOINT 15: GET /api/admin/fares
    @GetMapping
    public List<FareDTO> getAllFares() {
        // TODO: Implement
        // Có thể từ Fare table hoặc hardcode config
        // Hiện tại: Vé lượt 6.000-19.000 VNĐ theo khoảng cách
        return null;
    }
    
    // ❌ ENDPOINT 16: PUT /api/admin/fares/{id}
    @PutMapping("/{id}")
    public FareDTO updateFare(
        @PathVariable Long id, 
        @RequestBody FareDTO dto
    ) {
        // TODO: Implement - Cập nhật giá vé
        return null;
    }
    
    // ❌ ENDPOINT 17: POST /api/admin/fares
    @PostMapping
    public FareDTO createFare(@RequestBody FareDTO dto) {
        // TODO: Implement - Tạo loại giá mới
        return null;
    }
}
```

**DTO cần tạo:**

`FareDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FareDTO {
    private Long id;
    private String name;           // "Người lớn", "Trẻ em"...
    private String description;    // Mô tả
    private long price;            // Giá (VNĐ)
    private boolean isActive;      // Đang áp dụng?
}
```

---

#### 3.3. ScheduleController.java

```java
package com.metro.metropolitano.controller;

import com.metro.metropolitano.dto.ScheduleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    
    // ❌ ENDPOINT 18: GET /api/schedules/upcoming?limit={n}
    @GetMapping("/upcoming")
    public List<ScheduleDTO> getUpcomingSchedules(
        @RequestParam(defaultValue = "6") int limit
    ) {
        // TODO: Implement
        // Nếu có bảng Schedule/Trip:
        // SELECT TOP {limit} 
        //   station_name as station,
        //   'Bến Thành - Bến xe Suối Tiên' as line,
        //   status,
        //   FORMAT(scheduled_time, 'HH:mm') as time
        // FROM Schedule
        // WHERE scheduled_time > GETDATE()
        // ORDER BY scheduled_time ASC
        
        // Nếu chưa có: Return mock data hoặc empty array
        return null;
    }
    
    // ❌ ENDPOINT 19: GET /api/schedules/line/{lineName}
    @GetMapping("/line/{lineName}")
    public List<ScheduleDTO> getSchedulesByLine(@PathVariable String lineName) {
        // TODO: Implement - Lịch theo tuyến
        return null;
    }
}
```

**DTO cần tạo:**

`ScheduleDTO.java`:
```java
package com.metro.metropolitano.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {
    private String station;        // "Bến Thành"
    private String line;           // "Bến Thành - Bến xe Suối Tiên"
    private String status;         // "ACTIVE", "PRICING" (optional)
    private String time;           // "10:00"
}
```

---

## 📊 BẢNG TỔNG HỢP

| # | Endpoint | Method | Controller | DTO | Priority |
|---|----------|--------|------------|-----|----------|
| 1 | `/api/user/stats/summary` | GET | UserStatsController | UserStatsDTO | ⭐⭐⭐ |
| 2 | `/api/user/stats/recent-tickets` | GET | UserStatsController | UserTicketDTO | ⭐⭐⭐ |
| 3 | `/api/admin/tickets` | GET | AdminTicketController | AdminTicketDTO | ⭐⭐ |
| 4 | `/api/admin/tickets/{id}` | GET | AdminTicketController | AdminTicketDTO | ⭐⭐ |
| 5 | `/api/admin/tickets/{id}` | DELETE | AdminTicketController | - | ⭐ |
| 6 | `/api/admin/users` | GET | AdminUserController | AdminUserDTO | ⭐⭐ |
| 7 | `/api/admin/users/{id}` | GET | AdminUserController | AdminUserDTO | ⭐ |
| 8 | `/api/admin/users` | POST | AdminUserController | AdminUserDTO | ⭐ |
| 9 | `/api/admin/users/{id}` | PUT | AdminUserController | AdminUserDTO | ⭐ |
| 10 | `/api/admin/users/{id}/toggle-status` | PATCH | AdminUserController | - | ⭐ |
| 11 | `/api/admin/payments` | GET | AdminPaymentController | AdminPaymentDTO | ⭐⭐ |
| 12 | `/api/admin/payments/{id}` | GET | AdminPaymentController | AdminPaymentDTO | ⭐ |
| 13 | `/api/admin/routes/stats` | GET | AdminRouteController | RouteStatsDTO | ⭐ |
| 14 | `/api/admin/routes/{lineName}` | GET | AdminRouteController | RouteStatsDTO | ⭐ |
| 15 | `/api/admin/fares` | GET | AdminFareController | FareDTO | ⭐ |
| 16 | `/api/admin/fares/{id}` | PUT | AdminFareController | FareDTO | ⭐ |
| 17 | `/api/admin/fares` | POST | AdminFareController | FareDTO | ⭐ |
| 18 | `/api/schedules/upcoming` | GET | ScheduleController | ScheduleDTO | ⭐ |
| 19 | `/api/schedules/line/{lineName}` | GET | ScheduleController | ScheduleDTO | ⭐ |

---

## 🗂️ DANH SÁCH FILE CẦN TẠO

### Controllers (7 files):
```
backend/src/main/java/com/metro/metropolitano/controller/
├── UserStatsController.java        ⭐⭐⭐
├── AdminTicketController.java      ⭐⭐
├── AdminUserController.java        ⭐⭐
├── AdminPaymentController.java     ⭐⭐
├── AdminRouteController.java       ⭐
├── AdminFareController.java        ⭐
└── ScheduleController.java         ⭐
```

### DTOs (8 files):
```
backend/src/main/java/com/metro/metropolitano/dto/
├── UserStatsDTO.java
├── UserTicketDTO.java
├── AdminTicketDTO.java
├── AdminUserDTO.java
├── AdminPaymentDTO.java
├── RouteStatsDTO.java
├── FareDTO.java
└── ScheduleDTO.java
```

---

## 🔧 LƯU Ý KỸ THUẬT

### 1. Pagination Response Format
Frontend expect Spring Data Page format:
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20
}
```

### 2. Date Format
- Frontend gửi: `YYYY-MM-DD` (e.g., `2025-12-03`)
- Backend trả về: 
  - DateTime: `LocalDateTime` → Frontend tự format
  - Display: `dd/MM/yyyy` (e.g., `03/12/2025`)

### 3. Error Handling
Trả về format:
```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2025-12-03T10:30:00"
}
```

### 4. Authentication
Tất cả endpoints trên đều cần JWT token trong header:
```
Authorization: Bearer {token}
```

### 5. CORS Configuration
Đảm bảo allow origin: `http://localhost:3000`

---

## 📞 LIÊN HỆ

- **Frontend Developer:** Đã tạo sẵn API calls trong `frontend/src/services/api.js`
- **Frontend Components đang chờ:** UserDashboard.jsx, AdminDashboard.jsx, MyTickets.jsx
- **Test endpoint:** Dùng Postman hoặc curl với token từ `/api/auth/login`

---

## ✅ CHECKLIST TRIỂN KHAI

- [ ] Tạo 7 Controllers
- [ ] Tạo 8 DTOs
- [ ] Implement 19 endpoints
- [ ] Test với Postman
- [ ] Thông báo Frontend khi hoàn thành
- [ ] Deploy và verify trên môi trường dev

---

**Lưu ý:** Frontend đã HOÀN TẤT phần việc của mình. Hiện tại đang dùng mock data và sẽ tự động chuyển sang real API khi backend deploy các endpoints trên.
