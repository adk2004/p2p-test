import fs from "fs"
import path from "path"

const getFolderContents = (folderPath) => {
  const results = [];
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const fullPath = path.join(folderPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      results.push({
        name: file,
        path: fullPath,
        type: "folder",
      });
      getFolderContents(fullPath);
    } 
    else {
      results.push({
        name: file,
        path: fullPath,
        type: "file",
      });
    }
  });

  return results;
};
export {getFolderContents}
// sample file folder stucture
// {
//   "folderData": [
//     {
//       "name": "subfolder",
//       "path": "/path/to/local/folder/subfolder",
//       "type": "folder",
//       "children": [
//         {
//           "name": "file1.txt",
//           "path": "/path/to/local/folder/subfolder/file1.txt",
//           "type": "file"
//         }
//       ]
//     },
//     {
//       "name": "file2.txt",
//       "path": "/path/to/local/folder/file2.txt",
//       "type": "file"
//     }
//   ],
//  ownerId : ....
// }
