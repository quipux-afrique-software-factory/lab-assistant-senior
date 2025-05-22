package com.quipux.assistantsenior.Lab1.lib;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PriorityQueueTest {
    private PriorityQueue<Item> priorityQueue;

    @BeforeEach
    void setUp() {
        priorityQueue=new PriorityQueue<>();

    }


    @Test
    void whenItemIsEnqueueShouldReturnHigestPriority() {

        Item item1=new Item("item1");
        Item item2=new Item("item2");
        Item item21=new Item("item21");
        Item item3=new Item("item3");
        Item item4=new Item("item4");

       assertTrue(priorityQueue.dequeue().isEmpty());

        priorityQueue.enqueue(item4,4);
        priorityQueue.enqueue(item2,2);
        priorityQueue.enqueue(item21,2);
        priorityQueue.enqueue(item3,3);

        assertEquals(item2.getName(),priorityQueue.dequeue().get().getName());
        assertEquals(item21.getName(),priorityQueue.dequeue().get().getName());
       assertEquals(item3.getName(),priorityQueue.dequeue().get().getName());

    }

    @Test
    void peek() {
    }

    @Test
    void isEmpty() {
    }
}