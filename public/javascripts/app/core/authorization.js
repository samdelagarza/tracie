define([
    './settings'
], function(settings) {
    var token = null,
        userId = null,
        tokenKey = 'token_' + settings.apiKey,
        userIdKey = 'userId_' + settings.apiKey,
        readAuthToken = function() {
            var storedToken = localStorage[tokenKey],
                storedUserId = localStorage[userIdKey],
                currentTime = new Date(),
                tokenObj = {},
                userIdObj = {},
                differenceInMinutes = null,
                hashPairs = window.location.hash.substring(1).split('&');

            if ((storedToken === undefined || storedToken === null) ||
                (storedUserId === undefined || storedUserId === null)) {
                // retrieve the tokens from the url if available

                if (hashPairs.length > 1) {
                    token = hashPairs[0].split('access_token=')[1];
                    userId = hashPairs[1].split('userid=')[1];

                    if (token.length > 0) {
                        writeAuthToken(token.replace('%3d%3d', '=='), userId);
                        window.location.href = settings.baseUrl;
                    }
                }
                else {
                    return;
                }
            }
            storedToken = localStorage[tokenKey];
            storedUserId = localStorage[userIdKey];

            tokenObj = JSON.parse(storedToken);
            userIdObj = JSON.parse(storedUserId);

            differenceInMinutes = ((currentTime.getTime() - tokenObj.timestamp) / 1000 / 60);

            if (differenceInMinutes > 90) {
                storedToken = undefined;
                removeAuthToken();
                return;
            }
            if (storedToken && storedUserId) {
                token = tokenObj.token;
                userId = userIdObj.userId;
            } else {
                token = null;
            }
        },
        writeAuthToken = function(token, userId) {
            var milliseconds = 30 * 60 * 1000, // 30 minutes
                expiresOn = (new Date()).setTime((new Date().getTime() + milliseconds));
            localStorage[tokenKey] = JSON.stringify({timestamp: expiresOn, token: token});
            localStorage[userIdKey] = JSON.stringify({timestamp: expiresOn, userId: userId});
        },
        removeAuthToken = function() {
            localStorage.removeItem(tokenKey);
            localStorage.removeItem(userIdKey);
        };

    readAuthToken();

    return {
        init: function() {
            readAuthToken();
        },
        isLoggedIn: function() {
            var tokenObj = {},
                currentTime = new Date();

            if(localStorage[tokenKey] === undefined || localStorage[tokenKey] === null){
                return false;
            }

            tokenObj = JSON.parse(localStorage[tokenKey]);

            return ((currentTime.getTime() - tokenObj.timestamp) / 1000 / 60) < 90;
        },
        getToken: function() {
            return token;
        },
        login: function() {
            var apiKey = settings.apiKey,
                redirectUri = settings.baseUrl + '/';

            window.location.href = settings.webApiBaseUrl + '/authorize?client_id=' + apiKey + '&response_type=token&redirect_uri=' + redirectUri;
        },
        loginWithGoToken: function() {
            writeAuthToken('go', 'omgjsam');
            window.location.reload(true);
        },
        logout: function() {
            token = userId = null;
            removeAuthToken();
            window.location.reload(true);
        }
    };
});