const CLIENT_ID = '3048603692475146719';
const REDIRECT_URI = 'https://rblxdeveloper.github.io/DarkMotive/';

document.getElementById('login').addEventListener('click', () => {
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid profile user.inventory-item:read`;
    window.location.href = authUrl;
});

// Function to handle OAuth code exchange and user data storage
async function handleOAuthResponse() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
        try {
            const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    client_secret: 'RBX-sHWvSZ3wK0GRDh8gQapg6MGLwGouqOGkqmOIMjSN_zeoX3EEz0HNYF1lfNCpw7Tn',
                }),
            });

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            localStorage.setItem('access_token', accessToken);

            const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = await userResponse.json();

            // Example: Store user ID in localStorage
            localStorage.setItem('user', userData.sub);

            // Redirect to home page
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Error during OAuth flow:', error);
        }
    }
}

// Call handleOAuthResponse on window load
window.onload = handleOAuthResponse;