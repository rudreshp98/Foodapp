document.addEventListener("DOMContentLoaded", (function() {
  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((e => {
    e.addEventListener("click", (function() {
      const e = this.previousElementSibling;
      "password" === e.type ? (e.type = "text", this.classList.remove("fa-eye-slash"), this.classList.add("fa-eye")) : (e.type = "password", this.classList.remove("fa-eye"), this.classList.add("fa-eye-slash"))
    }))
  }));

  // Input focus handling
  document.querySelectorAll(".input-group input").forEach((e => {
    e.addEventListener("focus", (function() {
      this.parentElement.classList.add("focused")
    })), e.addEventListener("blur", (function() {
      "" === this.value && this.parentElement.classList.remove("focused")
    })), "" !== e.value && e.parentElement.classList.add("focused")
  }));

  // Error handling functions
  function e(e, s) {
    t(e);
    const n = document.createElement("div");
    n.className = "input-error", n.textContent = s, e.classList.add("error"), e.parentElement.appendChild(n)
  }

  function t(e) {
    e.classList.remove("error");
    const t = e.parentElement.querySelector(".input-error");
    t && t.remove()
  }

  // User data management functions
  function getUsersArray() {
    return JSON.parse(localStorage.getItem('usersArray')) || [];
  }

  function saveUsersArray(usersArray) {
    localStorage.setItem('usersArray', JSON.stringify(usersArray));
  }

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  function clearCurrentUser() {
    localStorage.removeItem('currentUser');
  }

  function findUserByEmail(email) {
    const users = getUsersArray();
    return users.find(user => user.email === email) || null;
  }

  function addUser(userData) {
    const users = getUsersArray();
    users.push(userData);
    saveUsersArray(users);
    return userData;
  }

  function updateUser(updatedUser) {
    const users = getUsersArray();
    const index = users.findIndex(user => user.email === updatedUser.email);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsersArray(users);
      if (getCurrentUser() && getCurrentUser().email === updatedUser.email) {
        saveCurrentUser(updatedUser);
      }
    }
  }

  // Check if user is logged in and update UI
  function checkLoginStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log("User is logged in:", currentUser);
      // Replace login/register links with user info and logout
      const menuItems = document.querySelector('.menu ul');
      if (menuItems) {
        // Find and remove the login link
        const loginLink = menuItems.querySelector('a[href="login.html"]');
        if (loginLink) {
          const loginLi = loginLink.parentElement;
          const userHtml = `<a href="#" class="hvr-underline-from-center">Welcome, ${currentUser.name} <i class="fa fa-user"></i></a>`;
          loginLi.innerHTML = userHtml;
        }
        
        // Find and replace register link with logout
        const registerLink = menuItems.querySelector('a[href="register.html"]');
        if (registerLink) {
          const registerLi = registerLink.parentElement;
          const logoutHtml = `<a href="#" id="logout-btn" class="hvr-underline-from-center">Logout <i class="fa fa-sign-out"></i></a>`;
          registerLi.innerHTML = logoutHtml;
          
          // Add logout event listener
          document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            // Clear current user but keep in users array
            clearCurrentUser();
            console.log("User logged out, persistent data preserved");
            window.location.href = "index.html";
          });
        }
      }
    } else {
      console.log("No user is logged in");
    }
  }

  // Call checkLoginStatus on page load
  checkLoginStatus();

  // Form submission handling
  document.querySelectorAll(".auth-form form").forEach((s => {
    s.addEventListener("submit", (function(s) {
      s.preventDefault();
      let n = !0;
      this.querySelectorAll("input[required]").forEach((s => {
        var r;
        s.value.trim() ? (t(s), "email" !== s.type || (r = s.value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)) || (n = !1, e(s, "Please enter a valid email address")), "password" === s.type && "Password" === s.placeholder && s.value.length < 6 && document.querySelector(".register") && (n = !1, e(s, "Password must be at least 6 characters long"))) : (n = !1, e(s, "This field is required"))
      }));

      const r = document.querySelector(".register");
      if (r) {
        const t = r.querySelector('input[placeholder="Password"]'),
          s = r.querySelector('input[placeholder="Confirm Password"]');
        t.value !== s.value && (n = !1, e(s, "Passwords do not match"))
      }

      if (n) {
        // If validation succeeds
        if (document.querySelector('.register')) {
          // Check if email already exists
          const email = document.querySelector('input[placeholder="Email Address"]').value;
          const existingUser = findUserByEmail(email);
          
          if (existingUser) {
            // Email already registered
            const emailInput = document.querySelector('input[placeholder="Email Address"]');
            n = false;
            e(emailInput, "This email is already registered");
            return;
          }
          
          // Registration successful - store user data
          const userData = {
            name: document.querySelector('input[placeholder="Full Name"]').value,
            email: email,
            password: document.querySelector('input[placeholder="Password"]').value,
          };
          
          // Add to users array
          addUser(userData);
          console.log("User registered:", userData);
          
          // Show success message and redirect to login page
          this.closest(".auth-form").innerHTML = '<div class="success-message"><i class="fa fa-check-circle"></i><h3>Registration Successful!</h3><p>You will be redirected to login page shortly...</p></div>';
          setTimeout((() => {
            window.location.href = "login.html"
          }), 2e3);
        } else if (document.querySelector('.login')) {
          // Login - check if user exists with matching credentials
          const email = document.querySelector('input[type="email"]').value;
          const password = document.querySelector('input[type="password"]').value;
          const emailInput = document.querySelector('input[type="email"]');
          const passwordInput = document.querySelector('input[type="password"]');
          
          // Find user by email
          const foundUser = findUserByEmail(email);
          
          // For debugging
          console.log('Trying to login with:', email, password);
          console.log('Found user:', foundUser);
          
          // Check if user exists and password matches
          if (foundUser && foundUser.password === password) {
            // Valid login - set current user
            saveCurrentUser(foundUser);
            console.log("User logged in:", foundUser);
            
            // Show success message and redirect
            this.closest(".auth-form").innerHTML = '<div class="success-message"><i class="fa fa-check-circle"></i><h3>Login Successful!</h3><p>You will be redirected shortly...</p></div>';
            setTimeout((() => {
              window.location.href = "index.html"
            }), 2e3);
          } else if (foundUser) {
            // User exists but password is incorrect
            n = false;
            e(passwordInput, "Incorrect password");
          } else {
            // User does not exist
            n = false;
            e(emailInput, "Account not found. Please register first");
          }
        }
      }
    }))
  }));

  // Add CSS for styling
  const s = document.createElement("style");
  s.textContent = "\n    .input-group .input-error {\n      color: #e74c3c;\n      font-size: 12px;\n      margin-top: 5px;\n      position: absolute;\n      bottom: -18px;\n    }\n    \n    .input-group input.error {\n      border-color: #e74c3c !important;\n    }\n    \n    .success-message {\n      text-align: center;\n      padding: 30px;\n      animation: fadeIn 0.5s ease-in-out;\n    }\n    \n    .success-message i {\n      font-size: 60px;\n      color: #2ecc71;\n      margin-bottom: 15px;\n    }\n    \n    .success-message h3 {\n      color: #2ecc71;\n      margin-bottom: 10px;\n    }\n  ";
  document.head.appendChild(s)
}));