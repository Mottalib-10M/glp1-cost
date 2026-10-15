# Étude — prix des GLP-1 et médicaments chers aux États-Unis (idée A06, 2026-10-15)

Volume : ≈ 251 000 recherches/mois (Keyword Planner, objetech, États-Unis, relevé du 2026-10-15,
`reports/volumes-2026-10-15/us-glp1-cost.txt`), enchère haute 12–27 €. Validé par l'éditeur le 2026-10-15.

## SERP réel (vérifié le 2026-10-15/16, requêtes « ozempic cost without insurance », « zepbound cost without
## insurance 2026 », « wegovy cost per month 2026 », « glp-1 cost comparison », « medicaid glp-1 coverage by state »)

| Résultat | Type | Ce qu'il fait | Son défaut (constaté) | Ce que nous faisons mieux |
|---|---|---|---|---|
| ro.co, khealth.com, noom.com, weightwatchers.com | DÉFENDU (télésanté) | Articles prix qui renvoient vers leur abonnement | **Outil qui sert à vendre**, pas de calculateur ; weightwatchers cite des offres expirées | Aucun produit vendu, calculateur au premier écran, chaque prix daté et sourcé |
| singlecare.com/prescription/ozempic | DÉFENDU (coupons) | « typical cash price $1,409.72 », 791,97 $ après inscription | **Leads sans résultat** (prix bas conditionné à un compte) ; ignore NovoCare 349 $ et TrumpRx | Prix d'autopago officiels sans inscription, NovoCare / LillyDirect / TrumpRx |
| goodrx.com | DÉFENDU (coupons) | Fourchettes « as of January 2026 » | Prix datés, dépendants du coupon | Relevé hebdomadaire automatique |
| healthline.com | BLOQUÉ (média) | Article | **Périmé** (2022-2024), aucun chiffre 2026 | Données 2026-2027 |
| doctronic.ai/questions/how-much-is-ozempic-without-insurance | PRENABLE | « approximately $900-$1,200 per month » | **Faux ou périmé** : ignore le tarif direct (349 $), présente le 25 $ des assurés comme accessible | Calcul par canal, carte d'économies modélisée avec son plafond de 100 $ |
| tool.teamzlab.com (GLP-1 cost comparison calculator) | CLONE | Calculateur générique | **Faux ou périmé** : « approximate estimates as of early 2026 », aucune source, ni TrumpRx ni prix négociés ni Bridge ; promeut les préparations magistrales | Sources officielles par prix, Medicare 2026/2027, Bridge 50 $, Medicaid |
| glp1compass (onrender) | CLONE | Tableau des prix catalogue | **Texte sans simulateur**, « verify current » | Simulateur complet + tableau tiré du moteur |
| kff.org, pewresearch.org (Medicaid par État) | BLOQUÉ | Liste des États (janvier 2026) | Liste de seconde main, pas mise à jour | Données SDUD de CMS : ordonnances réellement remboursées par État et trimestre |
| media.pecb.com et autres pages spam | — | Pages générées | Spam | — |

SERP défendue en tête (télésanté, coupons) mais **pas imprenable** : doctronic.ai, teamzlab, glp1compass
(indépendants) sont classés.

## En quoi on fait mieux (phrase §6.6)

Ce site fait mieux que le premier résultat Google parce qu'il donne, pour le dosage du lecteur et sa façon
de payer, le chiffre qu'il paiera réellement (autopago fabricant = TrumpRx, prix catalogue, coût pharmacie
NADAC, part Medicare Partie D 2026 et 2027 avec plafond, Bridge à 50 $, Medicaid), chaque montant daté et lié
à TrumpRx.gov, CMS ou au fabricant, mis à jour automatiquement chaque semaine — sans inscription, sans vente.

## Actif de données (non clonable en une semaine)

- 12 fiches TrumpRx suivies (dosages, prix, prix catalogue WAC, prix « retard », offres) + catalogue complet
  (844 fiches) ;
- NADAC hebdomadaire (66 conditionnements) ;
- fichier CMS des prix négociés (25 médicaments × 2026/2027, + liste 2028) ;
- SDUD Medicaid (52 États/territoires × 6 GLP-1 × 5 trimestres) ;
- paramètres Partie D 2026/2027 (Rate Announcement 2027, tableau V-2) et règles du GLP-1 Bridge.

## Risques

YMYL maximal (avertissement partout, aucun conseil) ; prix volatils (relevé hebdomadaire) ; AdSense restrictif
sur la pharmacie ; aucun prix de préparation magistrale (volontairement).
