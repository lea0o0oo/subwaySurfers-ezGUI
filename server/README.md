# API Reference

#### Save data

```http
  POST /save
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
```

Example response (JSON)

```json
{
  "encrypted": "enwifbn!34iubrbfbjBUIDBYIOGFBVI+Ubdiofe43gf891lvblo",
  "decrypted": "{\"data\": \"data\"}"
}
```
