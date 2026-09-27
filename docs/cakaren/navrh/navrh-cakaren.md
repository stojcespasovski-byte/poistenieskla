# Klientsky tok do čakárne autoskla — návrh

Verzia k 27. 9. 2026. Návrh obrazoviek pre web, ktorý si klient otvorí z QR kódu
v čakárni autoskla a sám si vyklikne poistenie skla.

V balíku sú dva súbory na otvorenie v prehliadači:

- `nahlad_tok.html` — celý tok, klikateľný. **Toto je záväzný návrh.**
- `nahlad_cakaren_temy.html` — ten istý krok s cenou v piatich štýloch prevádzok,
  ukážka bieleho štítku.

Hodnoty, texty a správanie sú záväzné. Štruktúra DOM, názvy tried a rozdelenie
komponentov nie sú, to si spravte, ako vám vyhovuje.

---

## 0. Kontext

Klient čaká na výmenu skla. V čakárni je leták s QR kódom, naskenuje ho a na
svojom telefóne si kúpi poistenie. QR nesie kód prevádzky, takže stránka vie,
v ktorom servise klient sedí, a podľa toho sa ofarbí a označí.

Hore je logo servisu, nie naše. Naša značka je až v pätičke pri poisťovni.
Je to jeho systém v jeho čakárni.

Produkt je poistenie skla od Pillow (riziko SK2 produktu AP2). Ostatné riziká
toho istého produktu sú pripoistenia.

---

## 1. Krok 1 — vstup

Dve polia, nič viac.

**Vozidlo — EČV alebo VIN.** Jedno pole. Rozhoduje dĺžka: 17 znakov je VIN,
kratší zápis je evidenčné číslo. Vyhľadanie sa spustí samo po krátkej pauze,
medzitým beží „Hľadáme vozidlo…“.

**Držiteľ — rodné číslo alebo IČO.** Jedno pole, rozhoduje počet číslic:

- 8 číslic = IČO → hľadá sa v registri organizácií, výsledok je PO alebo SZČO,
  klient nedopisuje nič, ani sídlo.
- 9 alebo 10 číslic = rodné číslo → fyzická osoba. Deväťmiestne majú ľudia
  narodení pred rokom 1954, nesmú sa zamieňať s IČO.

Pri fyzickej osobe pribudne **PSČ**. Obec sa dotiahne z číselníka. Keď na jedno
PSČ pripadá viac obcí, zobrazí sa roleta a klient si vyberie; dovtedy nie je
krok hotový.

**Nájdené údaje sa nedajú prepisovať.** Sú to potvrdenia, nie predvyplnené polia:
po nájdení pole aj s nápovedou zmizne a ostane blok s fajkou a s tým, čo sme
našli, plus tiché „Zmeniť“, ktoré pole vráti a vymaže aj PSČ.

Rodné číslo sa v potvrdení zobrazuje zakryté — vidno len dátumovú časť,
koncovka je bodky. V čakárni sa cez plece pozerá ktokoľvek.

Vozidlo sa potvrdzuje značkou, modelom, rokom, výkonom a palivom, pod tým sú
EČV a VIN vedľa seba.

**Keď sa nenájde:** vypíše sa, čo s tým — skontrolovať znaky, zadať VIN,
obrátiť sa na technika; pri IČO aj možnosť zadať rodné číslo.

**Doplnenie vozidla ručne (28. 9. 2026, rozhodol user).** Keď vozidlo v registri nie je
(prepis, nové auto, cudzia značka), klient nemá ako pokračovať: register nedodá VIN ani
farbu a bez nich Pillow zmluvu nevystaví. Preto sa otvorí okno, kde údaje prepíše
z technického preukazu — ten má pri sebe, auto je práve v servise.

Okno pýta presne to, čo treba na cenu a na uzavretie, nič navyše:

| Pole | Načo |
|---|---|
| VIN | uzavretie (Pillow ho vyžaduje) |
| Značka, model | cena |
| Dátum prvej evidencie | cena |
| Palivo, objem, výkon, hmotnosť | cena |
| Farba | uzavretie (Pillow ju vyžaduje) |

Značka a model sú rolety z číselníka Pillow, nie voľný text — inak sa kalkulácia
nespáruje. Okno sa dá zavrieť a pokračovať cez technika; nie je to slepá ulička.

Tlačidlo je neaktívne, kým nie je všetko. Pod ním je vždy napísané, čo chýba.

---

## 2. Krok 2 — cena

**Sklá sú dominantné**, pripoistenia druhoradé, ale nie schované.

Hore je tichý riadok s tým, čo sa našlo, a odkazom späť na vstup.

**Dlaždica skiel** (tmavá, vo farbe prevádzky) obsahuje:

- cenu za zvolenú lehotu,
- tri body krytia, presne v tomto znení:
  - Kryje všetky sklá a okná na vozidle — *čelné, bočné, zadné, panoráma, strešné*
  - Originálne diely vrátane senzorov a kalibrácie — *bez limitov a v plnej cene*
  - Spoluúčasť pri výmene iba 10 % — *pri oprave bez spoluúčasti*
