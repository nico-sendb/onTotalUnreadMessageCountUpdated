

var APP_ID = 'ENTER-YOUR-APPLICATION-ID-HERE';
var CHANNEL_URL = 'ENTER-ANY-CHANNEL-URL-HERE';

/**
 * Initialize Sendbird
 * You should have this already implemented in your application
 */
var sb = new SendBird({ appId: APP_ID });

/**
 * Connect to Sendbird Websocket
 * You should have this already implemented in your application
 */
function connect() {
    const USER_ID = document.getElementById('userId').value;
    sb.connect(USER_ID, (user, error) => {
        if (error) {
            alert(error);
            return;
        } else {
            // Show DIV once connected
            document.getElementById('onceConnected').style.display = 'inline-block';
            // Show USER ID once connected
            document.getElementById('userConnected').innerHTML = 
                `<p>User: ${ user.userId } </p>`;
            // Here we set a Handler
            setUserHandler();
        }
    });
}

/**
 * This is the implementation you need to check
 */
function setUserHandler() {
    const UNIQUE_HANDLER_ID = '123456';
    var userEventHandler = new sb.UserEventHandler();
    userEventHandler.onTotalUnreadMessageCountUpdated = (totalCount, countByCustomTypes) => {
        // Show on screen the total unread messages
        const inputBox = document.getElementById('newMessageMark');
        inputBox.innerHTML = `<p>${ totalCount } unread messages <span class="redCircle"></span></p>`;
        inputBox.style.display = 'inline-block';
    };
    sb.addUserEventHandler(UNIQUE_HANDLER_ID, userEventHandler);
}

/**
 * Helper functions - These should be already implemented in your application
 */
function sendMessage() {
    getMessage( channel => {
        var inputBox = document.getElementById('message');
        var messageText = inputBox.value;
        const params = new sb.UserMessageParams();
        params.message = messageText;
        channel.sendUserMessage(params, (message, error) => {
            if (error) {
                console.log('Error sending message:');
                alert(error);
                return;
            }
            appendMessage(messageText);
            inputBox.value = '';
            inputBox.focus();
        });    
    })
}
function getMessage(callback) {
    sb.GroupChannel.getChannel(CHANNEL_URL, (groupChannel, error) => {
        callback(groupChannel);
    })
}
function appendMessage(message) {
    document.getElementById('messages').append(message);
}