package com.quipux.assistantsenior.Lab3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Lab3Application {

	public static void main(String[] args) {

		SpringApplication.run(Lab3Application.class, args);
		genererFacture("standard","quipux afrique",200000);

	}

	public static double calculerMontant(String typeFacture, double montantBase) {
		if (typeFacture.equals("standard")) {
			// Facture standard: montant de base + 10% de taxes
			return montantBase * 1.1;
		} else if (typeFacture.equals("remise")) {
			// Facture avec remise: montant de base - 20% de remise + 10% de taxes
			return (montantBase * 0.8) * 1.1;
		} else if (typeFacture.equals("premium")) {
			// Facture premium: montant de base + 15% de frais de service + 10% de taxes
			return (montantBase * 1.15) * 1.1;
		} else {
			throw new IllegalArgumentException("Type de facture inconnu");
		}
	}

	public static void genererFacture(String typeFacture, String client, double montantBase) {
		double montantTotal = calculerMontant(typeFacture, montantBase);

		if (typeFacture.equals("standard")) {
			System.out.println("Facture standard pour " + client + ": " + montantTotal + "FCFA");
		} else if (typeFacture.equals("remise")) {
			System.out.println("Facture avec remise pour " + client + ": " + montantTotal + "FCFA (Remise de 20% appliquée)");
		} else if (typeFacture.equals("premium")) {
			System.out.println("Facture premium pour " + client + ": " + montantTotal + "FCFA (Frais de service inclus)");
		} else {
			throw new IllegalArgumentException("Type de facture inconnu");
		}
	}

}
