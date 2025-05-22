package com.quipux.assistantsenior.Lab1.lib;

import java.util.NoSuchElementException;
import java.util.Optional;

public class PriorityQueue<T> {


    // TODO: Définir les structures de données nécessaires

    public PriorityQueue() {
        // TODO: Initialiser la structure de données nécessaire
    }

    public void enqueue(T item, int priority) {
        // TODO: Ajouter l'élément avec sa priorité
    }

    public Optional<T> dequeue() {
        // TODO: Supprimer et retourner l'élément de plus haute priorité
        return null;
    }

    public Optional<T> peek() {
        // TODO: Retourner l'élément de plus haute priorité sans le supprimer
        return null;
    }

    public boolean isEmpty() {
        // TODO: Vérifier si la file est vide
        throw new UnsupportedOperationException("Méthode non implémentée");
    }

    public void changePriority(T item, int newPriority){
        // TODO: change la priority d' un item existant
    }
}