- prepínač lehoty v poradí **štvrťročne, polročne, ročne**, predvolené je ročne.
  V každom tlačidle je cena tej splátky, nie percentuálna prirážka. Nevybrané
  lehoty sú tichšie než vybraná.

**Pripoistenia sú zbalené** pod jeden pokojný riadok „Ostatné pripoistenia
k vozidlu“ s počtom možností vpravo. Je to špecializovaný web pre autosklo,
takže pripoistenia sa neponúkajú nasilu. Keď si klient niečo vyberie a blok
zbalí, v riadku svieti „vybrané N“, aby súčet dole sedel s tým, čo je vidieť.

Po rozbalení je osem dlaždíc v poradí: Živel, Stret so zverou, Krádež, Dopravná
nehoda, Vandalizmus, Asistencia, Úraz vodiča, Batožina. PZP sa tu neponúka vôbec.

**Spoluúčasť** (pravidlo Pillow): riziká havária, vandalizmus, zver, krádež
a živel musia mať rovnakú spoluúčasť. Nulová sa dá zvoliť len vtedy, keď medzi
vybranými nie je havária ani vandalizmus.

Obrazovka to rieši takto:

- Panel „Spoluúčasť pri škode“ sa objaví až vtedy, keď je vybrané aspoň jedno
  z tej päťky, a zmizne, keď ich klient všetky odznačí.
- Štyri možnosti: Bez spoluúčasti, 150 €, 300 €, 600 €. Predvolené 300 €.
- Riadok pod nimi menuje práve vybrané riziká, ktorých sa voľba týka.
- Keď je vybraná havária alebo vandalizmus, „Bez spoluúčasti“ je zošednuté.
- Keď má klient nastavené „Bez“ a klikne na havárie alebo vandalizmus, klik sa
  nezakazuje — spoluúčasť sa prepne na 300 € a vypíše sa veta, čo sa stalo.
  Neplatná kombinácia sa tak k Pillow nikdy nedostane.

**Varianty.** Asistencia, Úraz vodiča a Batožina majú v dlaždici zvolený variant
a odkaz „Zmeniť“, ktorý otvorí spodné okno so zoznamom a cenami. Výber variantu
zároveň dlaždicu vyberie.

**Ceny.** V ostrej verzii prichádzajú z `/rate-matrix`, ktorá vráti naraz všetky
varianty. Prepnutie lehoty, spoluúčasti aj variantu je teda výber z už stiahnutej
matice, nie nový výpočet. **Ceny rizík sa v prehliadači nesmú sčítavať**, cena
kombinácie je nelineárna.

Dole je lišta so súčtom a tlačidlom Pokračovať.

---

## 3. Krok 3 — uzavretie

Nadpis „Uzavretie“, podtitul „Ešte dva kontakty a zmluva je hotová“.

Rekapitulácia: vozidlo, držiteľ, poistenie, lehota platby, suma na úhradu.

Polia: **meno**, **priezvisko**, **e-mail** a **telefón**; pri fyzickej osobe aj
**ulica a číslo** — PSČ a obec už máme a sú pripomenuté sivým riadkom pod poľom.
Firma adresu ani meno nedopĺňa, má sídlo aj obchodné meno z registra.

> **Zmena oproti pôvodnému návrhu (28. 9. 2026, odsúhlasil user).** Meno a priezvisko
> v návrhu neboli nikde. Pillow ich pri uzavretí vyžaduje a z rodného čísla sa
> odvodiť nedajú, takže zmluva by nevznikla — spadlo by to až pri uzatváraní.

Dva súhlasy, každý zvlášť, nikdy nie hromadne a nikdy nie predškrtnuté:
povinné poistné podmienky a nepovinný marketing.

Tlačidlo je **„Uzatvoriť zmluvu“**, nie zaplatiť. Je neaktívne, kým niečo chýba,
a pod ním je napísané, čo konkrétne.

---

## 4. Krok 4 — uzatvorené a platba

Nadpis **„Uzatvorené“** so zelenou fajkou vedľa (slovo ostáva v strede stránky).
Pod tým: *Zmluvu sme poslali na <e-mail>. Poistenie začne platiť po nafotení
a úhrade.* Nikde netvrdiť, že klient je už poistený, ani že vozidlo fotí technik.

**Platobná karta:** suma v jednom riadku s popisom „Na úhradu“, QR kód,
IBAN, variabilný symbol, splatnosť a tlačidlo „Zaplatiť kartou“.

QR sa dá klepnutím otvoriť na celú obrazovku a uložiť ako PNG — pre toho, kto
platí z iného zariadenia. V ostrej verzii je to Pay by square s IBAN-om, sumou
a variabilným symbolom.

**Tri odpovede brány**, obrazovka musí vedieť všetky:

