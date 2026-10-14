$ErrorActionPreference = "Stop"

Write-Host "=== Testing Phase 8 Social Endpoints ===" -ForegroundColor Cyan

# 1. Login Elena
$elenaLoginBody = @{
    usernameOrEmail = "elenarostova"
    password = "Password123!"
} | ConvertTo-Json

$elenaAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $elenaLoginBody -ContentType "application/json"
$elenaToken = $elenaAuth.data.token
$elenaProfile = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method Get -Headers @{ Authorization = "Bearer $elenaToken" }
Write-Host "Elena logged in: @$($elenaProfile.username) ($($elenaProfile.displayName))" -ForegroundColor Green

# 2. Login Alex
$alexLoginBody = @{
    usernameOrEmail = "alexrivera"
    password = "SecurePassword123!"
} | ConvertTo-Json

$alexAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $alexLoginBody -ContentType "application/json"
$alexToken = $alexAuth.data.token
Write-Host "Alex logged in successfully. Token: $($alexToken.Substring(0, 15))..." -ForegroundColor Green

# 3. Get Explore to find a blog ID
$explore = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/explore?page=0&size=5" -Method Get
$targetBlog = $explore.content[0]
$blogId = $targetBlog.id
Write-Host "Target blog ID: $blogId ($($targetBlog.title)) by $($targetBlog.author.username)" -ForegroundColor Yellow

# 4. Alex Likes the Blog
$alexHeaders = @{ Authorization = "Bearer $alexToken" }
$likeResp = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/$blogId/like" -Method Post -Headers $alexHeaders
Write-Host "Alex Like Response: action=$($likeResp.action), count=$($likeResp.count), active=$($likeResp.active)" -ForegroundColor Green

# 5. Alex Bookmarks the Blog
$bmarkResp = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/$blogId/bookmark" -Method Post -Headers $alexHeaders
Write-Host "Alex Bookmark Response: action=$($bmarkResp.action), count=$($bmarkResp.count), active=$($bmarkResp.active)" -ForegroundColor Green

# 6. Alex checks bookmarks
$bookmarks = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/bookmarks" -Method Get -Headers $alexHeaders
Write-Host "Alex Bookmarks total: $($bookmarks.totalElements)" -ForegroundColor Green
if ($bookmarks.totalElements -gt 0) {
    Write-Host "Found bookmarked blog: $($bookmarks.content[0].title)" -ForegroundColor Cyan
}

# 7. Alex Comments on the Blog
$commentBody = @{
    content = "This is an extraordinary perspective! Really enjoyed the breakdown and visual layout."
} | ConvertTo-Json

$commentResp = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/$blogId/comments" -Method Post -Headers $alexHeaders -Body $commentBody -ContentType "application/json"
$commentId = $commentResp.id
Write-Host "Comment posted! ID: $commentId, author=$($commentResp.author.username), content='$($commentResp.content)'" -ForegroundColor Green

# 8. Unauthenticated user reads comments
$comments = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/$blogId/comments" -Method Get
Write-Host "Fetched $($comments.Count) comments for blog $blogId publicly." -ForegroundColor Green

# 9. Alex follows Elena (if author is elenarostova) or Elena follows Alex
$followResp = Invoke-RestMethod -Uri "http://localhost:8080/api/users/elenarostova/follow" -Method Post -Headers $alexHeaders
Write-Host "Alex Follow Elena: following=$($followResp.following), followersCount=$($followResp.followersCount)" -ForegroundColor Green

# 10. Alex checks following feed
$feed = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/feed" -Method Get -Headers $alexHeaders
Write-Host "Alex Following Feed total stories: $($feed.totalElements)" -ForegroundColor Green

# 11. Alex deletes his comment
$delResp = Invoke-RestMethod -Uri "http://localhost:8080/api/comments/$commentId" -Method Delete -Headers $alexHeaders
Write-Host "Comment deletion: $($delResp.message)" -ForegroundColor Green

Write-Host "=== ALL PHASE 8 BACKEND TESTS PASSED! ===" -ForegroundColor Green
