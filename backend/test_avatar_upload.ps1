$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   TESTING AVATAR FILE UPLOAD & PROFILE UPDATE            " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Login Alex
$loginBody = @{
    usernameOrEmail = "alexrivera"
    password = "SecurePassword123!"
} | ConvertTo-Json

$auth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $auth.data.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "[OK] Logged in as: @" + $auth.data.username -ForegroundColor Green

# 2. Create a dummy test avatar image
$tempImgPath = Join-Path $PSScriptRoot "test_avatar.png"
# 1x1 transparent PNG bytes
$pngBytes = [byte[]](0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
                     0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
                     0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
                     0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 
                     0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 
                     0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82)
[System.IO.File]::WriteAllBytes($tempImgPath, $pngBytes)
Write-Host "[OK] Created test image: $tempImgPath" -ForegroundColor Green

# 3. Upload image via multipart/form-data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"
$fileBytes = [System.IO.File]::ReadAllBytes($tempImgPath)
$fileContent = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes)

$body = "--$boundary$LF" +
        "Content-Disposition: form-data; name=`"category`"$LF$LF" +
        "profiles$LF" +
        "--$boundary$LF" +
        "Content-Disposition: form-data; name=`"file`"; filename=`"test_avatar.png`"$LF" +
        "Content-Type: image/png$LF$LF" +
        "$fileContent$LF" +
        "--$boundary--$LF"

$uploadHeaders = @{
    Authorization = "Bearer $token"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

$uploadResp = Invoke-RestMethod -Uri "http://localhost:8080/api/uploads/image" -Method Post -Headers $uploadHeaders -Body $body
Write-Host "[OK] Upload succeeded! Response:" -ForegroundColor Green
$uploadedUrl = $uploadResp.data.url
Write-Host "   URL: $uploadedUrl" -ForegroundColor Cyan
Write-Host "   Original Filename: $($uploadResp.data.originalFilename)" -ForegroundColor Cyan
Write-Host "   Size: $($uploadResp.data.sizeBytes) bytes" -ForegroundColor Cyan

# 4. Update profile with uploaded avatar URL
$updateBody = @{
    displayName = "Alex Rivera"
    bio = "Design Engineer & Minimalist. Testing laptop avatar upload."
    profileImageUrl = $uploadedUrl
} | ConvertTo-Json

$profileResp = Invoke-RestMethod -Uri "http://localhost:8080/api/users/profile" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
Write-Host "[OK] Profile updated! Profile image URL: $($profileResp.profileImageUrl)" -ForegroundColor Green

# 5. Verify the uploaded image is served over HTTP
$fullImgUrl = "http://localhost:8080" + $uploadedUrl
$imgFetch = Invoke-WebRequest -Uri $fullImgUrl -Method Get -UseBasicParsing
Write-Host "[OK] Image successfully served from backend! Status code: $($imgFetch.StatusCode), Content-Type: $($imgFetch.Headers['Content-Type'])" -ForegroundColor Green

# Cleanup temp file
Remove-Item -Path $tempImgPath -Force -ErrorAction SilentlyContinue

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   AVATAR UPLOAD & PROFILE UPDATE FULLY VERIFIED!         " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
