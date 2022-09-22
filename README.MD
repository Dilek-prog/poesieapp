# Poesie liebhaber aufgepasst!
*Mit der Poesie App können Poesie liebhaber ihre eigenen Poesie Texte posten. Sie können sich aber auch ganz einfach von anderen Poesie texten inspieren lasssen!*

Im Rahmen meines Studiums "Informatik und Wirtschaft" und das Modul "IKT - Aktuelle Trends der Informations- und Kommunikationstechnik" habe ich eine Progressive Web Application entwickelt. Mit meiner eigenen Idee zur einer Poesie App und den Vorgelegten Skripten meines Professors habe ich alle Anforderungen eindecken können und die App anschließlich Deployen können. 

## Installation

Zur Ausführung des Projektes wurde [Node.js](https://nodejs.org) verendet. Die verwendung von Docker Desktop und MongoDB Compast wurde ebenfalls verwendet.

## Anwendung 

Die Anwendung ist eine Poesie App mit der man neue Poesie Texte hinzufügen kann oder auch löschen kann. 
Wird die Webanwendung angeschaltet (Lokal), wird die Anwendung für jedermann mit dem jeweiligen Link `poesie.pics` sichtbar und benutzbar sein!
Die Webseite besteht aus einer oberen sowie einer linken aufklapbaren Navbar. 
Die Funktion Subscription "Benachrichtigung: Ein" ist sobald sie einmal angeklickt worden ist, nicht mehr zu sehen. Sobald der Installierbutton angeklickt ist, ist auch dieser nicht mehr für die Nutzer zu sehen. 
Sobald eine Poesie gepostet werden soll, wird der Nutzer vorher gefragt, ob Sie die Berechtigung der Kamera anschalten möchte. Sobald das Zugelassen wird, kann er ein Selfie von sich machen. Nun wird der Titel des Posts eingetragen und sobald ein Standort gewählt werden soll, wird der Nutzer mit einem Pup-Up Fenster gefragt, ob der Nutzer diese Einschalten möchte. Im Anschluss kommt der jeweilige Text für den Post und mit dem Speicher Button, wird das 'Formular' ans Backend abgeschickt. Sobald der Nutzer den "Benachrichtigung Ein" Button getätigt hat, sollte nach dem Speichern des Posts ein Pop-Up Fenster bei all denen Nutzer erscheinen die Momentan auf der Seite sind. Diese Funktion wurde durch versuchiedene Subscribtion erstellt, die im Backend hinterlegt werden. Sobald jemand die Benachrichtigung einschaltet, erhählt er automatisch eine Subscription wodurch er eine Push-Notification erhält. 
Nachdem ich diesen Prozess vollständig hinbekommen habe, habe ich mich mit der Delete funktion beschäftigt. Ich wollte, dass man die Posts löschen kann ohne das Postman benutzt wird. Nachdem der Reload von neu erworbenen Post ständig kläglich gescheitert ist habe ich mich intensive damit beschäftigt, wie es denn noch klappen könnte! Sobald ein Post gepostet wird, wird der Post nach 2 Sekunden erscheinen und die weiteren Anwender bekommen zwar ihre Push-Notifikation doch erst nach den Sekunden erhalten sie den eigentlichen Post dazu. Oder sie Klicken auf die Push-Notifikation und gelangen so zu dem neuem Post. Sobald ein Post ohne Internet gepostet wird, wird der Post im "Hintergrund" abgespeichert und erst wieder neu geladen, sobald wieder Internet vorhanden ist.
Ich habe meinen Backend umgeschaltet, dass das Frontend nicht mehr auf den localhost:3000 läuft sondern auf eine /api verweist und dies im index.js festgeschrieben.  

## Kommen wir zum Deployen!
Das Deployen war eines der schwierigsten Angelegenheiten an der App! Da habe ich mir ehrlichgesagt auch etwas hilfe geholt, weil es einfach zu schwer war. Ich habe mir zuerst die App "Docker Desktop" vom Browser heruntergeladen und dann für jeden Part 3 Container erstellt. Der erste Container ist für mein Frontend, der zweite für meinen Backend und der letzte für meine Datenbank. Was wäre eine App ohne Datenbank? 
Die jeweiligen wichtigen Elemente der Anwendung habe ich in die jeweiligen Container festgeschrieben. Die drei Container werden über "docker-compost up" gestartet. Alle Containers werden über ein Temrinal gemeinsam 'verwaltet'. 
--
Meine Favicon habe ich so einfach wie mögich gehalten, um mir selbst treu zu bleiben.

***
PS. Dass ich die App Anfang August komplett von neu Anfangen musste hat mich zuerst richtig Niedergeschmettert aber ich habe erkannt das es das Beste war, was ich machen konnte. Ich habe meine Errungenen Erkenntnisse nocheinmal verfestigen können und über meine alten Fehler nicht ein zweites mal stolpern können, was mich nur mehr bestärkt hat, dass ich das richtige getan habe!