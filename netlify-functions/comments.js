const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    try {
      const { name, message, imageUrl } = JSON.parse(event.body);

      if (!name || !message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Name and message are required' }),
        };
      }

      // Load comments from the 'comments.json' file
      const commentsFile = path.join(__dirname, '..', 'comments.json');
      const data = fs.readFileSync(commentsFile, 'utf-8');
      const comments = JSON.parse(data);

      // Add the new comment
      comments.push({ name, message, imageUrl });

      // Save the updated comments to the file
      fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Comment added successfully' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error saving comment' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  };
};
