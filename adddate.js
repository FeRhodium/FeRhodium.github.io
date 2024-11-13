const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to get the creation time of a file using Git
function getCreationTime(filePath) {
  try {
    const command = `git log --diff-filter=A --format="%ai" -- "${filePath}" | tail -n 1`;
    const creationTime = execSync(command).toString().trim();
    return creationTime;
  } catch (error) {
    console.error(`Error getting creation time for ${filePath}: ${error.message}`);
    return null;
  }
}

// Function to get the updated time of a file using Git
function getupdatedTime(filePath) {
  try {
    const command = `git log -1 --format="%ai" -- "${filePath}"`;
    const updatedTime = execSync(command).toString().trim();
    return updatedTime;
  } catch (error) {
    console.error(`Error getting updated time for ${filePath}: ${error.message}`);
    return null;
  }
}

// Function to update the front matter of a Markdown file
function updateMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const creationTime = getCreationTime(filePath);
  const updatedTime = getupdatedTime(filePath);

  if (!creationTime || !updatedTime) {
    console.error(`Skipping ${filePath} due to missing timestamps.`);
    return;
  }

  // Check if front matter exists
  const frontMatterRegex = /^---\n([\s\S]*?)---\n/;
  const match = content.match(frontMatterRegex);
  
  let updatedContent;
  
  if (match) {
    // Extract existing front matter
    const frontMatter = match[1];
    
    // Update front matter
    const newFrontMatter = `${frontMatter}date: ${creationTime}\nupdated: ${updatedTime}\n`;
    updatedContent = content.replace(frontMatterRegex, `---\n${newFrontMatter}---\n`);
  } else {
    // If no front matter, create a new one
    updatedContent = `---\ndate: ${creationTime}\nupdated: ${updatedTime}\n---\n${content}`;
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// Main function to process all Markdown files in the specified directory
function processMarkdownFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      if (path.extname(file) === '.md') {
        updateMarkdownFile(filePath);
        console.log(`Updated: ${filePath}`);
      }
    });
  });
}

// Specify the directory containing Markdown files
const markdownDirectory = path.join(__dirname, 'source/_posts/');
processMarkdownFiles(markdownDirectory);
