let params = new URLSearchParams(document.location.search);
let user = params.get("name");
if(!user || user == null){
  window.location.href="http://"+location.host
}
document.getElementById("pong").addEventListener("click", function(){
    window.location.href = "http://" + window.location.host+`/pong?name=${user}`
});