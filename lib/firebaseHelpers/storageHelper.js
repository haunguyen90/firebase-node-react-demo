export const getDownloadURL = (fileLink, callback) => {
  const target = firebase.storage().ref().child(fileLink);
  target.getDownloadURL().then(function(url) {
    if(typeof callback == 'function'){
      callback(url);
    }
  }).catch(function(error) {
    switch (error.code) {
      case 'storage/object_not_found':
        // File doesn't exist
        console.log("File doesn't exist");
        break;

      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log("User doesn't have permission to access the object");
        break;

      case 'storage/canceled':
        // User canceled the upload
        console.log("File doesn't exist");
        break;

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        console.log("Unknown error occurred, inspect the server response");
        break;
    }
  });
}
