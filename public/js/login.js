const loginFormHandler = async (event) => {
    event.preventDefault();
  
    // collect values from the login form
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (username && password) {
      try {
          // send a POST request to the API endpoint
          const response = await fetch('/api/users/login', {
              method: 'POST',
              body: JSON.stringify({ username, password }),
              headers: { 'Content-Type': 'application/json' },
          });
          
          console.log(username);
          console.log(password);
          
          if (response.ok) {
              // if successful, redirect the browser to the profile page
              document.location.replace('/dashboard');
          } else {
              const errorData = await response.json();
              alert(`Login failed: ${errorData.message || 'Please check your credentials and try again.'}`);
          }
      } catch (error) {
          console.error('Login error:', error);
          alert('An error occurred during login. Please try again.');
      }
    } else {
        alert('Please enter both username and password');
    }
  };
  
  const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    console.log('Attempting signup with:', { username, passwordLength: password.length });
  
    if (username && password && password.length >= 8) {
      try {
          const response = await fetch('/api/users', {
              method: 'POST',
              body: JSON.stringify({ username, password }),
              headers: { 'Content-Type': 'application/json' },
          });
    
          if (response.ok) {
              document.location.replace('/dashboard');
          } else {
              const errorData = await response.json();
              alert('Username required and password must be at least 8 characters');
              alert(`Error: ${errorData.message || response.statusText}`);
          }
      } catch (error) {
          console.error('Signup error:', error);
          alert('An error occurred during signup. Please try again.');
      }
  }
 };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);
  
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);