async function login(event) {
    event.preventDefault();

    let usernameInput = document.getElementById("username").value;
    let passwordInput = document.getElementById("password").value;

    try {
        await fetch("https://backend-for-students-production.up.railway.app/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        })
        .then(response => {
            if (!response.ok) {
                alert("Помилка входу! Перевірте логін та пароль.");
                throw new Error("Неправильні дані");
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", usernameInput);
            
            updateButton();
            document.getElementById("modal-toggle").checked = false;
            alert(`Вітаємо, ${usernameInput}! Ви успішно увійшли.`);
        });
    } catch (error) {
        console.error("Помилка запиту логіну:", error);
    }
}

async function register(event) {
    event.preventDefault();

    let usernameInput = document.getElementById("username").value;
    let passwordInput = document.getElementById("password").value;

    try {
        await fetch("https://backend-for-students-production.up.railway.app/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        })
        .then(response => {
            if (!response.ok) {
                alert("Помилка! Можливо, такий користувач вже існує.");
                throw new Error("Користувач вже існує");
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", usernameInput);
            
            updateButton();
            document.getElementById("modal-toggle").checked = false;
            alert(`Вітаємо, ${usernameInput}! Ви успішно зареєструвалися.`);
        });
    } catch (error) {
        console.error("Помилка запиту реєстрації:", error);
    }
}

function updateButton() {
    let btn = document.getElementById("signin-btn");
    if (!btn) return;
    
    if (localStorage.getItem("token")) {
        btn.innerText = `👤 ${localStorage.getItem("username")}`;
        btn.setAttribute("onclick", "logout(event)");
    } else {
        btn.innerText = "SIGN IN";
        btn.removeAttribute("onclick");
    }
}

function logout(event) {
    event.preventDefault(); 
    
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    
    updateButton();
    alert("Ви вийшли з акаунта.");
}

// Функція для показу/сховування пароля
function togglePassword() {
    let pwdInput = document.getElementById("password");
    let eyeIcon = document.getElementById("eye-icon");
    
    // Якщо пароль прихований (зірочки) — показуємо його
    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        eyeIcon.innerText = "🙈"; // Змінюємо іконку, щоб показати, що він відкритий
    } else {
        // Якщо пароль відкритий — знову ховаємо
        pwdInput.type = "password";
        eyeIcon.innerText = "👁️"; // Повертаємо звичайне око
    }
}

// Запускаємо перевірку при завантаженні сторінки
updateButton();