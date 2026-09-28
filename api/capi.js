/* Proxy pre klientsku stránku do čakárne.
 *
 * Stránka je verejná a jej zdroják si stiahne ktokoľvek, takže v nej nesmie byť
 * žiadny kľúč. Prehliadač volá /capi/<cesta> na našej doméne, kľúč odberateľa
 * doleje až táto funkcia zo servera.
 *
 * Na rozdiel od proxy na pripoisti.sk, ktorá prepúšťa čokoľvek, je tu ZOZNAM
 * POVOLENÝCH CIEST. S naším kľúčom by sa cez otvorenú proxy dalo volať aj to,
 * čo stránka nepotrebuje. Zoznam potvrdil backend 28. 9. 2026.
 */

const CIEL = 'https://alexapi.sk';

/* Presne to, čo tok čakárne potrebuje — nič viac.
 * /pillow/* je zámerne prefix: uzavretie potrebuje authorize, rate, save aj print
 * a lámať to na jednotlivé cesty by znamenalo úpravu pri každej zmene Pillow. */
const POVOLENE = [
  /^cakaren\/prevadzka\/[A-Za-z0-9-]{1,40}$/,
  /^rate-matrix$/,
  /^bcrm\/vehicle$/,
  /^bcrm\/ico\/\d{6,10}$/,
  /^ciselnik\/[A-Za-z0-9/_-]+$/,
  /^pillow\/.+/,
  /^bcrm\/payment\/(pay|qr|dakujeme)$/,
  /^cakaren\/zmluva$/,
  /^cakaren\/platba$/,
  /^cakaren\/platba\/stav$/,
  /^bcrm\/docs\/zaznam$/,
  /^docs\/[A-Za-z0-9._-]+$/,
  /^merania$/,
];

function telo(req) {
  return new Promise((splnene, zlyhane) => {
    const kusy = [];
    req.on('data', k => kusy.push(k));
    req.on('end', () => splnene(Buffer.concat(kusy)));
    req.on('error', zlyhane);
  });
}

module.exports = async (req, res) => {
  /* Cestu dostávame v parametri, nie ako súbor s viacúrovňovým názvom:
     Vercel taký súbor obslúžil len pri jednej úrovni a hlbšie cesty
     (napr. cakaren/prevadzka/KÓD) končili na 404. */
  const cesta = String(req.query.cesta || '').replace(/^\/+/, '');
  if (cesta.includes('..') || !POVOLENE.some(v => v.test(cesta))) {
    res.status(403).json({ chyba: 'Táto cesta nie je pre klientsku stránku povolená.' });
    return;
  }

  /* Kľúč kontrolujeme až za zoznamom ciest: zamietnutá cesta má byť zamietnutá
     vždy rovnako a nemá prezrádzať, ako je server nastavený. */
  const kluc = process.env.ALEX_API_KEY;
  if (!kluc) {
    res.status(503).json({ chyba: 'Stránka nie je nastavená — chýba kľúč na serveri.' });
    return;
  }

  const otaznik = req.url.indexOf('?');
  const dotaz = otaznik === -1 ? '' : req.url.slice(otaznik);

  const hlavicky = { 'X-Api-Key': kluc };
  if (req.headers['content-type']) hlavicky['Content-Type'] = req.headers['content-type'];
  if (req.headers['accept'])       hlavicky['Accept']       = req.headers['accept'];
  // Kód prevádzky z QR — backend si ho preloží na konto a podľa neho pripíše
  // províziu. Neznámy kód odmietne, preto ho stačí preposlať tak, ako prišiel.
  if (req.headers['x-prevadzka'])  hlavicky['X-Prevadzka']  = req.headers['x-prevadzka'];

  const jeTelo = !['GET', 'HEAD'].includes(req.method);

  try {
    const odpoved = await fetch(`${CIEL}/${cesta}${dotaz}`, {
      method: req.method,
      headers: hlavicky,
      body: jeTelo ? await telo(req) : undefined,
    });

    res.status(odpoved.status);
    const typ = odpoved.headers.get('content-type');
    if (typ) res.setHeader('Content-Type', typ);
    res.setHeader('Cache-Control', 'no-store');
    res.send(Buffer.from(await odpoved.arrayBuffer()));
  } catch (err) {
    console.error('capi:', cesta, err);
    res.status(502).json({ chyba: 'Spojenie so systémom poisťovne zlyhalo.' });
  }
};

// Telo si čítame sami — chodí aj XML pre Pillow, nielen JSON
module.exports.config = { api: { bodyParser: false } };
