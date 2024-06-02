// /* eslint-disable linebreak-style */
// const modal = document.getElementById('modal');
// const signupLink = document.getElementById('signup-link');
// const closeButton = document.querySelector('.close-button');
// const createAccountButton = document.querySelector('#create-account');
// const usernameRegisterInput = document.querySelector('#new-username');
// const passwordRegisterInput = document.querySelector('#new-password');
// const passwordRepeatInput = document.querySelector('#new-password-repeat');

// closeButton.addEventListener('click', () => {
//   modal.style.display = 'none';
// });

// signupLink.addEventListener('click', (event) => {
//   event.preventDefault();
//   modal.style.display = 'flex';
// });
// // LOGIN CHECK
// // function isCredentialsValid(username, password) {
// //   const users = JSON.parse(localStorage.getItem('users')) || [];
// //   for (let i = 0; i < users.length; i++) {
// //     if (users[i].username === username && users[i].password === password) {
// //       console.log('valid');
// //       return true; // Credentials match
// //     }
// //   }
// //   console.log('not valid');
// //   return false; // No matching credentials found
// // }

// function createAccount(username, password, passwordRepeat) {
//   const newUser = {
//     username,
//     password,
//   };
//   const users = JSON.parse(localStorage.getItem('users')) || [];
//   for (let i = 0; i < users.length; i++) {
//     if (users[i].username === newUser.username) {
//       console.log('user already exists');
//       return true; // User already exists
//     }
//   }
//   users.push(newUser);
//   localStorage.setItem('users', JSON.stringify(users));

//   return false; // User does not exist
// }

// createAccountButton.addEventListener('click', () => {
//   createAccount(
//     usernameRegisterInput.value,
//     passwordRegisterInput.value,
//     passwordRepeatInput.value,
//   );
// });

// window.addEventListener('click', (event) => {
//   if (event.target === modal) {
//     modal.style.display = 'none';
//   }
// });

// Get the modal
const modal = document.getElementById('modal');
// Get the button that opens the modal
const btnModalOpen = document.getElementById('signup-link');
// Get the <span> element that closes the modal
const closeButton = document.querySelector('.close-button');
// When the user clicks the button, open the modal
btnModalOpen.onclick = function openModal() {
  modal.style.display = 'flex';
};

function closeModal() {
  modal.style.display = 'none';
}

closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.onclick = function checkClosingModal(event) {
  if (event.target === modal) {
    closeModal();
  }
};

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find((user) => user.username === username && user.password === password);
  if (user) {
    console.log('Login successful!');
    // Redirect or do something after successful login
  } else {
    console.log('Invalid username or password.');
  }
}

// Function to handle registration
function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const repeatPassword = document.getElementById('new-password-repeat').value;
  if (password !== repeatPassword) {
    console.log('Passwords do not match. Please try again.');
    return;
  }
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    console.log('Username already exists. Please choose a different one.');
  } else {
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Registration successful!');
    closeModal(); // Close modal after successful registration
    // Redirect or do something after successful registration
  }
}

// Add event listeners
document.getElementById('btnLogin').addEventListener('click', handleLogin);
document.getElementById('create-account').addEventListener('click', handleRegister);
