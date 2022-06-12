# hellofresh-recipe-ocr

## OCR Lösung zum Auslesen von Hellofresh Rezept Karten

Inspiriert vom diesen RIP https://github.com/georgduees/ripFresh. Die Rezepte auszulesen und die Bilder raus extrahieren. 

## Installation 

Das Projekt benötigt Node 14 und NPM 6

Das Repo herunterladen und die Packages installieren.

```
npm i
```

Das Projekt benutzt das Package pdf2pic, welches auf graphicsmagick und ghostscript angewiesen ist. Dazu diese Installationsanleitung durchführen: 
https://github.com/yakovmeister/pdf2image/blob/HEAD/docs/gm-installation.md Aktuell empfohlen ist die Version 1.3.35 von GraphicsMagick. 

Um die Bilder auszulesen wird tesseract benutzt. Tesseract muss auch installiert werden: https://github.com/tesseract-ocr/tessdoc/blob/main/Installation.md
Zudem muss das deutsche Sprachpaket installiert werden. https://github.com/tesseract-ocr/tessdata/

## Import

Die PDFS können im Order data gespeichert werden. Die importierten Daten werden, dann im Ordner result abgelegt. 

Um den Import zu starten: 
```
npm run import
```

## Test

Das Projekt kann mit jest getestet werden. 
```
npm run test
```



