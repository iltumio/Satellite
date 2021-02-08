export default {
  name: "PublicKeys",
  schema: {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "PublicKeys",
    "description": "Mapping connecting Public Key of a user",
    "type": "object",
    "properties": {
      "_id": {
        "description": "Field to contain ulid-based instance id",
        "type": "string",
      },
      "user": {
        "description": "User ID",
        "type": "string",
      },
      "key": {
        "description": "Public Key string",
        "type": "string",
      }
    },
    "required": ["_id", "user", "key"],
  }
};