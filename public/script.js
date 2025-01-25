// Select form and input fields
const form = document.getElementById('comment-form');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const imageInput = document.getElementById('image');
const commentsContainer = document.getElementById('comments-container');

// Fetch and display comments from the server
function loadComments() {
  fetch('/comments')
    .then(response => response.json())
    .then(comments => {
      commentsContainer.innerHTML = ''; // Clear the comments container
      comments.forEach(comment => {
        const div = document.createElement('div');
        div.classList.add('comment');
        
        let commentHTML = `
          <h3>${comment.name}</h3>
          <p>${comment.message}</p>
        `;

        // If there's an image, display it
        if (comment.imageUrl) {
          commentHTML += `<img src="${comment.imageUrl}" alt="Uploaded Image" style="max-width: 100px; margin-top: 10px;">`;
        }

        div.innerHTML = commentHTML;
        commentsContainer.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Error fetching comments:', error);
    });
}

// Handle form submission to post a new comment
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from reloading the page

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  const image = imageInput.files[0]; // Get the selected image file

  // Ensure both name and message are provided
  if (!name || !message) {
    alert('Please fill in both your name and comment!');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('message', message);
  if (image) {
    formData.append('image', image); // Add the image to the form data
  }

  // Send comment data to the server using POST method
  fetch('/comments', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Comment added successfully') {
      // Reload the comments after adding a new one
      loadComments();
      nameInput.value = '';  // Clear the input fields
      messageInput.value = '';
      imageInput.value = '';  // Clear the image input
    } else {
      alert('Failed to post comment. Try again!');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error adding your comment.');
  });
});

// Load comments when the page loads
loadComments();
