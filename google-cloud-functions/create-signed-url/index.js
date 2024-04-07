const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

const bucketName = '<add your Google Cloud Storage bucket here>';

functions.http('getSignedUploadUrl', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      return res.status(204).send('');
    }

    const fileType = req.query.fileType;
    const fileName = req.query.fileName;
    if (!fileName) {
      return res.status(400).send('Invalid request. fileName is required.');
    }

    const urlPut = await generateV4UploadSignedUrl(fileName, fileType);
    return res.send(urlPut);
});

async function generateV4UploadSignedUrl(fileName, fileType) {
  // These options will allow temporary uploading of the file with outgoing
  // Content-Type: fileType header.
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: fileType,
  };

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);

  console.log('Generated PUT signed URL:');
  console.log(url);
  console.log('You can use this URL with any user agent, for example:');
  console.log(
    "curl -X PUT -H 'Content-Type: application/octet-stream' " +
      `--upload-file my-file '${url}'`
  );

  return url;
}

async function generateV4ReadSignedUrl(fileName) {
  // These options will allow temporary read access to the file
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  // Get a v4 signed URL for reading the file
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);

  return url;
}
