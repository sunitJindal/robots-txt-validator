const filterInput = (rows) => {
  const filteredRows = [];
  // eslint-disable-next-line consistent-return
  rows.forEach((row) => {
    const trimmedRow = row.trim();
    // remove empty lines and comment lines
    if ((trimmedRow === '') || trimmedRow.indexOf('#') === 0) {
      return false;
    }
    filteredRows.push(trimmedRow);
  });

  return filteredRows;
};

/**
 * Parse a row in robots.txt and separate out group/rule identifier and value
 * @param {String} row Rule or group line
 * @retuns { key:'token', value: 'value' }
 */
const parseRow = (row: string) => {
  const tokens = row.split(':');
  return { key: tokens.shift().toLowerCase(), value: tokens.join(':').trim() };
};

module.exports = (data) => {
  const robotsRows = data.split('\n');

  const filteredRows = filterInput(robotsRows);

  return filteredRows.map(parseRow);
};
