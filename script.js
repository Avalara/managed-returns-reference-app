import fs from 'fs';

const json = JSON.parse(fs.readFileSync('./sample.json', 'utf8'));

// Function to write raw byte arrays to binary files
function saveByteArraysAsFiles(arrays, fileNames) {
  arrays.forEach((byteArray, index) => {
    // Create a buffer from the array of byte values
    const buffer = Buffer.from(byteArray);

    // Write the buffer to a file with the corresponding file name
    fs.writeFile(fileNames[index], buffer, (err) => {
      if (err) {
        console.error(`Error saving file ${fileNames[index]}:`, err);
      } else {
        console.log(`File ${fileNames[index]} saved successfully!`);
      }
    });
  });
}

const arrays = Object.keys(json.data.LiabilityReports);

// Example usage with the extracted arrays

// Provide the file names for the outputs
const fileNames = ['file1.xlsx', 'file2.xlsx', 'file3.xlsx'];

// Save the arrays as binary files
saveByteArraysAsFiles(arrays, fileNames);
