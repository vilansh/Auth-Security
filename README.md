# 🔐 Backend Authentication & Security

A secure authentication system using **Node.js, Express, MySQL, bcrypt, and environment variables** to store user credentials safely. This project follows best practices for **hashing & salting passwords**, as well as keeping sensitive data out of version control.

---

## 🚀 Features
✅ **User Registration & Login** with Hashed Passwords  
✅ **bcrypt for Hashing & Salting Passwords**  
✅ **Environment Variables for Security (`dotenv`)**  
✅ **MySQL Database Integration**  
✅ **Error Handling & Security Best Practices**  

---

## 🔑 **Why Hash & Salt Passwords?**
Storing **plaintext passwords** in a database is a **major security risk**. If the database is compromised, all user credentials would be exposed.

Instead, we use **bcrypt** to **hash** and **salt** passwords before storing them:
- **Hashing**: Converts passwords into a fixed-length string that cannot be reversed.  
- **Salting**: Adds a **random unique value** to each password before hashing to prevent **rainbow table attacks**.

#### 📌 **Example: How bcrypt Works**
1. A user enters their password: `mypassword123`
2. `bcrypt` generates a random **salt** and hashes the password:
   ```
   $2b$10$somesaltvaluehere$hashedoutputhere
   ```
3. The hashed password is **stored in the database** (NOT the plaintext password).

When a user logs in, bcrypt:
1. Fetches the stored hash.
2. Hashes the entered password **with the same salt**.
3. Compares both values—if they match, authentication succeeds.

---

## 🔐 **Using bcrypt for Secure Authentication**
### 🔹 **Hashing & Storing Passwords in `/register`**
```js
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // Hash the password with salt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store in MySQL
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        await queryPromise(sql, [username, hashedPassword]);

        res.render("secrets");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});
```

---

### 🔹 **Verifying Passwords in `/login`**
```js
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // Retrieve hashed password from database
        const sql = "SELECT * FROM users WHERE username = ?";
        const results = await queryPromise(sql, [username]);

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid Username or Password" });
        }

        const storedHashedPassword = results[0].password;

        // Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Username or Password" });
        }

        res.render("secrets");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to login user" });
    }
});
```

---

## 🌍 **Using Environment Variables for Security**
Never hardcode sensitive credentials (e.g., database passwords) in your code. Instead, use a **`.env` file** and the **`dotenv`** package.

### 🔹 **Step 1: Install dotenv**
```sh
npm install dotenv
```

### 🔹 **Step 2: Create a `.env` File**
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=secrets
```

### 🔹 **Step 3: Load `.env` in Your App**
At the **top** of `app.js`, add:
```js
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
```

---

## 🛠 **Setting Up This Project**
1️⃣ **Clone the repository**  
```sh
git clone https://github.com/YOUR_USERNAME/MERN-Auth-Security.git
cd MERN-Auth-Security
```
  
2️⃣ **Install dependencies**  
```sh
npm install
```

3️⃣ **Create a `.env` file** and configure database credentials.

4️⃣ **Run the application**  
```sh
node app.js
```

---

## 📌 **Best Practices for Deployment**
✅ **Never push `.env` files** – Use `.gitignore` to exclude them.  
✅ **Use HTTPS** for secure API requests.  
✅ **Use rate limiting & validation** to prevent brute force attacks.  
✅ **Store session tokens securely** (consider `jsonwebtoken`).  

---

## 📜 **License**
This project is open-source and free to use under the **MIT License**.

---

## 🚀 **Contribute**
Feel free to contribute by submitting **issues** or **pull requests**!  
💡 **Want to improve security?** Implement JWT authentication or OAuth.
