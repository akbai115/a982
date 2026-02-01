
$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    Write-Host "Fixing $($file.Name)..."
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Debug: Check if we find the chars
    if ($content -match "â€™") { Write-Host "  Found â€™ (apostrophe)" }
    if ($content -match "â€”") { Write-Host "  Found â€” (em dash)" }
    if ($content -match "Â·") { Write-Host "  Found Â· (middle dot)" }
    if ($content -match "â–ˆ") { Write-Host "  Found â–ˆ (full block)" }
    
    # Replacements
    $content = $content.Replace("â€™", "’")
    $content = $content.Replace("â€”", "—")
    $content = $content.Replace("Â·", "·")
    $content = $content.Replace("â–ˆ", "█")
    
    # Extra check for quotes if they exist in that form
    $content = $content.Replace("â€œ", "“")
    $content = $content.Replace("â€ ", "”") 
    
    # Save back
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

Write-Host "All files processed."
