let params = new URLSearchParams(document.location.search);
let user = params.get("name");
if(!user || user == null){
  window.location.href="http://"+location.host;
}
document.getElementById("pong").addEventListener("click", function(){
    window.location.href = "http://" + window.location.host+`/pong?name=${user}`;
});

document.getElementsByName("noGames").forEach(element => {
    element.addEventListener("click", function(){
        TriggerToast("Sorry, this game is not available yet. Please check back later!", "Game Unavailable", "red");
    })});

function TriggerToast(message,title,colour){
  console.log("triggered");
  toastTitle.innerHTML = title
  toastBody.innerHTML = message
  toastMessage.style.backgroundColor = colour
  toastImg.src = "../fish/spinning-fish.gif"
  
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastMessage)
  toastBootstrap.show()
}