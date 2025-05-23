



# MY API

This is the solution for the Mock Example of DJAMO API Project to integrate a third party API
the Constraints of the the third party API:


- it does not return immediatly if it worked, or not
- it takes a long time to answer (up to 10s)
- it is supposed to call you back through a webhook -- but sometimes it doesn't
- it has a status check API -- but they explicitely said they could block our services if we request it too often
- it will time out (HTTP 504) from time to time, but sometimes the request actually will go through after a longer time (up to 120s).

### MY constraints

Your API is consumed by a mobile application, and the experience needs to feel pleasant for the user. So you need to:

- return a response as fast as possible
- return the success / failure of the transaction as quickly as possible

Due to poor network connectivity, sometimes the mobile application will re-try to send the same request twice. You must detect it and only handle the request once.


## My approach

Functional requirement

- return a response as fast as possible
- return the success / failure of the transaction as quickly as possible

Non Functional requirement
- performance
- scalability
- security

General Approach

1. call the third party Api with a limited maximal waiting time (2 seconds), if the third party api take time longer than the arbitrary timeout for the best user experience.return a pending transaction message
2. otherwise return the result of the third party api
3. Integrate a retry pattern in asynchronous way for pending transactions
4. To avoid to be banned by the owner of the third api by checking too frequently the status of the pending transactions, implement an exponential backoff with a maximal number of 5 retry added to retry pattern
5. the exponential backoff delay for retry will be 1,5,10,15,30 in minutes
5. To avoid to treat the same request twice, make the api idempotent, by storing every request in database and check if the transaction key is already in our database, stop the request and directly return the result


## Option 1 of implementation of this approach

see the sequence diagram

![Alt text](images/option1.png "a title")

### Benefits

1. Simple to implement
2. Very effective in non distributed systems

### Drawbacks

this solution has some scalability issues,if you have multiples instances of your api.
if during the retry process, an instance crashs.We have no way that an another instance continue the retry. This transaction will stay in pending status for forever unless manual intervention


## Option 2 of implementation of this approach

see the sequence diagram

![Alt text](images/option2.png "a title")

the second option is a variant of the first one ,to fix the scalability issue of the first approach,
we introduce to use a Middleware oriented message to manage the retry pattern, the retry process is going through a message queue , in case of multiple instances of the api ,if one instance crash during a retry, the message is redelivered to another consumer to continue the differents checks

in case of peak of pending transactions, adding new instances to consumes the message queue will distribute automatically the pending transactions to the all instances availables and accelerate the process


### Benefits

1. Scalable in distributed systems
2. Very effective in distributed systems

### Drawbacks

Drawbacks of this approach

1. More complex to implement
2. You can face the dual write problem where you have inconsistency between the pending transactions stored in the database and a fail to send it to the message queue for retrying process


## Option 3 of implementation of this approach

see the sequence diagram

![Alt text](images/option3.png "a title")

the third option help to fix the problem of the second option by implemeting the outbox transactional pattern

the outbox transactional pattern consists to add a separate process to check the differents element to send in a message queue. in case of network failure or other , it can retry to resend the item to the message queue


### Benefits

1. Data consistency between database pending transactions and the message queue
2. Scalability of retry process due to the message queue
3. Best user experience

### Drawbacks

Drawbacks of this approach

1. More complexity  to the system
2. More difficult to debug due to the event-driven processing of retry


## Run the solution

Based on the differents benefits and drawbacks and regarding the constraints of Djamo, i choose to implement
the Option 3 of my approach, currently  there is some issues about the exponential backoff to be fixed
i use a schedule task to simulate the separated process of outbox pattern


To build the full project go to the root folder of the project and execute the command below

all container will be setup
```bash
$ docker compose up -d

```

The api will be available to :

```bash
POST/
$ localhost:5000/transaction

```
The body to send is for example:
```bash

{"id":"152399-536694"}

```
An example of response

```bash

{
    "transactionStatusCode": "504",
    "transactionStatus": "pending",
    "message": [
        "Votre transaction est en cours de traitement"
    ]
}

```