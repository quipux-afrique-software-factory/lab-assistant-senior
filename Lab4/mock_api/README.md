

 
## Description des Mock api disponibles


## 1. Consultation des amendes à payer

```bash
GET http://localhost:3000/amendes/
```

## Parametres d' entrée

| Parametre       | Description                                                                  | Obligatoire |
|-----------------|------------------------------------------------------------------------------|-------------|
| immatriculation | Plaque d' immatriculation au format XX-999-XX exemple AA-384-EH ou ZE-658-OU | OUI         |


```bash
# Exemple
$ http://localhost:3000/amendes/?immatriculation=AA-384-EH

Reponse OK
{
    "immatriculation": "AD-384-EH",
    "montant": 10000,
    "numeroLiquidation": "LIQ-3386"
}


En cas d' erreur

{
    "errorCode": "403",
    "errorMessage": "Requete invalide"
}
```

## Parametre de réponse


| Parametre         | Description                                                                  |
|-------------------|------------------------------------------------------------------------------|
| immatriculation   | Plaque d' immatriculation au format XX-999-XX exemple AA-384-EH ou ZE-658-OU |
| montant           | Montant des amendes à payer                                                  |
| numeroLiquidation | Numero de liquidation à utiliser pour faire le paiement                      |
| errorCode         | Code l' erreur (immatriculation manquante  ou invalide)                      |
| errorMessage      | Message de l' erreur                                                         |


En cas de temps de reponse trop long un 504 gateway timeout est levée au niveau du retour http


## 2. Debiter le client via mobile money

```bash
POST/  
application/json 
http://localhost:3000/cashout/
```

## Parametres d' entrée

| Parametre | Description                                           | Obligatoire |
|-----------|-------------------------------------------------------|-------------|
| requestId | Id de la requete doit etre unique pour chaque requete | OUI         |
| telephone | numero de telephone                                   | OUI         |
| montant   | montant à debiter                                     | OUI         |


```bash
# Exemple
POST/
$ http://localhost:3000/cashout/

Json passé en paramètre

{
    "requestId":"az1",
    "telephone":"0777586499",
    "montant":"45000"
}
Reponse OK
{
    "requestId": "az1",
    "telephone": "0777586499",
    "montant": "45000",
    "status": "completed"
}


En cas d' erreur

{
    "errorCode": "403",
    "errorMessage": "Requete invalide"
}
```

## Parametre de réponse


| Parametre    | Description                                                                                                   |
|--------------|---------------------------------------------------------------------------------------------------------------|
| requestId    | L' id de la requete                                                                                           |
| montant      | Montant debité                                                                                                |
| telephone    | Numero de téléphone                                                                                           |
| status       | status de l' operation (completed ou failed)                                                                  |
| errorCode    | code de l' erreur   (403 en cas de parametre d entree manquant ou invalide,429 en cas de requestId dupliquee) |
| errorMessage | Message de l' erreur                                                                                          |


En cas de temps de reponse trop long un 504 gateway timeout est levée au niveau du retour http


## 3. Consultation du statut d' un debit money

cette api permet de verifier de statut d' un debit mobile money en cas de timeout lors d' un paiement

```bash
GET http://localhost:3000/cashout/status/
```

## Parametres d' entrée

| Parametre | Description                             | Obligatoire |
|-----------|-----------------------------------------|-------------|
| requestId | id d' une requete de debit mobile money | OUI         |


```bash
# Exemple
GET http://localhost:3000/cashout/status?requestId=azerty

Reponse OK
{
    "requestId": "azerty",
    "telephone": "0777586499",
    "montant": "45000",
    "status": "completed"
}

En cas d' erreur

{
    "errorCode": "403",
    "errorMessage": "Requete invalide"
}
```

## Parametre de réponse



| Parametre    | Description                                                                   |
|--------------|-------------------------------------------------------------------------------|
| requestId    | L' id de la requete                                                           |
| montant      | Montant debité                                                                |
| telephone    | Numero de téléphone                                                           |
| status       | status de l' operation (completed ou failed)                                  |
| errorCode    | code de l' erreur   (403 en cas de parametre d entree manquant ou invalide)   |
| errorMessage | Message de l' erreur                                                          |




## 4. Payer une amende

```bash
POST/  
application/json 
http://localhost:3000/amendes/payment/
```

## Parametres d' entrée

| Parametre         | Description           | Obligatoire |
|-------------------|-----------------------|-------------|
| numeroLiquidation | numero de liquidation | OUI         |
| montant           | montant à payer       | OUI         |


```bash
# Exemple
POST/
$ http://localhost:3000/amendes/payment/

Json passé en paramètre

{
    "numeroLiquidation":"LIQ-3444",
    "montant":"70500"
}
Reponse OK
{
    "numeroLiquidation": "LIQ-3444",
    "montant": "70500",
    "status": "completed"
}

En cas d' erreur

{
    "errorCode": "403",
    "errorMessage": "Requete invalide"
}
```

## Parametre de réponse


| Parametre         | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| numeroLiquidation | Le numero de la liquidation                                                 |
| montant           | Montant de la liquidation                                                   |
| status            | status de l' operation (completed ou failed)                                |
| errorCode         | code de l' erreur   (403 en cas de parametre d entree manquant ou invalide  |
| errorMessage      | Message de l' erreur                                                        |


En cas de temps de reponse trop long un 504 gateway timeout est levée au niveau du retour http


## 3. Consultation du statut d' un paiement d' amendes

cette api permet de verifier de statut du paiement d'amende en cas de timeout 

```bash
GET http://localhost:3000/amendes/payment/status/
```

## Parametres d' entrée

| Parametre         | Description              | Obligatoire |
|-------------------|--------------------------|-------------|
| numeroLiquidation | numero de la liquidation | OUI         |


```bash
# Exemple
GET http://localhost:3000/amendes/payment/status?numeroLiquidation=azerty

Reponse OK
{
    "montant": 75500,
    "numeroLiquidation": "LIQ-9262",
    "status": "open"
}

En cas d' erreur

{
    "errorCode": "403",
    "errorMessage": "Requete invalide"
}
```

## Parametre de réponse



| Parametre         | Description                                                                                                                                                                                                |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| numeroLiquidation | le numero de la liquidation                                                                                                                                                                                |
| montant           | Montant à payer                                                                                                                                                                                            |
| status            | status de l' operation (open ou completed ou failed) open pour aucun paiement effectué sur cette liquidation,completed pour une liquidation deja payée,failed pour une liquidation avec un paiement echoué |
| errorCode         | code de l' erreur   (403 en cas de parametre d entree manquant ou invalide)                                                                                                                                |
| errorMessage      | Message de l' erreur                                                                                                                                                                                       |



