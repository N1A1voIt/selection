import random

arr = [
    {"name": "a", "url": "a.com"},
    {"name": "b", "url": "b.com"},
    {"name": "c", "url": "c.com"},
    {"name": "d", "url": "d.com"},
    {"name": "e", "url": "e.com"},
    {"name": "f", "url": "f.com"},
    {"name": "g", "url": "g.com"},
    {"name": "h", "url": "h.com"},
    {"name": "i", "url": "i.com"},
]

def shuffle(pics):
    urls = [pic["url"] for pic in pics]
    
    n = len(urls)
    if n <= 1:
        return  
    if n == 2:
        raise ValueError("Cannot shuffle URLs with only 2 items without one keeping its original URL")
    
    while True:
        shuffled_urls = urls.copy()
        random.shuffle(shuffled_urls)
        if all(urls[i] != shuffled_urls[i] for i in range(n)):
            break
    
    for i, pic in enumerate(pics):
        pic["url"] = shuffled_urls[i]


if __name__ == "__main__":
    shuffle(arr)
    print(arr)