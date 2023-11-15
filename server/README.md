# API Reference

You can use this API to encrypt / decrypt data or fetch codes <br />
Set the `content-type` header to `application/json`

The base url of the server is `https://ssd-server.vercel.app`

## Table of contents

- [Encrypt / decrypt](#encrypt--decrypt)
  - [Decrypt](#decrypt-data)
  - [Encrypt](#encrypt-data)
- [Codes](#codes)
  - [Save](#save-data)
  - [Get](#get-data)

## Encrypt / decrypt

### Decrypt data

```http
  POST /decrypt

  POST https://ssd-server.vercel.app/decrypt
```

Body
| Parameter | Type | Description |
| :---------- | :------- | :------------------------- |
| `text` | `string` | **Required**. The data that you want to decrypt. |
| `parsed` | `boolean` | **Optional**. If true, the server will automatically parse the result into a json object, otherwise, it will return a un-parsed string|

**Example**

Request body

```json
{
  "text": "ENCRYPTED STRING HERE",
  "parsed": false
}
```

Response

```json
{
  "success": true,
  "result": "{\"key\": \"value\"}"
}
```

---

### Encrypt data

```http
  POST /encrypt

  POST https://ssd-server.vercel.app/encrypt
```

Body
| Parameter | Type | Description |
| :---------- | :------- | :------------------------- |
| `text` |`string` OR `object`| **Required**. The data that you want to encrypt. Must be a stringified or parsed object |

**Example**

Request body

```json
{
  "text": { "key": "value" } // Can be a string
}
```

Response

```json
{
  "success": true,
  "result": "ENCRYPTED STRING"
}
```

## Codes

#### Save data

```http
  POST /save

  POST https://ssd-server.vercel.app/save
```

| Parameter   | Type     | Description                |
| :---------- | :------- | :------------------------- |
| `encrypted` | `string` | **Required**. Data to save |
| `decrypted` | `string` | **Required**. Data to save |

Example response (JSON)

```json
{
  "code": "123AB"
}
```

---

#### Get data

```http
  GET /fetch/${code}

  GET https://ssd-server.vercel.app/fetch/${code}
```

Example response (JSON)

```json
{
  "encrypted": "enwifbn!34iubrbfbjBUIDBYIOGFBVI+Ubdiofe43gf891lvblo",
  "decrypted": "{\"data\": \"data\"}"
}
```
