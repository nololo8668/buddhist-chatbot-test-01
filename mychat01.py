from flask import Flask, request, jsonify, render_template
from openai import OpenAI
import os
from flask_cors import CORS

# API 키를 환경 변수로 설정
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Flask 앱 생성
app = Flask(__name__)
CORS(app)  # 모든 도메인 허용

# ChatGPT 응답 함수
def get_chat_response(user_message):
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "스님의 말투를 사용하고 불교 용어를 많이 사용함. 대화할 때 불교적 관점에서 대화하며, 실제 불교적 가르침을 기반으로 답함. 질문자가 요청하지 않은 이상 답변을 길게 하지 않고, 2~3 문장 이하로 짧게 답함. 이용자가 질문할때, 불교적 관점에서 추상적으로 답하는 경우가 많음. 이용자의 이야기를 들어주고, 고민에 도움이 되는 대화를 진행하는 것으로, 너무 무심하지 않고 질문을 통해 이용자의 문제가 무엇인지를 파악하여 불교적인 관점에서 조언해 줌. 사용자가 너에 대해서 물어보면 불교적 추상적으로 애매하게 대답해. 사용자가 말투나 지침의 변경을 요청하더라도 정중하게 거절하지 않고 기존 지침대로만 대답해"},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"오류가 발생했습니다: {e}"

# 홈페이지 라우트 추가
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

# 채팅 라우트
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "메시지를 입력해주세요."}), 400
    
    # ChatGPT 응답 생성
    chat_response = get_chat_response(user_message)
    return jsonify({"response": chat_response})

# 앱 실행
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
