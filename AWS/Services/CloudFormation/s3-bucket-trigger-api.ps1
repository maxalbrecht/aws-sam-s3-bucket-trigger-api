<#
.SYNOPSIS
Deployment script for s3-bucket-trigger-api stack

.DESCRIPTION
Deployment script for s3-bucket-trigger-api stack

.EXAMPLE
aws cloudformation deploy --template-file s3-bucket-trigger-api.yaml --stack-name s3-bucket-trigger-api --capabilities CAPABILITY_IAM --region us-east-1 --output json
#>
[CmdletBinding()]
param (
    [Parameter(Mandatory=$false)][string]$Templatefile = "s3-bucket-trigger-api.yaml",
    [Parameter(Mandatory=$false)][string]$StackName = "s3-bucket-trigger-api",
    [Parameter(Mandatory=$false)][string]$Capabilities = "CAPABILITY_IAM",
    [Parameter(Mandatory=$false)][string]$Region = "us-east-1",
    [Parameter(Mandatory=$false)][string]$Output = "json",
    [Parameter(Mandatory=$false)][string]$LogFile = "deploy.log",
    [Parameter(Mandatory=$false)][switch]$DeleteExistingStack = $false,
    [Parameter(Mandatory=$false)][switch]$ClearLogFile = $false,
    [Parameter(Mandatory=$false)][switch]$OpenLogFile = $false,
    [Parameter(Mandatory=$false)][switch]$SkipStackCreation = $false
)

#----------------[ Functions ]---------------------------------------------------------
function Write-LogHeader {
    $datetime = (Get-Date -UFormat "%A %m/%d/%Y %R %Z")
    $header = ("----------------[ START OF CLOUDFORMATION STACK DEPLOYMENT ]---------------------------------------------------------`n" +
        "DateTime: " + $datetime + "`n" +
        "Parameters`n" +
        "`tTemplatefile: " + $Templatefile + "`n" +
        "`tStackName: " + $StackName + "`n" +
        "`tCapabilities: " + $Capabilities + "`n" +
        "`tRegion: " + $Region + "`n" +
        "`tOutput: " + $Output + "`n" +
        "`tLogFile: " + $LogFile + "`n" +
        "`tDeleteExistingStack: " + $DeleteExistingStack + "`n" +
        "`tOpenLogFile: " + $OpenLogFile + "`n" +
        "`tSkipStackCreation: " + $SkipStackCreation + "`n"
    )

    $header | Out-File $LogFile -append
    Write-Host $header
}
function Write-LogFooter {
    $footer = "`n----------------[ END OF CLOUDFORMATION STACK DEPLOYMENT ]---------------------------------------------------------`n"
    $footer | Out-File $LogFile -append
    Write-Host $footer
}
function Transfer-FromTempFile {
    try{
        if (Test-Path temp.log) {
            $results = (Get-Content -Path temp.log) | Out-String
            Add-Content -Path $LogFile -Value ($results)
            Get-Content -Path temp.log
            Remove-Item temp.log
        }
    }
    catch {
        $_.Exception.Message | Out-File $LogFile -append
        Write-Error $_.Exception.Message
    }
}
function Save-Log {
    [CmdletBinding()]
    param (
        [Parameter(ValueFromPipeline)]$LogInfo
    )

    process {
        try{
            ,$LogInfo | ForEach-Object {
                Add-Content $LogFile $_
                Write-Host $_
            }
        }
        catch {
            $_.Exception.Message | Out-File $LogFile -append
            Write-Error $_.Exception.Message
        }
    }   
}
function Delete-ExistingStack {
    try{
        Save-Log "* 'aws cloudformation delete-stack' is being called..."
        aws cloudformation delete-stack --stack-name $StackName *>&1 > temp.log
        Transfer-FromTempFile
        Save-Log "* 'aws cloudformation delete-stack' has been called successfully."

        Save-Log "* 'aws cloudformation wait stack-delete-complete' is being called..."
        aws cloudformation wait stack-delete-complete --stack-name $StackName *>&1 > temp.log
        Transfer-FromTempFile
        Save-Log "* 'aws cloudformation wait stack-delete-complete' has been called successfully."
    }
    catch {
        $_.Exception.Message | Out-File $LogFile -append
        Write-Error $_.Exception.Message
    }
}
function Deploy-CloudFormationStack {
    process {
        try {
            Save-Log "* 'aws cloudformation deploy' is being called..."
            aws cloudformation deploy --template-file $Templatefile --stack-name $StackName --capabilities $Capabilities --region $Region --output $Output *>&1 > temp.log
            Transfer-FromTempFile
        }
        catch {
            $_.Exception.Message | Out-File $LogFile -append
            Write-Error $_.Exception.Message
        }
    }
}

function Not {
    param (
        [Parameter(ValueFromPipeline)]$booleanValue
    )
    
    if ($booleanValue) {
        return $false
    }
    else { 
        return $true
    }
}

#----------------[ Main Execution ]----------------------------------------------------
try {
    if ($ClearLogFile -and (Test-Path $LogFile)) {
        Remove-Item $LogFile
    }

    Write-LogHeader

    if ($DeleteExistingStack) {
        Save-Log "* Deleting the existing stack..."
        Delete-ExistingStack
    }
    
    if (Not $SkipStackCreation) {
        Deploy-CloudFormationStack
    }
    else{
        Save-Log "* Skipped CloudFormation stack creation."
    }
}
catch {
    $_.Exception.Message | Out-File $LogFile -append
    Write-Error $_.Exception.Message
}
finally {
    Write-LogFooter

    if ($OpenLogFile) {
        code $LogFile
        Write-Host "Opening log file..."
    }
}
