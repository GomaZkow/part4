document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadFifteenComments();
    window.addEventListener('popstate', handleRouting);
});

const apiBaseUrl = 'https://jsonplaceholder.typicode.com';

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

async function loadUsers() {
    const users = await fetchData(`${apiBaseUrl}/users`);
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const userLink = document.createElement('a');
        userLink.href = `#user/${user.id}`;
        userLink.className = 'user-link';

        const listItem = document.createElement('li');
        listItem.textContent = user.name;

        userLink.appendChild(listItem);
        userList.appendChild(userLink);
    });

    document.querySelectorAll('.user-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            displayUserDetails(event.currentTarget.href.split('/').pop());
        });
    });
}

async function displayUserDetails(userId) {
    const user = await fetchData(`${apiBaseUrl}/users/${userId}`);
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    loadComments(userId);
    toggleView('user-details');
}

async function loadComments(userId) {
    const comments = await fetchData(`${apiBaseUrl}/comments?postId=${userId}`);
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const listItem = document.createElement('li');
        listItem.textContent = comment.body;
        commentsList.appendChild(listItem);
    });
}

async function loadFifteenComments() {
    const comments = await fetchData(`${apiBaseUrl}/comments`);
    const fifteenCommentsList = document.getElementById('fifteen-comments-list');
    fifteenCommentsList.innerHTML = '';
    comments.slice(0, 15).forEach(comment => { // Получаем только первые 15 комментариев
        const listItem = document.createElement('li');
        listItem.textContent = comment.body;
        fifteenCommentsList.appendChild(listItem);
    });
}

function handleRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#user/')) {
        displayUserDetails(hash.split('/')[1]);
    } else {
        toggleView('user-list');
    }
}

function toggleView(view) {
    document.getElementById('user-list').style.display = view === 'user-list' ? 'block' : 'none';
    document.getElementById('user-details').style.display = view === 'user-details' ? 'block' : 'none';
}
