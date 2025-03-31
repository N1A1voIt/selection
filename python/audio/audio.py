from pydub import AudioSegment

def overlay_audio(audio_base, to_add):
    base_audio = AudioSegment.from_file(audio_base, format="wav")
    add_audio = AudioSegment.from_file(to_add, format="wav")
    overlayed_audio = base_audio.overlay(add_audio)
    return overlayed_audio