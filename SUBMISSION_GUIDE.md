# 📚 IBM Express Book Reviews — دليل الرفع والإجابات

## الخطوة 1: Fork الريبو من IBM

1. افتحي: https://github.com/ibm-developer-skills-network/expressBookReviews
2. اضغطي زر **Fork** (أعلى يمين)
3. اختاري اسم حسابك وانتظري الـ Fork يكتمل
4. الريبو هيبقى عندك على: `https://github.com/YOUR_USERNAME/expressBookReviews`

---

## الخطوة 2: استبدال الملفات على GitHub

بعد الـ Fork، هتبدلي 3 ملفات مباشرة من GitHub (بدون كود!):

### استبدال `final_project/router/general.js`:
1. افتحي الملف في ريبوك
2. اضغطي على أيقونة **القلم** (Edit)
3. احذفي كل المحتوى والصقي الكود الموجود في ملف `general.js`
4. اضغطي **Commit changes**

### استبدال `final_project/router/auth_users.js`:
نفس الخطوات مع ملف `auth_users.js`

---

## الخطوة 3: تشغيل السيرفر محلياً

```bash
cd final_project
npm install
node index.js
# هتشوفي: Server is running at port 5000
```

---

## الخطوة 4: الـ cURL Commands وإجاباتها

### ⚡ شغّلي الـ commands دي بالترتيب في Terminal جديد

---

### Q1 — Fork Verification
```bash
curl https://api.github.com/repos/YOUR_USERNAME/expressBookReviews > githubrepo
cat githubrepo
```
**المطلوب في الإجابة:** ابحثي عن `"fork": true` و `"parent"` و `"source"` اللي بتشير لـ `ibm-developer-skills-network`

---

### Q2 — Get All Books
```bash
curl http://localhost:5000/ > getallbooks
cat getallbooks
```
**الإجابة المتوقعة:**
```json
{"1":{"author":"Chinua Achebe","title":"Things Fall Apart","reviews":{}},"2":{"author":"Hans Christian Andersen","title":"Fairy tales","reviews":{}},...}
```

---

### Q3 — Get Book by ISBN
```bash
curl http://localhost:5000/isbn/1 > getbooksbyISBN
cat getbooksbyISBN
```
**الإجابة المتوقعة:**
```json
{"author":"Chinua Achebe","title":"Things Fall Apart","reviews":{}}
```

---

### Q4 — Get Books by Author
```bash
curl "http://localhost:5000/author/Jane%20Austen" > getbooksbyauthor
cat getbooksbyauthor
```
**الإجابة المتوقعة:**
```json
{"8":{"author":"Jane Austen","title":"Pride and Prejudice","reviews":{}}}
```

---

### Q5 — Get Books by Title
```bash
curl "http://localhost:5000/title/Fairy%20tales" > getbooksbytitle
cat getbooksbytitle
```
**الإجابة المتوقعة:**
```json
{"2":{"author":"Hans Christian Andersen","title":"Fairy tales","reviews":{}}}
```

---

### Q6 — Get Book Reviews
```bash
curl http://localhost:5000/review/1 > getbookreview
cat getbookreview
```
**الإجابة المتوقعة:**
```json
{}
```
(فارغ لأن مفيش reviews أُضيفت بعد)

---

### Q7 — Register New User
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' > register
cat register
```
**الإجابة المتوقعة:**
```json
{"message":"User successfully registered. Now you can login"}
```

---

### Q8 — Login
```bash
curl -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' > login
cat login
```
**الإجابة المتوقعة:**
```json
{"message":"User successfully logged in","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

---

### Q9 — Add Review
```bash
curl -b cookies.txt -X PUT \
  "http://localhost:5000/customer/auth/review/1?review=Great%20Book" > reviewadded
cat reviewadded
```
**الإجابة المتوقعة:**
```json
{"message":"Review for ISBN 1 added/updated successfully","reviews":{"testuser":"Great Book"}}
```

---

### Q10 — Delete Review
```bash
curl -b cookies.txt -X DELETE \
  "http://localhost:5000/customer/auth/review/1" > deletereview
cat deletereview
```
**الإجابة المتوقعة:**
```json
{"message":"Review for ISBN 1 deleted successfully","reviews":{}}
```

---

## Q11 — GitHub URL

بعد رفع الكود، الرابط هيكون:
```
https://github.com/YOUR_USERNAME/expressBookReviews/blob/main/final_project/router/general.js
```

استبدلي `YOUR_USERNAME` باسم حسابك على GitHub.

---

## ⚠️ نقاط مهمة

- لازم السيرفر شغّال وانتي بتشغلي الـ cURL commands
- Q7 و Q8 و Q9 و Q10 لازم تتعملوا بالترتيب (register → login → review → delete)
- لو السيرفر وقف وعملتيه restart، هتحتاجي تعيدي Q7 و Q8 تاني لأن الـ users بتتمسح من الـ memory
- الـ cookies.txt بيحفظ الـ session بين Q8 و Q9 و Q10
