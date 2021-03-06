if [ -z "$1" ]; then
    echo "No argument supplied"

else
    sudo apt update
    sudo apt install jq

    for s in $(echo $1 | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]"); do
        export $s
    done

    echo "Environment variables was set."
fi
