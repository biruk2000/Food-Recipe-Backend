const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginHandler = async (req, res) => {
  // get request input
  const { credientials } = req.body.input;

  //   console.log(credientials);

  const email = credientials.email;
  console.log(email);
  let GET_USER = gql`
    query ($email: String!) {
      Users(where: { email: { _eq: $email } }) {
        id
        email
        user_name
        password
      }
    }
  `;

  let data = await apollo_client.query({
    query: GET_USER,
    variables: { email },
  });

  let user = data.data.Users[0];

  if (!user) {
    return Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(
    credientials.password,
    user.password
  );
  if (!isValidPassword) {
    return Error("Invalid password");
  }

  payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["admin", "user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": user.id,
    },
    metadata: {
      "x-hasura-allowed-roles": ["admin", "user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": user.id,
    },
  };
  const token = jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRETS, {
    algorithm: "HS256",
    expiresIn: Date.now() + 1 * 24 * 60 * 60 * 1000,
  });

  // success
  return res.json({
    token: token,
    id: user.id,
    email: user.email,
    user_name: user.user_name,
    password: user.password,
  });
};

module.exports = loginHandler;
