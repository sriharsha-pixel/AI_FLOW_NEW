const fs = require("fs");
const path = require("path");

function clearFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    try {
      fs.rmSync(folderPath, { recursive: true, force: true });
      fs.mkdirSync(folderPath, { recursive: true }); // recreate empty folder
      console.log(`Cleared: ${folderPath}`);
    } catch (error) {
      console.error(`Error clearing folder ${folderPath}:`, error);
    }
  } else {
    console.log(`Folder not found: ${folderPath}`);
  }
}

module.exports = async () => {
  // Clear allure-results
  const allureResultsPath = path.join(process.cwd(), "allure-results");
  clearFolder(allureResultsPath);

  // Clear all folders under output/
  const outputPath = path.join(process.cwd(), "output");

  if (fs.existsSync(outputPath)) {
    const subFolders = fs.readdirSync(outputPath);

    subFolders.forEach((folder) => {
      const fullPath = path.join(outputPath, folder);

      // only clear if it's a directory
      if (fs.lstatSync(fullPath).isDirectory()) {
        clearFolder(fullPath);
      }
    });
  } else {
    console.log("output folder not found.");
  }
};
