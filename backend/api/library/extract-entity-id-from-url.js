const extractEntityIdFromUrl = (url) => {
  const promise = new Promise((resolve, reject) => {
    // Match the last segment of the path that contains a number
    const match = url.match(/\/([^/?]+)(\/?)$/);

    if (match) {
      // If the match is found, check if it contains a number
      const entityId = match[1];
      if (/\d/.test(entityId)) {
        resolve(entityId);
      } else {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });

  return promise;
};
export default extractEntityIdFromUrl;