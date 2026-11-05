// Unités de formation de l'alternance, reprises de Portfolio_2026 (data/UF.json).
// Page annexe : supprimer parcours-universitaire.html, ce fichier et le lien dans index.html pour la retirer.
window.UNITS = [
 {
  "code": "UF 7.1",
  "title": "Vie Professionnelle : Maîtrise de Projet",
  "objectives": [
   "Organisation, gestion du travail sur un ou plusieurs projets",
   "Mise en œuvre d'une démarche structurée d'analyse",
   "Mobilisation des ressources humaines, techniques, documentaires nécessaires à la réalisation du projet",
   "Mise en application des connaissances de l'apprenti, de son expertise technique ou scientifique"
  ],
  "achievements": [
   {
    "title": "Organisation, gestion du travail sur un ou plusieurs projets",
    "text": "Je travaille sur plusieurs projets simultanément : validation de la conformité des équipements aux spécifications de l'association ITxPT et développement de clients embarqués gérant les certificats TLS. Comme les tests sur les équipements et les réunions peuvent nécessiter de réserver des créneaux horaires spécifiques, je planifie mon travail à l'avance en créant des événements dans mon calendrier Outlook avec des listes de choses à faire pour les différents projets. Je fais le point sur mes réussites et difficultés sur des carnets de notes."
   },
   {
    "title": "Mise en œuvre d'une démarche structurée d'analyse",
    "text": "Dans mon projet de sécurisation de communication embarquée, j'ai d'abord analysé le besoin (d'authentification bout-en-bout et de chiffrement) en étudiant le contexte d'exploitation (situation actuelle, matériel à disposition), les contraintes de maintenance et les exigences techniques. Cette analyse m'a permis de construire un cahier des charges, validé par la SNCF. À partir de ce document, je développe un client de gestion de certificats embarqués répondant à ces exigences."
   },
   {
    "title": "Mobilisation des ressources humaines, techniques, documentaires nécessaires à la réalisation du projet",
    "text": "Pour recueillir le besoin côté maintenance, j'ai été en contact avec le technicentre de Nevers. Cela m'a permis d'élaborer une partie du cahier des charges. J'ai également travaillé avec l'équipe SI en charge de la gestion de la communication bord/sol pour la complétude du cahier des charges. Enfin, je développe le client embarqué et le teste avec le serveur développé par l'équipe SI."
   },
   {
    "title": "Mise en application des connaissances de l'apprenti, de son expertise technique ou scientifique",
    "text": "J'applique mes connaissances en développement Python, cybersécurité et réseaux pour implémenter mes clients embarqués de gestion de certificats. J'utilise également mes connaissances des protocoles de communication et des formats de données pour assurer la conformité des équipements aux spécifications ITxPT."
   }
  ]
 },
 {
  "code": "UF 7.2",
  "title": "Technique : Programmation & Outillage",
  "objectives": [
   "Connaissances des formats et des protocoles d'échanges de données utilisés dans les projets de l'entreprise et leurs manipulations (XML, JSON, blue scan par exemple)",
   "Connaissance et prise en main d'outils liés à l'environnement de travail",
   "Découvrir et s'approprier de nouvelles librairies de fonctions"
  ],
  "achievements": [
   {
    "title": "Connaissance des formats et des protocoles d'échanges de données utilisés dans les projets de l'entreprise",
    "text": "J'ai été confrontée aux formats XML et JSON de par les tests que j'ai joués pour valider les modules ITxPT. J'utilise également YAML pour configurer mes applications clientes. Concernant les protocoles de communication, j'ai utilisé le protocole HTTP (à travers les deux projets sur lesquels je travaille), SSH et SFTP pour les tests de transfert de fichiers sécurisés, et je vais travailler avec MQTT. J'ai également développé une paire d'applications serveur-client communiquant via les protocoles RADIUS et EAP."
   },
   {
    "title": "Connaissance et prise en main d'outils liés à l'environnement de travail",
    "text": "Je suis amenée à travailler en gestion de configuration sous Git et j'ai également utilisé Docker dans le cadre de mes deux projets principaux. Je maîtrise également les outils de développement tels que Visual Studio Code, STM32CubeIDE et d'autres plateformes IDE utilisées pour le développement embarqué."
   },
   {
    "title": "Découvrir et s'approprier de nouvelles librairies de fonctions",
    "text": "J'utilise des librairies liées à la gestion des certificats (pyOpenSSL, cryptography), aux requêtes HTTP (requests, httpx) et aux opérations SSH/SFTP (paramiko). À travers mes projets, j'ai appris à rechercher, évaluer et intégrer des librairies tierces pour résoudre des défis techniques spécifiques."
   }
  ]
 },
 {
  "code": "UF 7.3",
  "title": "Technique : Programmation Système d'Exploitation (ASTRE)",
  "objectives": [
   "Connaître le fonctionnement d'un système d'exploitation (OS) utilisé dans l'entreprise",
   "Mener une étude comparative par rapport à l'existant dans le domaine public",
   "Mettre en œuvre la gestion de l'exécution de plusieurs programmes sur le même processeur ou sur un système embarqué",
   "Communiquer avec un ou deux périphériques en utilisant la notion de pilote d'interruption (Driver)"
  ],
  "achievements": [
   {
    "title": "Connaître le fonctionnement d'un système d'exploitation (OS) utilisé dans l'entreprise",
    "text": "Je travaille avec MatOS (base Ubuntu), l'OS développé par l'ingénierie du matériel pour y porter le client embarqué que j'ai développé dans le cadre de la sécurisation de la communication bord/sol. J'ai appris comment ce système d'exploitation personnalisé gère les ressources matérielles, les services système et le déploiement d'applications sur les équipements ferroviaires."
   },
   {
    "title": "Mener une étude comparative par rapport à l'existant dans le domaine public",
    "text": "MatOS est une version allégée de la distribution Ubuntu optimisée pour faire tourner k3s (Kubernetes allégé) et plusieurs conteneurs Docker sur des systèmes embarqués aux ressources limitées. À travers ce travail, je comprends les différences entre les distributions Linux standards et les versions optimisées pour l'embarqué, incluant les contraintes de ressources, les stratégies de conteneurisation et les techniques d'optimisation."
   },
   {
    "title": "Mettre en œuvre la gestion de l'exécution de plusieurs programmes sur le même processeur ou sur un système embarqué",
    "text": "Je vérifie la compatibilité de l'utilisation de mon client de manière concurrente à la plateforme de communication bord/sol qui gère spécifiquement les échanges avec le sol. Cela implique de comprendre l'ordonnancement des processus, l'allocation des ressources et la communication entre processus sur les systèmes embarqués."
   },
   {
    "title": "Communiquer avec un ou deux périphériques en utilisant la notion de pilote d'interruption (Driver)",
    "text": "J'ai réalisé un driver de piano transformant les lettres w x c v b n m en chiffres 1 à 7 pour jouer des notes. Ce projet a impliqué la compréhension de la gestion des interruptions, la communication matérielle au niveau du noyau et les motifs de développement des pilotes de périphériques."
   }
  ]
 },
 {
  "code": "UF 8.1",
  "title": "Vie Professionnelle : Conduite de Projet",
  "objectives": [
   "Normes et certification, démarche qualité, prise en compte des aspects réglementaires",
   "Recherche de solution en conception / réalisation / produit / service",
   "Réalisation : organiser la mission, conduite de l'équipe, participation à la définition des champs d'action et à l'exercice des responsabilités",
   "Présentation des livrables, bilan des actions, communication des résultats, analyse et engagement d'actions correctives"
  ],
  "achievements": [
   {
    "title": "Normes et certification, démarche qualité, prise en compte des aspects réglementaires",
    "text": "J'ai réalisé une étude approfondie des réglementations du Cyber Resilience Act (CRA) et de leur impact sur les opérations de la SNCF, en particulier pour la division CIM SNCF Voyageurs. Cette étude a impliqué l'analyse des exigences réglementaires, des obligations de sécurité et de leurs conséquences pour les politiques de sécurité du système d'information et les mesures de conformité de l'organisation."
   },
   {
    "title": "Recherche de solution en conception / réalisation / produit / service",
    "text": "J'ai conçu et mis en œuvre un outil de test de connexion SFTP pour analyser et récupérer les caractéristiques de communication, y compris le comportement en zones blanches (connexions rompues). Le projet a impliqué la recherche des protocoles SSH-FTP sécurisés et le développement d'une solution complète répondant aux besoins spécifiques de test des systèmes de communication ferroviaires."
   },
   {
    "title": "Réalisation : organiser la mission, participation à la définition des champs d'action",
    "text": "Pour le projet PoC SFTP, j'ai pris en charge l'organisation de la mission à travers une documentation complète comprenant les documents de spécifications (cahier des charges), les documents d'étude, les diagrammes de Gantt et la gestion des réunions de projet. J'ai participé à la définition des périmètres et des livrables du projet et assuré l'alignement avec les exigences des parties prenantes."
   },
   {
    "title": "Présentation des livrables, communication des résultats",
    "text": "J'ai créé une documentation complète pour toutes les phases de projet incluant les spécifications, les documents d'étude technique et la planification du projet. J'ai organisé et participé à des réunions de projet pour présenter les résultats, démontrer la fonctionnalité de l'outil SFTP et communiquer les avancées aux parties prenantes, en assurant une communication de projet transparente et efficace."
   }
  ]
 },
 {
  "code": "UF 8.2",
  "title": "Technique : Sécurité du Système d'Information",
  "objectives": [
   "Identifier les risques d'une cyberattaque",
   "Comprendre le fonctionnement du Web dans un système d'information complexe",
   "Connaître les failles dans un système et les dispositifs de sécurité",
   "Être capable de proposer une politique de sécurité pour un système d'information"
  ],
  "achievements": [
   {
    "title": "Identifier les risques d'une cyberattaque",
    "text": "Chaque train communique via une carte SIM SNCF par APN privé, mais l'identité du matériel roulant n'est associée qu'après le passage par les serveurs frontaux. Une carte SIM compromise pourrait donc être utilisée pour usurper l'identité d'un train légitime et injecter ou consulter des données sensibles. Dans un contexte ferroviaire, où certaines informations participent à la sécurité et à l'exploitation du réseau, cette vulnérabilité d'usurpation d'identité peut avoir des conséquences importantes."
   },
   {
    "title": "Comprendre le fonctionnement du Web dans un système d'information complexe",
    "text": "J'ai étudié l'architecture de communication bord/sol de la SNCF : les données émises par les trains transitent par les réseaux mobiles 4G/5G, puis par des APN privés opérés par la SNCF, avant d'atteindre les routeurs frontaliers, de traverser une zone protégée par des firewalls, et d'être traitées par les serveurs frontaux qui assurent l'identification et le routage vers les serveurs dorsaux. Ces derniers concentrent les flux des matériels roulants et mettent les données à disposition des applications métier."
   },
   {
    "title": "Connaître les failles dans un système et les dispositifs de sécurité",
    "text": "Bien que les dispositifs de sécurité au niveau transport (APN, firewalls) protègent les données en transit, ils ne permettent pas de garantir l'identité du matériel émetteur. L'absence d'authentification cryptographique directe entre le train et les serveurs frontaux empêche de vérifier l'origine réelle des informations reçues. Par ailleurs, lors du transfert d'un matériel à un exploitant extérieur, le déploiement d'une infrastructure d'APN privés séparée augmente le risque d'erreurs de configuration."
   },
   {
    "title": "Être capable de proposer une politique de sécurité pour un système d'information",
    "text": "Pour résoudre ces vulnérabilités à la racine, j'ai développé un prototype en Python implémentant l'authentification mutuelle (mTLS) entre les passerelles embarquées et le SI. Chaque passerelle est dotée d'un certificat numérique unique servant d'identité électronique. Avant tout échange de données, chaque partie vérifie cryptographiquement l'identité de son interlocuteur, n'autorisant que les communications provenant d'équipements légitimes. Cette approche supprime la dépendance aux tunnels privés tout en résolvant le problème d'usurpation d'identité."
   }
  ]
 },
 {
  "code": "UF 8.3 IPS",
  "title": "Technique : Projet Ergonomie Interface",
  "objectives": [
   "Application des connaissances vues en design d'interface sur l'organisation de l'écran"
  ],
  "achievements": [
   {
    "title": "Application des connaissances en design d'interface sur l'organisation de l'écran",
    "text": "Pour les tests de conformité ITxPT, j'ai conçu une application desktop de mesure de la consommation électrique des équipements sous test. L'interface devait être utilisable par des techniciens sans formation préalable, ce qui a nécessité des choix ergonomiques précis : menus regroupés par fonctionnalités liées, iconographie cohérente (disquette pour la sauvegarde, bouton play pour le démarrage/arrêt), espacement suffisant entre les éléments interactifs et usage cohérent des couleurs. L'écran de configuration sépare clairement les paramètres de la mesure (fréquence d'échantillonnage, seuils) des informations du module (nom de l'équipement, version firmware) pour éviter la surcharge cognitive."
   }
  ]
 },
 {
  "code": "UF 8.3 ASTRE",
  "title": "Technique : Application Microprocesseur (GPU, DSP, ARM)",
  "objectives": [
   "Application des connaissances vues en programmation microprocesseur (GPU, DSP, ARM par exemple)"
  ],
  "achievements": [
   {
    "title": "Application des connaissances en programmation microprocesseur",
    "text": "Dans le projet PoC SFTP, j'ai implémenté un module de suivi SFTP ciblant l'architecture ARM. J'ai compilé et déployé le module depuis un environnement de développement AMD64 (x86-64) vers des systèmes embarqués basés sur ARM utilisés dans les équipements ferroviaires. Cela a nécessité de comprendre les jeux d'instructions ARM, les techniques de compilation croisée utilisant les chaînes d'outils appropriées et les stratégies d'optimisation pour les plateformes embarquées à ressources limitées couramment trouvées dans les opérations ferroviaires."
   }
  ]
 }
];
