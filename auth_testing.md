# Auth-Gated App Testing Playbook for Shinyfy

## Step 1: Create Test User & Session

```bash
mongosh --eval "
use('shinyfy_db');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date(),
  liked_songs: [],
  playlists: [],
  recently_played: [],
  preferences: {region: 'global', favorite_genres: []}
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API

```bash
# Test auth endpoint
curl -X GET "http://localhost:8001/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Test songs endpoint
curl -X GET "http://localhost:8001/api/songs"

# Test search endpoint
curl -X GET "http://localhost:8001/api/songs/search?q=weeknd"

# Test playlists endpoint (protected)
curl -X GET "http://localhost:8001/api/playlists" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser Testing with Playwright

```python
# Set cookie and navigate
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "localhost",
    "path": "/",
    "httpOnly": True,
    "secure": False,
    "sameSite": "Lax"
}])
await page.goto("http://localhost:3000")
```

## Quick Debug

```bash
# Check data format
mongosh --eval "
use('shinyfy_db');
db.users.find().limit(2).pretty();
db.user_sessions.find().limit(2).pretty();
db.songs.find().limit(2).pretty();
"

# Clean test data
mongosh --eval "
use('shinyfy_db');
db.users.deleteMany({email: /test\.user\./});
db.user_sessions.deleteMany({session_token: /test_session/});
"
```

## Checklist

- [ ] User document has user_id field (custom UUID)
- [ ] Session user_id matches user's user_id exactly
- [ ] All queries use `{"_id": 0}` projection
- [ ] Backend queries use user_id (not _id or id)
- [ ] API returns user data with user_id field
- [ ] Browser loads dashboard (not login page)
- [ ] Songs can be played
- [ ] Search functionality works
- [ ] Playlists can be viewed

## Success Indicators

✅ /api/auth/me returns user data
✅ Dashboard loads without redirect
✅ Music player works
✅ Search returns results
✅ Playlists display correctly

## Failure Indicators

❌ "User not found" errors
❌ 401 Unauthorized responses  
❌ Redirect to login page
❌ Empty search results
❌ Songs not loading
