with open('words.txt', 'rb') as unfiltered:
    with open('words_filtered.txt', 'wb') as filtered:
        lines = (i for i in unfiltered if len(i) < 8)
        filtered.writelines(lines)
