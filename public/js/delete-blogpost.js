const deletePostFormHandler = async (event) => {
    event.preventDefault();

    // collect id of blogpost
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

      if (id) {
        // send a DELETE request to api endpoint
        const response = await fetch(`/api/blogposts/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // if successful, redirect the browser to the dashboard
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
      }
};

document
    .querySelector('#delete-post-btn').addEventListener('click', deletePostFormHandler);