| Stav | Čo sa zobrazí |
|---|---|
| Zaplatené | zelené potvrdenie, tlačidlo „Hotové“ |
| Neoverená | oranžové, **„Neplaťte znova, peniaze mohli odísť“**, tlačidlo vypnuté |
| Neprešla | červené, zmluva platí, tlačidlo „Skúsiť platbu znova“ |

Neoverená je najdôležitejší stav. Druhá platba za tú istú zmluvu je horší
problém než nejasnosť, preto sa opakovanie vôbec neponúka.

**Ešte treba** — dve tlačidlá vedľa seba, bez vysvetliviek, obe otvoria vašu
aplikáciu: **Fotoobhliadka** a **Doložiť TP**. Po splnení zozelenejú a zmenia
sa na „Hotové“.

Pod tým jeden tichý riadok: zmluva príde e-mailom, pri škode sa volá priamo
poisťovni.

---

## 5. Biely štítok

Štýl prevádzky je štvorica hodnôt plus logo, nastavuje sa raz podľa kódu
prevádzky z QR:

- `--znacka` — farba značky (tmavá dlaždica, vybrané pripoistenie, odkazy),
- `--akcia` — farba hlavnej akcie (platba, pokračovať); u Hornetu oranžová,
- `--pismo` — písmo,
- `--r-karta`, `--r-velka`, `--r-mala` — zaoblenie,
- logo ako obrázok v hlavičke.

Všetky odtiene sa odvodia cez `color-mix`, takže návrh znesie aj inú farbu než
súčasnú. Je aj svetlá varianta hlavnej dlaždice pre značky, kde by tmavá plocha
pôsobila cudzo — v ukážke ju má „Servis Nová“.

Pravidlo farieb: **jedna farba je značka, druhá je akcia.** Keby boli všetky
tlačidlá oranžové, klient nevie, čím začať.

---

## 6. Merania

Kód prevádzky z QR (`?p=HORNET-BA01`) ide s každou udalosťou, plus náhodný kód
relácie, ktorý drží celý tok. Posiela sa cez `navigator.sendBeacon` na vlastný
endpoint; chyba merania nesmie nikdy zdržať ani zhodiť obchod.

**Kontext, raz keď je známy:**

- `kontext_auto`: značka, model, rok, kW, palivo
- `kontext_klient`: typ (FO/SZČO/PO), rok narodenia pri FO, PSČ, obec

Neposielať EČV, rodné číslo, meno, e-mail, telefón ani číslo zmluvy.

**Udalosti z návrhu:** otvorenie, auto_nenajdene, ico_nenajdene, obec_na_vyber,
obec_vybrana, klient_zmena, auto_zmena, zobrazit_cenu, lehota_zmenena,
pripoistenia_rozbalene, pripoistenia_zbalene, pripoistenie_pridane,
pripoistenie_odobrate, varianty_otvorene, variant_zmeneny, spoluucast_zmenena,
spoluucast_vynutena, pokracovat, udaje_zacate, udaje_vyplnene, suhlas_podmienky,
suhlas_marketing, zmluva_vydana, platba_zacata, platba_uspesna, qr_otvoreny,
qr_ulozeny, fotoobhliadka_odoslana, tp_dolozeny, odchod.

**Doplniť v ostrej verzii:** platba_neuspesna s dôvodom od brány, prípadne
stav neoverenej platby.

Kód relácie nechať len v pamäti. Keď sa neukladá nič do zariadenia, netreba
lištu so súhlasom.

Do zásad ochrany osobných údajov patrí odsek o štatistike používania —
text je v správe, ktorá prišla s týmto balíkom.

---

## 7. Čo je v návrhu predstierané

- Registre vozidiel, organizácií a obcí — pár vzoriek priamo v súbore.
- Ceny aj koeficienty spoluúčasti. Skutočné prídu z Pillow.
- Platobná brána, QR kód aj číslo zmluvy.
- Prepínač odpovedí brány na konci obrazovky je ukážkový, do ostrej verzie
  nepatrí. To isté platí pre čierny výpis meraní a lištu s témami.

---

## 7b. Vedomé rozhodnutia

- **Číslo dokladu totožnosti sa nepýta** (28. 9. 2026, rozhodol user). Pillow ho
  na uzavretie nepotrebuje; tlačí sa do Záznamu o sprostredkovaní, kde teda ostane
  prázdny riadok. V čakárni je každé pole navyše dôvod odísť. Nie je to prehliadnutie.

---

## 8. Otvorené otázky

- Ktoré z pripoistení má čakáreň ponúkať, je rozhodnutie produktu, nie adaptéra.
  Návrh počíta s ôsmimi a bez PZP.
- Minimálna suma v eurách pri percentuálnej spoluúčasti batožiny nie je
  v schéme; nevymýšľať ju.
- Koľko ľudí vôbec otvorí pripoistenia, sa dozvieme až z meraní. Ak to bude pod
  pár percent, stojí za skúšku ponúknuť ich ako medzikrok po kliknutí na
  Pokračovať, keď je kúpa už rozhodnutá.
