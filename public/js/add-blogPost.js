const newPostFormHandler = async (event) => {
    event.preventDefault();

    // collect values from new blogpost form
    const title = document.querySelector('#post-title').value;
    const content = document.querySelector('#post-content').value;

    if (title && content) {
        // send a POST request to api endpoint
        const response = await fetch('/api/blogposts', {
            method: 'POST',
            body: JSON.stringify({ title, content }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // if successful, redirect the broswer to the dashboard page
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

document
    .querySelector('#new-post-form')
    .addEventListener('submit', newPostFormHandler);