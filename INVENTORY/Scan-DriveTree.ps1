# ============================================
# HORUS Drive Tree Scanner
# Version: v1.0.0
# Date: 2026-01-09
# Purpose: Read-only scan of governance directories
# ============================================
#
# This script is READ-ONLY:
# - Does NOT modify any files
# - Does NOT move any files
# - Does NOT delete any files
#
# Output:
# - DRIVE-TREE-SNAPSHOT.latest.md (overwritten each run)
# - DRIVE-TREE-SNAPSHOT-YYYY-MM-DD.md (preserved)
#
# ============================================

# Force UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['Out-File:Encoding'] = 'UTF8'

# Configuration - Use script location to determine base path
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent (Split-Path -Parent $ScriptDir)

$ScanRoots = @(
    (Join-Path $BaseDir "HORUS-GOVERNANCE"),
    (Join-Path $BaseDir "HORUS-FACTS"),
    (Join-Path $BaseDir "HORUS-DERIVED")
)

$OutputDir = Join-Path $BaseDir "HORUS-GOVERNANCE\INVENTORY"
$DateStamp = Get-Date -Format "yyyy-MM-dd"
$TimeStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$LatestFile = Join-Path $OutputDir "DRIVE-TREE-SNAPSHOT.latest.md"
$DatedFile = Join-Path $OutputDir "DRIVE-TREE-SNAPSHOT-$DateStamp.md"

# ============================================
# Function: Build tree structure for a directory
# ============================================
function Get-DirectoryTree {
    param(
        [string]$Path,
        [string]$Prefix = "",
        [string]$RootName = ""
    )

    $output = @()

    if ($RootName) {
        $output += "$RootName/"
    }

    try {
        $items = Get-ChildItem -Path $Path -ErrorAction SilentlyContinue | Sort-Object { -not $_.PSIsContainer }, Name
        $count = $items.Count
        $index = 0

        foreach ($item in $items) {
            $index++
            $isLast = ($index -eq $count)
            $connector = if ($isLast) { "+-- " } else { "|-- " }
            $nextPrefix = if ($isLast) { "$Prefix    " } else { "$Prefix|   " }

            if ($item.PSIsContainer) {
                $output += "$Prefix$connector$($item.Name)/"
                $subTree = Get-DirectoryTree -Path $item.FullName -Prefix $nextPrefix
                $output += $subTree
            } else {
                $output += "$Prefix$connector$($item.Name)"
            }
        }
    } catch {
        $output += "$Prefix+-- [ERROR: Cannot access]"
    }

    return $output
}

# ============================================
# Main: Generate snapshot
# ============================================

$content = @()
$content += "# HORUS Drive Tree Snapshot"
$content += ""
$content += "**Generated**: $TimeStamp"
$content += "**Scanner Version**: v1.0.0"
$content += "**Mode**: Read-Only"
$content += ""
$content += "---"
$content += ""

foreach ($root in $ScanRoots) {
    $rootName = Split-Path $root -Leaf
    $content += "## $rootName"
    $content += ""
    $content += '```'

    if (Test-Path $root) {
        $tree = Get-DirectoryTree -Path $root -RootName $rootName
        $content += $tree
    } else {
        $content += "$rootName/ [PATH NOT FOUND]"
    }

    $content += '```'
    $content += ""
}

$content += "---"
$content += ""
$content += "*This snapshot is auto-generated. Do not edit manually.*"

# ============================================
# Output: Write to files
# ============================================

# Ensure output directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Write latest (overwrite)
$content | Out-File -FilePath $LatestFile -Encoding UTF8 -Force

# Write dated version (preserve)
$content | Out-File -FilePath $DatedFile -Encoding UTF8 -Force

# ============================================
# Summary
# ============================================
Write-Host "========================================"
Write-Host "HORUS Drive Tree Scan Complete"
Write-Host "========================================"
Write-Host "Time: $TimeStamp"
Write-Host "Latest: $LatestFile"
Write-Host "Dated:  $DatedFile"
Write-Host "========================================"
