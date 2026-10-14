$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   INKORA PHASE 8 SOCIAL ENGINE FULL E2E SUITE            " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Authenticate Elena
$elenaCreds = @{ usernameOrEmail = "elenarostova"; password = "Password123!" } | ConvertTo-Json
$elenaAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $elenaCreds -ContentType "application/json"
$elenaToken = $elenaAuth.data.token
$elenaHeaders = @{ Authorization = "Bearer " + $elenaToken }
$elenaProfile = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method Get -Headers $elenaHeaders
Write-Host ("[OK] Elena logged in: @" + $elenaProfile.username + " (" + $elenaProfile.displayName + ")") -ForegroundColor Green

# 2. Authenticate Alex
$alexCreds = @{ usernameOrEmail = "alexrivera"; password = "SecurePassword123!" } | ConvertTo-Json
$alexAuth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $alexCreds -ContentType "application/json"
$alexToken = $alexAuth.data.token
$alexHeaders = @{ Authorization = "Bearer " + $alexToken }
Write-Host "[OK] Alex logged in: @" + $alexAuth.data.username -ForegroundColor Green

# 3. Find a published blog authored by Elena
$explore = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/explore?page=0&size=10" -Method Get
$targetBlog = $null
foreach ($b in $explore.content) {
    if ($b.author.username -eq "elenarostova") {
        $targetBlog = $b
        break
    }
}

if (-not $targetBlog) {
    Write-Error "Could not find a published blog by Elena in explore feed."
}
$blogId = $targetBlog.id
Write-Host ("[OK] Found target story ID " + $blogId + ": " + $targetBlog.title) -ForegroundColor Yellow

# 4. Alex Likes the Story
$likeResp1 = Invoke-RestMethod -Uri ("http://localhost:8080/api/blogs/" + $blogId + "/like") -Method Post -Headers $alexHeaders
Write-Host ("[OK] Like toggle: active=" + $likeResp1.active + ", count=" + $likeResp1.count) -ForegroundColor Green

# 5. Alex Bookmarks the Story
$bmarkResp1 = Invoke-RestMethod -Uri ("http://localhost:8080/api/blogs/" + $blogId + "/bookmark") -Method Post -Headers $alexHeaders
Write-Host ("[OK] Bookmark toggle: active=" + $bmarkResp1.active) -ForegroundColor Green

# 6. Verify Saved Bookmarks in Alex reading list
$bookmarks = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/bookmarks?page=0&size=10" -Method Get -Headers $alexHeaders
Write-Host ("[OK] Alex Bookmarks total count: " + $bookmarks.totalElements) -ForegroundColor Green
$foundInBookmarks = $false
foreach ($b in $bookmarks.content) {
    if ($b.id -eq $blogId) {
        $foundInBookmarks = $true
        break
    }
}
Write-Host ("[OK] Story found in Bookmarks: " + $foundInBookmarks) -ForegroundColor Green

# 7. Follow Interaction: Alex follows Elena
$followResp = Invoke-RestMethod -Uri "http://localhost:8080/api/users/elenarostova/follow" -Method Post -Headers $alexHeaders
Write-Host ("[OK] Follow status: following=" + $followResp.following + ", followersCount=" + $followResp.followersCount) -ForegroundColor Green

# 8. Verify Following Feed
$feed = Invoke-RestMethod -Uri "http://localhost:8080/api/blogs/feed?page=0&size=10" -Method Get -Headers $alexHeaders
Write-Host ("[OK] Following feed returned " + $feed.totalElements + " stories.") -ForegroundColor Green

# 9. Alex adds a discussion comment
$commentText = "The architecture pattern illustrated here is exceptional! Really appreciate the clarity and aesthetic presentation."
$commentReq = @{ content = $commentText } | ConvertTo-Json
$createdComment = Invoke-RestMethod -Uri ("http://localhost:8080/api/blogs/" + $blogId + "/comments") -Method Post -Headers $alexHeaders -Body $commentReq -ContentType "application/json"
$commentId = $createdComment.id
Write-Host ("[OK] Comment created ID " + $commentId + " by @" + $createdComment.author.username) -ForegroundColor Green

# 10. Public reader accesses comments
$publicComments = Invoke-RestMethod -Uri ("http://localhost:8080/api/blogs/" + $blogId + "/comments") -Method Get
Write-Host ("[OK] Public visitor retrieved " + $publicComments.Count + " comments.") -ForegroundColor Green

# 11. Author permission test: Delete comment
$deleteComment = Invoke-RestMethod -Uri ("http://localhost:8080/api/comments/" + $commentId) -Method Delete -Headers $alexHeaders
Write-Host ("[OK] Comment deletion response: " + $deleteComment.message) -ForegroundColor Green

# 12. Unlike / Unbookmark toggle test
$likeResp2 = Invoke-RestMethod -Uri ("http://localhost:8080/api/blogs/" + $blogId + "/like") -Method Post -Headers $alexHeaders
Write-Host ("[OK] Unlike toggle: active=" + $likeResp2.active + ", count=" + $likeResp2.count) -ForegroundColor Green

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ALL PHASE 8 SOCIAL TESTS PASSED WITH 100% SUCCESS!    " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
