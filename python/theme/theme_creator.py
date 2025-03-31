import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.inference.ai.azure.com"
model_name = "Mistral-Large-2411"
token = "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"


def create_theme():    
    prompt = """
    Génère aléatoirement une seule proposition, soit de photo soit de musique.
    
    Format de réponse (exactement):
    - Pour une photo: "Prend une photo top!: [proposition d'une scène quotidienne en ville, elle ne doit pas inclure la météo (pluie, neige, etc) ni la plage, elle ne doit pas être clichée mais peut aussi être par exemple 'un terrain de basket', elle peut aussi etre a propos de personne ou d'etudes]"
    
    Critères:
    - Proposition très simple, réaliste et court
    - Réponse en français uniquement
    - Sans explication supplémentaire
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