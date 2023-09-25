const editPostFormHandler = async (event) => {
    event.preventDefault();

    // collect values from edit blogpost form
    const title = document.querySelector('#edit-title').value;
    const content = document.querySelector("#edit-content").value;

    if (title && content) {
        // send a POST request to api endpoint
        const response = await fetch('/api/blogposts/:id', {
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
    .querySelector('#edit-post-form')
    .addEventListener('submit', editPostFormHandler);
