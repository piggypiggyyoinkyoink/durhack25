// Handle login form submission
document.getElementById("EnterLogins").addEventListener('submit',async function(event){
      event.preventDefault();
      const Loginform = document.getElementById("EnterLogins");
      console.log("hello1");
      const LoginData = new FormData(Loginform);
      console.log(LoginData.get("Username"));
      var name = LoginData.get("Username");
      let response =  await fetch(`/api/user/${name}`);
      let logininfomation = await response.json();
      console.log(logininfomation);

      if (logininfomation.exists){
            window.location.href = `games.html?name=${name}`;
      }
        
})