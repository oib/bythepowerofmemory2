# ByThePowerOfMemory Game Documentation

## Overview

ByThePowerOfMemory is a memory training game built with FastAPI backend and vanilla JavaScript frontend. The game challenges players to remember and recall different attributes of tiles displayed on a grid.

## Game Concept

The game displays a grid of tiles, each with multiple attributes:
- **Position** - Location on the grid
- **Color** - Tile color
- **Symbol** - Shape or emoji displayed
- **Number** - Numeric value

Players must memorize these attributes and recall them when prompted, testing different aspects of memory.

## Architecture

### Backend (FastAPI)

The backend provides REST API endpoints for:
- Score submission
- Leaderboard retrieval
- Player statistics
- Game logging

#### Key Files
- `main.py` - FastAPI application with API routes
- `database.py` - Database connection setup
- `pgmodel.py` - SQLModel for Score data

#### API Endpoints

##### POST /api/submit_score
Submits a new score to the database.
```json
{
  "player": "string",
  "score": "integer",
  "duration": "float"
}
```

##### GET /api/scoreboard?limit=10
Retrieves top scores sorted by score (descending).
Returns array of Score objects.

##### GET /api/stats
Retrieves daily average scores per player.
Returns JSON object with player names as keys.

##### POST /api/log
Logs game events for debugging.
```json
{
  "message": "string",
  "timestamp": "string"
}
```

### Frontend (Vanilla JavaScript)

The frontend is a Single Page Application (SPA) using ES6 modules.

#### Key Files
- `index.html` - Main HTML structure
- `style.css` - Game styling
- `state.js` - Game state management
- `round.js` - Round logic and tile generation
- `render.js` - UI rendering
- `button.js` - Button event handling
- `score.js` - Score tracking and submission
- `chart.js` - Statistics visualization
- `help.js` - Help overlay
- `overlay.js` - Overlay management
- `logic.js` - Game logic helpers
- `tile.js` - Tile object model
- `color.js` - Color management
- `emoji.js` - Symbol/emoji management
- `number.js` - Number generation
- `sound.js` - Audio feedback
- `config.js` - Game configuration

## Game Flow

1. **Start Game** - Player clicks "Start / Restart"
2. **Memorization Phase** - Grid of tiles is displayed with all attributes
3. **Recall Phase** - Tiles are hidden, player must recall specific attributes
4. **Scoring** - Points awarded for correct answers
5. **Statistics** - Performance tracked and displayed

## Features

### Memory Training Modes
- Position memory
- Color memory
- Symbol/Shape memory
- Number memory

### Scoring System
- Correct answers increase score
- Wrong answers decrease score
- Net score displayed
- Ratio bar showing correct vs wrong percentage

### Statistics
- Real-time score tracking
- Historical performance chart
- Daily averages per player
- Global leaderboard

### User Interface
- Responsive design
- Visual feedback for correct/wrong answers
- Help overlay with instructions
- Statistics overlay with performance metrics

## Installation & Setup

### Prerequisites
- Python 3.8+
- PostgreSQL database
- Node.js (optional for development tools)

### Backend Setup

1. Clone the repository
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate  # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   # .env file
   DATABASE_URL=postgresql+psycopg2://user:password@localhost/dbname
   LOG_PATH=/var/log/games/ByThePowerOfMemory.log
   DEBUG=false
   ```

5. Run the application:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Setup
The frontend is served statically by FastAPI. No additional setup required.

## Database Schema

### Scores Table
```sql
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    player VARCHAR NOT NULL,
    score INTEGER NOT NULL,
    duration FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Configuration

### Game Settings (config.js)
- Grid size
- Tile attributes
- Scoring rules
- Timer settings

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `LOG_PATH` - Path for game logs
- `DEBUG` - Enable debug mode

## Development

### Adding New Features
1. Backend: Add new routes in `main.py`
2. Frontend: Create new modules in `static/`
3. Database: Update models in `pgmodel.py`

### Testing
- Manual testing through web interface
- API testing with tools like Postman
- Log analysis for debugging

## Deployment

### Production Considerations
- Use production-grade WSGI server (Gunicorn)
- Configure database connection pooling
- Set up proper logging rotation
- Enable HTTPS
- Configure CORS if needed

### Docker Support
The application can be containerized for easy deployment.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

[Add license information here]

## Support

For issues or questions:
- Check game logs
- Review API responses
- Contact development team
