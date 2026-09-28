/* Právne dokumenty a súhlasy — jeden zoznam pre portál aj pre čakáreň.
 *
 * Znenia sú rovnaké na oboch miestach zámerne: klient odklikáva to isté, nech
 * zmluvu uzatvára technik alebo on sám na telefóne, a Záznam o sprostredkovaní
 * potom sedí doslovne. Preto sa tento súbor nekopíruje, ale načítava oboma
 * stránkami.
 *
 * Odkazy vedú na /dokumenty/ (nie na /api/) — končia v e-mailoch a v podpísaných
 * dokumentoch, kde sa neskôr menia ťažko.
 */
(function (globalny) {
  const ZAKLAD = 'https://poistenieautoskiel.sk/dokumenty/';

  /* Dokumenty na nahliadnutie pred uzavretím. Návrh zmluvy a Záznam o
     sprostredkovaní tu nie sú — tie vznikajú až z konkrétnej kalkulácie. */
  const DOKUMENTY = [
    { l: 'Poistné podmienky (VPP)',                                url: ZAKLAD + 'vpp_vozidla.pdf' },
    { l: 'Informačný dokument o poistení (IPID)',                  url: ZAKLAD + 'ipid_vozidla.pdf' },
    { l: 'Obchodné podmienky',                                     url: ZAKLAD + 'obchodne_podmienky.pdf' },
    { l: 'Informácie poskytnuté klientovi pred uzatvorením zmluvy', url: ZAKLAD + 'informacie_pred_uzavretim.pdf' },
    { l: 'Podmienky spracúvania OÚ',                               url: ZAKLAD + 'podmienky_spracuvania_ou.pdf' },
    { l: 'Záznam o dopravnej nehode',                              url: ZAKLAD + 'zaznam_o_nehode.pdf' },
  ];

  /* Súhlasy v poradí, v akom sa zobrazujú. `marketing: true` je jediný
     nepovinný — ostatné musia byť odklikané pred uzavretím.
     `najazd: true` znamená, že odkaz sa skladá až za behu (vyjadrenie nesie
     konkrétny počet kilometrov, ktorý klient zadal). */
  const SUHLASY = [
    { kod: 'elektronicka_komunikacia', l: 'Súhlas s elektronickou komunikáciou',
      url: ZAKLAD + 'suhlas_elektronicka_komunikacia.pdf' },
    { kod: 'spracovanie_ou', l: 'Súhlas so spracovaním osobných údajov',
      url: ZAKLAD + 'suhlas_spracovanie_ou.pdf', marketing: true },
    { kod: 'najazd', l: 'Súhlas k vyjadreniu k ročnému nájazdu km', najazd: true },
    { kod: 'vyjadrenie_k_zmluve', l: 'Súhlas k vyjadreniu k zmluve o poskytnutí finančnej služby',
      url: ZAKLAD + 'vyjadrenie_k_zmluve.pdf' },
    { kod: 'vyjadrenie_fs', l: 'Súhlas s vyjadrením na účely finančného sprostredkovania',
      url: ZAKLAD + 'vyjadrenie_na_ucely_fs.pdf' },
  ];

  globalny.PRAVNE = { ZAKLAD, DOKUMENTY, SUHLASY };
})(window);
