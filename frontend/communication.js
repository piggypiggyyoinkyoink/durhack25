async function messageHandler(form, field, message, conversationId, userId){
    let form = document.getElementById(form);
    message.preventDefault();
    let inputField = document.getElementById(field)
    let msg = inputField.value
    console.log(msg);
    const data = JSON.stringify({
        "message": msg,
        "conversation":conversationId,
        "user":userId
    });
    const response = await fetch("/sendmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
    });
    if (response.ok){
        document.getElementById(field).value = "";
    }
}