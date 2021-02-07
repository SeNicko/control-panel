# Control Panel

---

## Uruchamianie aplikacji

### Włączenie serwera

Należy włączyć serwer dodany do zadania (lub nie lecz wtedy nie będą wyświetlane dane)

### Instalowanie potrzebnych bibliotek

`npm i`

### Aby uruchomić aplikację należy użyć komendy

`npm run serve`

---

## Dokumentacja projektu

Konsola operatorska.

### Framework

Aplikacja została napisana przy użyciu Vue 3. Vue to jeden z frontendowych frameworków. Wybraliśmy ten framework ponieważ udostępnia on `composition api` które pozwala pisać komponenty w nowy sposób pozwalający zarządzać logiką komponentu w czytelniejszy sposób.

### Mapa

Mapa na stronie powstała przy użyciu biblioteki leaflet.js, która umożliwia manipulowanie mapą z poziomu javascript'u. Obrazy mapy pochodzą z open street map. Vue 2 posiada bibliotekę, która integruje leaflet z vue, lecz nie została jeszcze przystosowana do Vue 3. Postanowiłem więc wykorzystać czystą bibliotekę. Mam przez to pełną kontrolę nad kodem oraz wiem, że wszystko będzie działać. Jedyny minus tego rozwiązania to konieczność napisania znacznika html (markera na mapie) w postaci stringa.

### Logika i działanie aplikacji

#### Lista urządzeń

Aplikacja składa się z 2 części. Mapy oraz listy urządzeń pobieranych z api. Lista pozwala zaznaczać urządzenie poprzez kliknięcie na dany rekord. Zaznaczone urządzenie na mapie ma biały kolor, znajduje się w centrum mapy oraz jest zaznaczone na liście przez niebieski prostokąt znajdujący się na lewym boku rekordu. Lista urządzeń dostarcza informację o nazwie urządzenia, numerze seryjnym, typie, zasięgu, baterii, oraz trybie pracy. Typ urządzenia oraz tryb pracy przedstawiony jest w postaci czarnych statycznych ikon. Poziom naładowania baterii oraz zasięg to ikony które zmieniają się dynamicznie w zależności od danych (Naładowana bateria to zapełniona ikonka oraz kolor zielony a rozładowana to pusta ikona baterii oraz kolor czerwony - z zasięgiem działa to w taki sam sposób). Lista pozwala sortować dostępne urządzenia. Sortowanie działa na wszystkie wartości.

#### Mapa

Na mapie widoczne są wszystkie urządzenia, których pozycja jest aktualizowana na bierząco z danymi. Marker urządzenia to ikona przedstawiająca jego typ (Stacja, urządzenie mobilne) z tłem w kolorze zdrowia urządzenia. Wartość zdrowia urządzenia obliczyliśmy korzystając z poziomu baterii oraz aktualnego zasięgu.

### Zapobieganie błędom
