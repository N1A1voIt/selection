import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.inference.ai.azure.com"
model_name = "Mistral-Large-2411"
token = ""


def create_theme():    
    prompt = """
    Génère aléatoirement une seule proposition, soit de photo soit de musique.
    
    Format de réponse (exactement):
    - Pour une photo: "photo: [proposition d'une scène quotidienne en ville, elle ne doit pas inclure la météo (pluie, neige, etc) ni la plage, elle ne doit pas être clichée mais peut aussi être par exemple 'un terrain de basket']"
    - Pour une musique: "musique: [proposition d'un thème musical court sans restriction géographique par exemple 'une chanson sur la solitude']"
    
    Critères:
    - Proposition très simple, réaliste et court
    - Réponse en français uniquement
    - Sans explication supplémentaire
    - UN SEUL thème, pas les deux
    - Pas de thème déjà proposé dans le format
    - Pas de thème déjà proposé dans les 10 dernières propositions
    """
    
    
    client = ChatCompletionsClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(token),
    )

    response = client.complete(
        messages=[
            SystemMessage("You are a helpful assistant."),
            UserMessage(prompt),
        ],
        temperature=0.7,
        top_p=1.0,
        max_tokens=1000,
        model=model_name
    )

    rep = response.choices[0].message.content
    theme, detail = rep.split(":")
    detail = detail.replace("\"", "").strip()
    detail = detail[:1].upper() + detail[1:]
    
    return {"theme": theme, "detail": detail}