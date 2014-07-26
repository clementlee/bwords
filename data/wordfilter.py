def filter(word):
    w = word.strip()
    ok = 3 < len(w) < 8
    ok = ok and w.count('l') <= 4 and w.count('s') <= 4 and w.count('u') <= 4 and w.count('n') <= 6 and w.count('r') <= 6 and w.count('t') <= 6 \
            and w.count('o') <= 8 and w.count('a') <= 9 and w.count('i') <= 9 and w.count('e') <= 12 and w.count('g') <= 3 and w.count('d') <= 3 \
            and w.count('b') <= 2 and w.count('c') <= 2 and w.count('m') <= 2 and w.count('p') <= 2 and w.count('f') <= 2 and w.count('h') <= 2 \
            and w.count('v') <= 2 and w.count('w') <= 2 and w.count('y') <= 2 and w.count('k') <= 1 and w.count('j') <= 1 and w.count('x') <= 1 \
            and w.count('q') <= 1 and w.count('z') <= 1
    return ok

with open('words.txt', 'rb') as unfiltered:
    with open('filtered_words.txt', 'wb') as filtered:
        filtered.writelines(set((i for i in unfiltered if filter(i))))

