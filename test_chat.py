import requests

url = "http://localhost:5000/chat"
data = {
    "message": "삶의 의미가 무엇인가요?"
}

response = requests.post(url, json=data)
print(response.json()) 