# Authentication

JWT issuance and validation options, the password hasher and the refresh-token store. The signing
key is read from `SEEDLING_JWT_SIGNING_KEY` first and `Seedling:Jwt:SigningKey` second; the API
refuses to start outside Development with the placeholder key.
