# SWAPNEAT – Smart Reuse and Exchange Platform

> “Give What You Don’t Need. Find What You Need.”

SWAPNEAT is a modern, responsive full-stack web application built exclusively for the state of **Tamil Nadu, India**. It empowers citizens across all 38 districts to reuse, exchange, and donate pre-loved items, diverting solid waste from landfills and cultivating zero-waste circular communities.

---

## 📍 Strict Tamil Nadu Location Restriction

SWAPNEAT is strictly restricted to Tamil Nadu, India:
- **No other Indian state or foreign location is accepted** on frontend or backend.
- Users and item listings are mapped strictly into:
  **Tamil Nadu → District → City/Town/Village**
- All **38 districts of Tamil Nadu** are supported:
  1. Ariyalur
  2. Chengalpattu
  3. Chennai
  4. Coimbatore
  5. Cuddalore
  6. Dharmapuri
  7. Dindigul
  8. Erode
  9. Kallakurichi
  10. Kancheepuram
  11. Karur
  12. Krishnagiri
  13. Madurai
  14. Mayiladuthurai
  15. Nagapattinam
  16. Kanniyakumari
  17. Namakkal
  18. Perambalur
  19. Pudukottai
  20. Ramanathapuram
  21. Ranipet
  22. Salem
  23. Sivaganga
  24. Tenkasi
  25. Thanjavur
  26. Theni
  27. Thoothukudi
  28. Tiruchirappalli
  29. Tirunelveli
  30. Tirupathur
  31. Tiruppur
  32. Tiruvallur
  33. Tiruvannamalai
  34. Tiruvarur
  35. Vellore
  36. Viluppuram
  37. Virudhunagar
  38. The Nilgiris

If a user tries to enter or select any other state or country, the platform informs them:
> **“SwapNeat is currently available only in Tamil Nadu.”**

---

## 🚀 Key Features

1. **User Registration & JWT Authentication**
   - Verified registration with Mobile Number, Email, Password, and District/Town.
   - State is permanently fixed to Tamil Nadu.
   - Bcrypt password hashing & secure JSON Web Tokens.

2. **Smart Location-Based Matching**
   - Prioritizes matches based on item requirement and location:
     1. **High Match:** Same City/Town
     2. **Medium Match:** Same District
     3. **Other Match:** Across Tamil Nadu
   - Never recommends an item outside Tamil Nadu.

3. **Item Exchange Workflow**
   - Three Exchange Types: **Give Away** (100% Free), **Exchange** (Mutual Barter), and **Donate** (Students/NGOs).
   - Detailed condition ratings: *Like New*, *Gently Used*, *Good*, *Fair*.
   - Safe approximate location landmarks (e.g., Near Bus Stand) without exposing private home addresses.

4. **Request & Exchange System**
   - Status tracking: *Pending*, *Accepted*, *Rejected*, *Completed*, *Cancelled*.
   - In-app messaging for coordinating safe public pickups.

5. **Tamil Nadu Circular Analytics & Sustainability Dashboard**
   - Live metrics: Total items reused, estimated solid waste diverted (kg), and CO₂ emissions offset.
   - District-level activity rankings (Chennai, Coimbatore, Madurai, Virudhunagar, Salem, etc.).

6. **Bilingual Localization (English & தமிழ்)**
   - Instant toggle between English and Tamil across all key UI labels, categories, and district names.

7. **Admin Moderation Console**
   - Community report moderation (Fake listings, Spam, Inappropriate content).
   - District distribution monitoring and listing management.

8. **Mobile-Responsive with App-like Bottom Navigation**
   - Bottom navigation bar: *Home, Browse, Post, Requests, Profile*.

---

## 🛠 Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB compatible data store with JSON state persistence
- **Security:** Bcrypt.js, JSON Web Tokens (JWT)

---

## 🔑 Pre-Configured Demo Credentials

Use any of these demo accounts for instant testing:
- **Karthik Subramanian (Sivakasi, Virudhunagar):** `karthik@swapneat.in` / `password123`
- **Priya Soundar (T. Nagar, Chennai):** `priya@swapneat.in` / `password123`
- **Anand Natarajan (Coimbatore):** `anand@swapneat.in` / `password123`
- **Tamil Nadu Admin (State Moderator):** `admin@swapneat.in` / `password123`
