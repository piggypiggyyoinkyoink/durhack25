let params = new URLSearchParams(document.location.search);

document.getElementById("pong").addEventListener("click", function(){
    let name = params.get("name");
    window.location.href = "http://" + window.location.host+`/pong?name=${name}`
});