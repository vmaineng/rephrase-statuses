import openai
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

openai.api_key = settings.OPENAI_API_KEY

@api_view(['POST'])
def rephrase_status(request):
    if request.method == 'POST':
        status_text = request.data.get('status')
        if status_text:
            try:
                response = openai.chat.completions.create(
                    model="gpt-4.1",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that rephrases social media statuses to sound more engaging and interesting."},
                        {"role": "user", "content": f"Rephrase the following social media status: '{status_text}'"},
                        {"role": "user", "content": "Provide 3 distinct rephrased versions."},
                    ]
                )
                rephrased_statuses = [choice.message.content.strip() for choice in response.choices]
                return Response({'rephrased': rephrased_statuses})
            except Exception as e:
                return Response({'error': f"Error communicating with OpenAI: {str(e)}"}, status=500)
        else:
            return Response({'error': 'No status text provided.'}, status=400)
    return Response({'error': 'Invalid request method.'}, status=405)

