package com.quipux.assistantsenior.Lab1.lib;

import com.quipux.assistantsenior.Lab1.lib.exception.PriorityQueueException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

public class PriorityQueue<T> {

    private List<List<T>> queueItemList;
    // TODO: Définir les structures de données nécessaires

    private int currentHighestPriority;

    public PriorityQueue() {
        queueItemList = new ArrayList<>();
        currentHighestPriority = -1;
    }

    public void enqueue(T item, int priority) {

        if (priority <= 0) {
            throw new PriorityQueueException("La priorité est invalide.Renseigner une priorité superieure ou egale à 1");
        } else {
            int sizeList = queueItemList.size();
            if (priority > sizeList) {

                for (int i = sizeList; i < priority; i++) {
                    queueItemList.add(new ArrayList<>());
                }
            }
            queueItemList.get(priority - 1).add(item);

            setCurrentHighestPriorityAfterEnqueue(priority);

        }

    }

    private void setCurrentHighestPriorityAfterEnqueue(int priority) {
        if (currentHighestPriority == -1) {
            currentHighestPriority = priority - 1;
        } else {

            if ((priority - 1) < currentHighestPriority) {
                currentHighestPriority = priority - 1;
            }

        }
    }

    public Optional<T> dequeue() {
        Optional<T> res = Optional.empty();

        return getHighestPriorityElement(true);

    }

    private Optional<T> getHighestPriorityElement(boolean removeAftertReturn) {
        Optional<T> res = Optional.empty();
        List<T> hightestPriorityItem = null;
        if (!queueItemList.isEmpty()) {
            hightestPriorityItem = queueItemList.get(currentHighestPriority);
            if (!hightestPriorityItem.isEmpty()) {
                res = Optional.of(hightestPriorityItem.get(0));

                if (removeAftertReturn) {
                    hightestPriorityItem.remove(0);
                    if (hightestPriorityItem.isEmpty()) {
                        UpdateHighestPriority();
                    }

                }
            }
        }
        return res;
    }

    private void UpdateHighestPriority() {
        currentHighestPriority=0;
        for (int i = 0; i < queueItemList.size(); i++) {

            if (!queueItemList.get(i).isEmpty()) {

                currentHighestPriority=i;
                break;
            }
        }
    }

    public Optional<T> peek() {
        // TODO: Retourner l'élément de plus haute priorité sans le supprimer
        return getHighestPriorityElement(false);
    }

    public boolean isEmpty() {
        // TODO: Vérifier si la file est vide
        return queueItemList.isEmpty();
    }


}
