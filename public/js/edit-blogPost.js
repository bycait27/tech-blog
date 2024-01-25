const editPostFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the edit blogpost form
    const title = document.querySelector('#edit-title').value;
    const content = document.querySelector('#edit-content').value;

    // get the id of the blogpost to edit from the URL
    const blogpost_id = window.location.pathname.split('/').pop();

    console.log(title);
    console.log(content);
    console.log(blogpost_id);

    if (title && content) {
        // send a PUT request to the API endpoint
        const response = await fetch(`/api/blogposts/${blogpost_id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content }),  // Exclude blogpost_id from the payload
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // if successful, redirect the browser to the dashboard page
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};

document
    .querySelector('#edit-post-form')
    .addEventListener('submit', editPostFormHandler);
