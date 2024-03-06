const userExists = `
    SELECT * FROM users WHERE email = $1
`;

module.exports = userExists;
