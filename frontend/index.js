import { getTalkSession } from 'https://cdn.jsdelivr.net/npm/@talkjs/core@1.5.8';
let params = new URLSearchParams(document.location.search);
let name = params.get("name");
if (!name){
    let name = "Frank";

}

const appId = 'tKAe9pYx';

const userId = name;
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
