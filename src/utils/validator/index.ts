const contentType = require('../../constants/contentType');

exports.isContentTypeValid = (value: string) => (
  (value === contentType.XML) || (value === contentType.XML_UTF8)
);
