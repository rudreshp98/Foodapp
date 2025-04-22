$((function(){
  // User data management functions
  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  function clearCurrentUser() {
    localStorage.removeItem('currentUser');
  }

  // Check if user is logged in and update menu
  function checkLoginStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log("User is logged in (custom.js):", currentUser);
      // Replace login/register links with user info and logout
      const menuItems = $('.menu ul');
      if (menuItems.length) {
        // Find and update the login link
        const loginLi = menuItems.find('a[href="login.html"]').parent();
        if (loginLi.length) {
          loginLi.html(`<a href="#" class="hvr-underline-from-center">Welcome, ${currentUser.name} <i class="fa fa-user"></i></a>`);
        }
        
        // Find and replace register link with logout
        const registerLi = menuItems.find('a[href="register.html"]').parent();
        if (registerLi.length) {
          registerLi.html(`<a href="#" id="logout-btn" class="hvr-underline-from-center">Logout <i class="fa fa-sign-out"></i></a>`);
          
          // Add logout event listener
          $('#logout-btn').on('click', function(e) {
            e.preventDefault();
            // Clear current user
            clearCurrentUser();
            console.log("User logged out (custom.js)");
            window.location.href = "index.html";
          });
        }
      }
    } else {
      console.log("No user is logged in (custom.js)");
    }
  }

  // Call checkLoginStatus on page load
  checkLoginStatus();

  $(window).scroll((function(){$(this).scrollTop()<50?($("nav").removeClass("site-top-nav"),$("#back-to-top").fadeOut()):($("nav").addClass("site-top-nav"),$("#back-to-top").fadeIn())})),$("#shopping-cart").on("click",(function(){$("#cart-content").toggle("blind","",500)})),$("#back-to-top").click((function(t){t.preventDefault(),$("html, body").animate({scrollTop:0},1e3)})),$(document).on("click",".btn-delete",(function(t){t.preventDefault(),$(this).closest("tr").remove(),function(){let t=0;$("#cart-content tr").each((function(){const n=parseFloat($(this).find("td:nth-child(5)").text().replace("$",""));isNaN(n)||(t+=n)})),$("#cart-content th:nth-child(5)").text("$"+t.toFixed(2)),$(".tbl-full th:nth-child(6)").text("$"+t.toFixed(2))}()}))
}));