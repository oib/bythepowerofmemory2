# Development Guide

## Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Git
- Code editor (VS Code recommended)

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd bythepowerofmemory
   ```

2. **Set Up Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate  # Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # If exists
   ```

4. **Database Setup**
   ```bash
   # Create local database
   createdb bythepowerofmemory_dev
   
   # Set environment variables
   export DATABASE_URL="postgresql+psycopg2://localhost/bythepowerofmemory_dev"
   export DEBUG="true"
   export LOG_PATH="./dev.log"
   ```

5. **Run Development Server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Project Structure

```
bythepowerofmemory/
├── main.py              # FastAPI application entry point
├── database.py          # Database configuration
├── pgmodel.py          # SQLModel definitions
├── requirements.txt     # Production dependencies
├── static/              # Frontend assets
│   ├── index.html      # Main HTML file
│   ├── style.css       # Stylesheets
│   ├── app.js          # Main entry point
│   ├── state.js        # Game state management
│   ├── round.js        # Round logic
│   ├── render.js       # UI rendering
│   ├── button.js       # Button handlers
│   ├── score.js        # Score tracking
│   ├── chart.js        # Statistics visualization
│   ├── help.js         # Help system
│   ├── overlay.js      # Overlay management
│   ├── logic.js        # Game logic helpers
│   ├── tile.js         # Tile model
│   ├── color.js        # Color management
│   ├── emoji.js        # Symbol management
│   ├── number.js       # Number generation
│   ├── sound.js        # Audio feedback
│   └── config.js       # Game configuration
├── docs/               # Documentation
└── tests/              # Test files (if exists)
```

## Development Workflow

### 1. Making Changes

#### Backend Changes
- Edit Python files in root directory
- Changes auto-reload with `--reload` flag
- Check API endpoints at http://localhost:8000/docs

#### Frontend Changes
- Edit JavaScript files in `static/` directory
- Changes require browser refresh
- Use browser dev tools for debugging

### 2. Database Migrations

Since using SQLModel:
```python
# Update pgmodel.py with new model
# Run init_db() to create new tables
```

For production, consider Alembic for migrations.

### 3. Testing

#### Manual Testing
1. Open http://localhost:8000
2. Play the game
3. Check score submission
4. View statistics

#### API Testing
```bash
# Test endpoints
curl -X POST http://localhost:8000/api/submit_score \
  -H "Content-Type: application/json" \
  -d '{"player":"Test","score":100,"duration":60}'

curl http://localhost:8000/api/scoreboard
```

### 4. Code Style

#### Python
- Follow PEP 8
- Use type hints
- Add docstrings

```python
def submit_score(score: Score) -> dict:
    """Submit a new score to the database.
    
    Args:
        score: Score object with player data
        
    Returns:
        Dictionary with status and ID
    """
```

#### JavaScript
- Use ES6+ features
- Modular design
- JSDoc comments

```javascript
/**
 * Starts a new game round
 * @param {Object} options - Round options
 * @param {number} options.gridSize - Size of the grid
 */
export function startRound(options = {}) {
```

## Adding New Features

### 1. New Game Mode

#### Backend
```python
# main.py
@app.post("/api/new_mode")
def new_mode(data: NewModeData):
    # Implementation
    pass
```

#### Frontend
```javascript
// static/newmode.js
export function playNewMode() {
    // Implementation
}
```

### 2. New Statistics

#### Backend
```python
@app.get("/api/new_stats")
def get_new_stats():
    # Query database
    return results
```

#### Frontend
```javascript
// static/chart.js
function renderNewStats(data) {
    // Create visualization
}
```

## Debugging

### Backend Debugging
```python
# Add logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Use debugger
import pdb; pdb.set_trace()
```

### Frontend Debugging
```javascript
// Console logging
console.log('Debug info:', data);

// Use debugger
debugger;
```

### Browser DevTools
1. Network tab - Check API calls
2. Console - View errors
3. Sources - Debug JavaScript
4. Elements - Inspect DOM

## Performance Optimization

### Backend
1. Use database indexes
2. Implement caching
3. Optimize queries
4. Use connection pooling

```python
# Example: Add index
class Score(SQLModel, table=True):
    player: str = Field(index=True)
    score: int = Field(index=True)
```

### Frontend
1. Minimize DOM manipulation
2. Use event delegation
3. Implement lazy loading
4. Optimize images

```javascript
// Example: Event delegation
document.getElementById('game-area').addEventListener('click', (e) => {
    if (e.target.classList.contains('tile')) {
        handleTileClick(e.target);
    }
});
```

## Common Development Tasks

### Adding New Tile Attribute
1. Update `tile.js`
2. Modify `render.js`
3. Update `round.js`
4. Add button in `index.html`
5. Handle in `button.js`

### Changing Grid Size
1. Update `config.js`
2. Adjust CSS in `style.css`
3. Update rendering logic

### Adding Sound Effects
1. Add audio files to `static/`
2. Update `sound.js`
3. Trigger sounds in game events

## Git Workflow

### Branch Naming
- `feature/feature-name`
- `bugfix/bug-description`
- `hotfix/urgent-fix`

### Commit Messages
```
feat: Add new game mode
fix: Resolve score submission bug
docs: Update API documentation
refactor: Optimize database queries
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All tests pass
- [ ] No console errors
```

## Environment Variables

### Development
```env
DATABASE_URL=postgresql+psycopg2://localhost/bythepowerofmemory_dev
DEBUG=true
LOG_PATH=./dev.log
```

### Production
```env
DATABASE_URL=postgresql+psycopg2://user:pass@host/db
DEBUG=false
LOG_PATH=/var/log/games/ByThePowerOfMemory.log
```

## VS Code Extensions

Recommended extensions:
- Python
- Pylance
- ESLint
- Prettier
- GitLens
- Thunder Client (API testing)
- Live Server (for static files)

## Contributing Guidelines

1. Follow code style guidelines
2. Write clear commit messages
3. Test changes thoroughly
4. Update documentation
5. Create pull requests
6. Respond to code reviews

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Tricks](https://css-tricks.com/)
