import { getTalkSession } from 'https://cdn.jsdelivr.net/npm/@talkjs/core@1.5.8';
const userId = ""

let params = new URLSearchParams(document.location.search);
let name = params.get("name");
if (!name){
    let name = "Frank";

}

document.getElementById("EnterLogins").addEventListener('submit',async function(event){
      event.preventDefault();
      const Loginform = document.getElementById("EnterLogins")
      console.log("hello1")
      const LoginData = new FormData(Loginform);
        let response =  await fetch('/api/user/${logininfomation.Username}')
        let logininfomation = await response.json()
        logininfomation.forEach(logininfomation => {
            userId = logininfomation.Username

                  })
      
           
      
})

const appId = 'tKAe9pYx';


console.log("USERID " + userId)
const otherUserId = 'nina';
const conversationId = 'my_conversation';

const session = getTalkSession({
    // @ts-ignore
    host: 'durhack.talkjs.com',
    appId,
    userId,
});

session.currentUser.createIfNotExists({ name: name });
session.user(otherUserId).createIfNotExists({ name: 'Nina' });

const conversation = session.conversation(conversationId);
conversation.createIfNotExists();
conversation.participant(otherUserId).createIfNotExists();
