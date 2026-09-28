/* QR kód prevádzky ako obrázok — pre CRM, e-maily a tlač mimo nášho letáka.
 *
 * Obrázok sa nikde neukladá, kreslí sa z adresy prevádzky. Nemôže tak vzniknúť
 * vytlačený QR, ktorý ukazuje inam, než kam vedie stránka.
 *
 * Neznámu prevádzku odmietame: QR na prázdnu stránku je horší než žiadny.
 */

const qrcode = require('../cakaren/qr.min.js');

const CIEL = 'https://alexapi.sk';
const DOMENA = 'https://poistenieautoskiel.sk';

module.exports = async (req, res) => {
  const kod = String(req.query.kod || '').replace(/\.svg$/i, '');
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{2,39}$/.test(kod)) {
    res.status(400).json({ chyba: 'Neplatné meno prevádzky.' });
    return;
  }

  const kluc = process.env.ALEX_API_KEY;
  if (!kluc) {
    res.status(503).json({ chyba: 'Stránka nie je nastavená — chýba kľúč na serveri.' });
    return;
  }

  try {
    const r = await fetch(`${CIEL}/cakaren/prevadzka/${encodeURIComponent(kod)}`, {
      headers: { 'X-Api-Key': kluc },
    });
    if (!r.ok) {
      res.status(404).json({ chyba: 'Takú prevádzku register nepozná.' });
      return;
    }
  } catch (err) {
    console.error('qr:', kod, err);
    res.status(502).json({ chyba: 'Register prevádzok neodpovedal.' });
    return;
  }

  /* Úroveň H znesie aj zašpinený alebo prehnutý papier v dielni, štyri moduly
     ticha okolo sú to, čo čítačky očakávajú. */
  const q = qrcode(0, 'H');
  q.addData(`${DOMENA}/${kod}`);
  q.make();

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(q.createSvgTag({ scalable: true, margin: 4 }));
};
