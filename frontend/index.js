import { getTalkSession } from 'https://cdn.jsdelivr.net/npm/@talkjs/core@1.5.8';
          
const appId = 'tKAe9pYx';

const userId = 'frank';
const otherUserId = 'nina';
const conversationId = 'my_conversation';

const session = getTalkSession({
    // @ts-ignore
    host: 'durhack.talkjs.com',
    appId,
    userId,
});

session.currentUser.createIfNotExists({ name: 'Frank' });
session.user(otherUserId).createIfNotExists({ name: 'Nina' });

const conversation = session.conversation(conversationId);
conversation.createIfNotExists();
conversation.participant(otherUserId).createIfNotExists();