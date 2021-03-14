export default {
  name: "ThreadIDs",
  schema: {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "ThreadIDs",
    "description": "Mapping connecting ThreadIDs to a user",
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
      "thread": {
        "description": "Thread ID string",
        "type": "string",
      }
    },
    "required": ["_id", "user", "thread"],
  }
};