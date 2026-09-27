Ahoj, budeš robiť klientsku stránku do čakárne autoskla na poistenieautoskiel.sk.
Dizajn je hotový, v prílohe je `navrh-cakaren.zip`. Rozbaľ ho do repa, obsah ide
do `docs/cakaren/`.

**Čo je v balíku**

- `navrh-cakaren.md` — špecifikácia celého toku: vstup, cena, uzavretie, platba.
  Hodnoty, texty a správanie sú záväzné, štruktúra kódu nie.
- `nahlad_tok.html` — celý tok klikateľný v prehliadači. Otvor si ho a preklikaj,
  je to rýchlejšie než čítať špecifikáciu.
- `nahlad_cakaren_temy.html` — ten istý krok s cenou v piatich štýloch prevádzok.
  Ukazuje, že farba, písmo, tvar aj logo idú z konfigurácie.
- `hornet-logo.png` — logo prvej prevádzky.

**Čítaj v tomto poradí**

1. Otvor `nahlad_tok.html` a preklikaj celý tok vrátane chybových stavov.
   Vozidlá AA616EM, BA123XY, VIN TMBJJ7NS0N1234567. Firmy 12345678 a 87654321.
   PSČ 94901 a 95301 (dve obce na výber). Čokoľvek iné spustí chybu.
2. Prečítaj `navrh-cakaren.md`, časti 1 až 4.
3. Potom časti 5 až 7 — biely štítok, merania, čo je predstierané.

**Pravidlá, na ktoré sa ľahko zabudne**

- Ceny chodia z `/rate-matrix` ako celá matica variantov. Prepnutie lehoty,
  spoluúčasti alebo variantu je výber z nej, nie nový výpočet. Ceny rizík sa
  v prehliadači nikdy nesčítavajú, cena kombinácie je nelineárna.
- Havária, vandalizmus, zver, krádež a živel musia mať rovnakú spoluúčasť.
  Nulová sa dá len vtedy, keď medzi vybranými nie je havária ani vandalizmus.
  Neplatná kombinácia sa nesmie dostať k Pillow — obrazovka ju rieši sama.
- Dotiahnuté údaje sa nikdy nezobrazujú ako predvyplnené polia, ale ako
  potvrdenie „toto sme našli“ s možnosťou Zmeniť.
- Nikde netvrdiť, že klient je poistený. Poistenie začne platiť po nafotení
  a úhrade. A nepísať, kto vozidlo fotí.
- Pri neoverenej platbe sa nikdy neponúka zaplatiť znova.
- Rodné číslo sa na obrazovke zobrazuje zakryté.
- PZP sa v čakárni neponúka.

**Čo treba doplniť na tvojej strane**

- Register vozidiel na EČV aj VIN, register organizácií na IČO, číselník obcí
  na PSČ.
- Výpočet a uzavretie cez Pillow (AP2), Pay by square QR a platobnú bránu
  s kartou.
- Napojenie na našu aplikáciu na fotoobhliadku a nahratie technického preukazu.
- Odosielanie zmluvy e-mailom.
- Endpoint `/merania` a udalosti z ďalších krokov, ktoré v návrhu nie sú
  (platba_neuspesna s dôvodom od brány).
- Konfiguráciu prevádzok: kód z QR, farba značky, farba akcie, písmo, zaoblenie,
  logo, názov prevádzky.
- Odsek o štatistike používania do zásad ochrany osobných údajov a odkaz naň
  v pätičke každej klientskej obrazovky. Kód relácie nechaj len v pamäti,
  neukladaj ho do cookie ani do local storage — potom netreba lištu so súhlasom.

**Postup**

Choď po obrazovkách v poradí vstup, cena, uzavretie, platba. Po každej sa zastav
a napíš, čo si urobil, skôr než pokračuješ. Najprv testovacie prostredie Pillow
a testovacia karta, ostré prístupy až keď celý tok prejde.

Nasadzujeme na jednu prevádzku ako pilot — Hornet Bratislava, jeden QR kód.
Dva týždne meraní ukážu, či ľuďom neprekáža ťukať EČV a koľko z nich vôbec
otvorí pripoistenia. Až potom ďalšie prevádzky.

Ak niečo zo špecifikácie v kóde nedáva zmysel, zapíš to priamo do
`navrh-cakaren.md` a oprav to, nevymýšľaj obchádzku.
