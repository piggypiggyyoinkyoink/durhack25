const userId = ""


document.getElementById("EnterLogins").addEventListener('submit',async function(event){
      event.preventDefault();
      const Loginform = document.getElementById("EnterLogins")
      console.log("hello1")
      const LoginData = new FormData(Loginform);
        let response =  await fetch('/api/user/${logininfomation.Username}')
        let logininfomation = await response.json()
        console.log(logininfomation)
        logininfomation.forEach(logininfomation => {
            userId = logininfomation.Username

                  })
      
           
      
})
