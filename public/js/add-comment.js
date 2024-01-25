const newCommentFormHandler = async (event) => {
    event.preventDefault();

    // collect values from comment form
    const comment = document.getElementById('comment-content').value.trim();

    // get blogpost id
    const blogpost_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    console.log(comment);
    console.log(blogpost_id);

    if (comment) {
        // send a POST request to api endpoint
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ blogpost_id, comment }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // if successful, reload the window to show new comment
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
};

document
    .querySelector('#comment-form')
    .addEventListener('submit', newCommentFormHandler);