param(
    [switch] $TestName,
    [switch] $StatusPercentage
)

if ($TestName.isPresent -ne $true) 
{ 
    throw "Please include testname parameter, example -TestName simple-poll"
}

$path = Get-Location
$mountParameter = "type=bind,source=$path/tests,target=/tests"
$testnameArg = $args[0]
$statusPercentageArg = $args[1]
$container = "foo_k6loadtest_$testnameArg"

docker rm $container
docker run --env "STATUS_PERCENTAGE=$statusPercentageArg" --name $container --mount $mountParameter -i loadimpact/k6:0.33.0 run "/tests/$testnameArg.test.js"
