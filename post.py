import requests
import json

url = "http://localhost:5005/del_chat"
headers = {"Content-Type": "application/json"}

payload = {
    "data": ["STyul0YSfuc2jYMTTi"]
}

response = requests.post(url, headers=headers, data=json.dumps(payload))

print(response.status_code)
print(response.json())
