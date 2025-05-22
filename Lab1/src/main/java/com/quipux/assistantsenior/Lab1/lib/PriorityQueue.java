package com.quipux.assistantsenior.Lab1.lib;

import com.quipux.assistantsenior.Lab1.lib.exception.PriorityQueueException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

public class PriorityQueue<T> {


    // TODO: Définir les structures de données nécessaires

    private int currentHighestPriority;

    public PriorityQueue() {

    }

    public void enqueue(T item, int priority) {
        // TODO: Ajouter l' element avec sa priorité
    }


    public Optional<T> dequeue() {
        // TODO: Retourner l'élément de plus haute priorité et le supprimer
        return null;
    }


    public Optional<T> peek() {
        // TODO: Retourner l'élément de plus haute priorité sans le supprimer
        return null;
    }

    public boolean isEmpty() {
        // TODO: Vérifier si la file est vide
        return false;
    }


}
