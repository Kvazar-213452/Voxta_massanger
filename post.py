import requests
import json

url = "http://localhost:5001/add_user"
headers = {"Content-Type": "application/json"}

payload = {
    "data": ["dddddd", "33333333", "54565545", "eefwefewfwf"]
}

response = requests.post(url, headers=headers, data=json.dumps(payload))

print(response.status_code)
print(response.json())
