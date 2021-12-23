const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const signupHandler = async (req, res) => {
  console.log(req.body.input);
  const { credentials } = req.body.input;
  credentials.password = await bcrypt.hash(credentials.password, 12);
// console.log(process.env.HASURA_GRAPHQL_ADMIN_SECRET)
  const variables = {
    email: credentials.email,
    password: credentials.password,
    user_name: credentials.username,
  };

  console.log(variables);

  let data = await apollo_client.mutate({
    mutation: gql`
      mutation ($email: String!, $password: String!, $user_name: String!) {
        insert_Users_one(
          object: { email: $email, password: $password, user_name: $user_name }
        ) {
          id
          email
          user_name
          password
        }
      }
    `,
    variables: variables,
  });
  
  console.log(data);

  payload = {
      "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["admin", "user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": data.data.insert_Users_one.id,
      }
  }

//   console.log(payload);
  const token = jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRETS, {
      algorithm: "HS256",
      expiresIn: '1hr'
  })

  return res.json({
    token,
    id:  data.data.insert_Users_one.id,
    email: data.data.insert_Users_one.email,
    user_name: data.data.insert_Users_one.user_name, 
    password: data.data.insert_Users_one.password
  })
};

module.exports = signupHandler;
