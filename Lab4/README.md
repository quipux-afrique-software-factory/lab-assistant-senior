# Paiement des amendes via mobile money

Ce test est une version simplifiée du processus de paiement des amendes et contraventions via mobile money.Il fournit des Fake api qui simulent la latence réseau et les timeout reseau
qui sont dans le dossier mock_api 

Le fichier mock_api/README donne les details des differentes Api

Le dossier your_api va contenir votre api qui va orchestrer le processus ci-dessous

La duree normale pour cet exercice est d' 1H30

## Context

```mermaid
graph TD
    Le client -->|1. verifie le montant de ses amendes 
    YourAPI -->|2. debite le client du montant des amendes
    YourAPI -->|3. met à jour le statut de ses amendes
```

Votre travail sera donc de developper l'api d'orchestration qui aura pour tache :

- De verifier les different parametres
- Debiter le client
- Mettre à jour le statut des amendes
- L'api qui permet d'avoir le montant des amendes à payer sera appelé en dehors de votre api et retournera les differentes informations à passer à votre api


### Contraintes des apis fournis

Les Fake api ont ete developpées à simuler les contraintes réelles de nos partenaires

- Ces apis ne répondent pas immédiatement
- Elles peuvent mettre jusqu'à 10 secondes pour répondre
- Elles peuvent ramener un 504 Timeout aléatoirement
- Elles ont un endpoint pour verifier le statut d'une requete

### Vos contraintes

Afin de garantir la meilleure experience utilisateur possible

- Retourner la réponse aussi vite que possible
- Parfois en cas de problème réseau, une requete peut etre retournée 2 fois.Vous devez pouvoir detecter ces cas et les gerer une seule fois




## Structure

la commande via docker-compose `docker-compose up -d`. va build et demarrer le conteneur contenant les fake apis,
```
.
├── docker-compose.yml
├── README.md
├── mock_api
│    └── README.md
│    └── Dockerfile
└── your_api
    └── README.md
    
```

Votre api devra etre accessible via la commande ci dessous

```
curl -H 'Content-Type: application/json' -X POST localhost:8080/amendes/payments/
```

Vous êtes libre de modifier le fichier docker-compose pour ajouter d'autres elements si le jugez  nécéssaire
il n' est pas obligatoire de deployer votre api dans un conteneur docker via le fichier docker-compose actuel
mais le faire est un plus.
