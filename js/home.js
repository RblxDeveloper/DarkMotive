document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem('user');
    if (userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                const userData = doc.data();
                console.log('User info loaded:', userData);

                const preferredUsername = userData.username || 'User';
                const profilePicture = userData.profilePicture;

                document.getElementById('username').innerText = preferredUsername;
                document.getElementById('username-side').innerText = preferredUsername;
                document.getElementById('profile-picture').src = profilePicture;
                document.getElementById('profile-picture-side').src = profilePicture;
                document.getElementById('profile-picture').alt = `${preferredUsername}'s profile picture`;
                document.getElementById('profile-picture-side').alt = `${preferredUsername}'s profile picture`;

                // Check premium status and update subscription buttons
                if (userData.premium) {
                    updateSubscriptionStatus('premium-subscribe-btn', true);
                    updateSubscriptionStatus('exclusive-subscribe-btn', true);
                } else {
                    updateSubscriptionStatus('premium-subscribe-btn', false);
                    updateSubscriptionStatus('exclusive-subscribe-btn', false);
                }
            } else {
                console.error('User document not found');
                window.location.href = 'index.html'; // Redirect to login if user data not found
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            window.location.href = 'index.html'; // Redirect to login on error
        }
    } else {
        window.location.href = 'index.html'; // Redirect to login if user not authenticated
    }

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});

async function checkGamePassOwnership(userId, gamePassId) {
    try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy
        const apiUrl = `https://inventory.roblox.com/v1/users/${userId}/items/GamePass/${gamePassId}/is-owned`;

        const response = await fetch(proxyUrl + apiUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });

        if (response.ok) {
            const ownershipData = await response.json();
            return ownershipData.isOwned;
        } else {
            console.error('Failed to check game pass ownership:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error checking game pass ownership:', error);
        return false;
    }
}

function updateSubscriptionStatus(buttonId, isSubscribed) {
    const button = document.getElementById(buttonId);
    if (isSubscribed) {
        button.innerText = 'Subscribed';
        button.style.backgroundColor = 'grey';
        button.removeEventListener('click', () => redirectToRoblox(gamePassId));
    } else {
        button.innerText = 'Subscribe';
        button.style.backgroundColor = '#8e44ad';
        button.addEventListener('click', () => redirectToRoblox(gamePassId));
    }
}

function redirectToRoblox(gamePassId) {
    window.location.href = `https://www.roblox.com/game-pass/${gamePassId}`;
}