# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently no authentication required.

## Endpoints

### Submit Score
**POST** `/api/submit_score`

Submits a new score to the database.

#### Request Body
```json
{
  "player": "string",
  "score": "integer",
  "duration": "float"
}
```

#### Response
```json
{
  "status": "ok",
  "id": 123
}
```

#### Error Response
```json
{
  "status": "error",
  "message": "Failed to save score"
}
```

### Get Scoreboard
**GET** `/api/scoreboard`

Retrieves top scores from the leaderboard.

#### Query Parameters
- `limit` (optional, default: 10) - Number of top scores to return

#### Response
```json
[
  {
    "id": 1,
    "player": "Player1",
    "score": 100,
    "duration": 45.5,
    "timestamp": "2024-01-01T12:00:00"
  },
  {
    "id": 2,
    "player": "Player2",
    "score": 95,
    "duration": 42.3,
    "timestamp": "2024-01-01T11:30:00"
  }
]
```

### Get Player Statistics
**GET** `/api/stats`

Retrieves daily average scores for each player.

#### Response
```json
{
  "Player1": [
    {
      "day": "2024-01-01",
      "avg_score": 85.5
    },
    {
      "day": "2024-01-02",
      "avg_score": 92.3
    }
  ],
  "Player2": [
    {
      "day": "2024-01-01",
      "avg_score": 78.2
    }
  ]
}
```

### Log Event
**POST** `/api/log`

Logs game events for debugging and monitoring.

#### Request Body
```json
{
  "message": "string",
  "timestamp": "string"
}
```

#### Response
```json
{
  "status": "ok"
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `500` - Internal Server Error

Error responses include a descriptive message.

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production use.

## Data Models

### Score
```json
{
  "id": "integer (auto-generated)",
  "player": "string",
  "score": "integer",
  "duration": "float (seconds)",
  "timestamp": "datetime (ISO 8601)"
}
```

## Example Usage

### JavaScript/Fetch
```javascript
// Submit score
const response = await fetch('/api/submit_score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    player: 'JohnDoe',
    score: 85,
    duration: 45.2
  })
});

const result = await response.json();
console.log(result);

// Get scoreboard
const scores = await fetch('/api/scoreboard?limit=5');
const topScores = await scores.json();
console.log(topScores);
```

### Python/Requests
```python
import requests

# Submit score
response = requests.post('http://localhost:8000/api/submit_score', json={
    'player': 'JohnDoe',
    'score': 85,
    'duration': 45.2
})
print(response.json())

# Get scoreboard
response = requests.get('http://localhost:8000/api/scoreboard?limit=5')
print(response.json())
```
