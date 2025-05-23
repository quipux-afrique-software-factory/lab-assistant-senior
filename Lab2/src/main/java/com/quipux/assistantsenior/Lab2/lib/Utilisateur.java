package com.quipux.assistantsenior.Lab2.lib;

public class Utilisateur {

        private String nom;
        private String email;

        public Utilisateur(String nom, String email) {
            this.nom = nom;
            this.email = email;
        }

        public String getNom() {
            return nom;
        }

        public String getEmail() {
            return email;
        }

        public void sauvegarderEnBDD() {
            // Code pour se connecter à la base de données
            System.out.println("Connexion à la base de données...");

            // Code pour insérer l'utilisateur
            System.out.println("Sauvegarde de l'utilisateur: " + nom);
        }

        public void envoyerEmail(String sujet, String contenu) {
            // Code pour configurer le serveur SMTP
            System.out.println("Configuration du serveur SMTP...");

            // Code pour envoyer l'email
            System.out.println("Envoi d'un email à: " + email);
        }

        public void genererRapport() {
            // Code pour générer un rapport PDF
            System.out.println("Génération d'un rapport pour: " + nom);

            // Code pour sauvegarder le rapport
            System.out.println("Sauvegarde du rapport dans le système de fichiers");
        }


// TODO: Refactorisez ce code pour respecter les principes SOLID
// Identifiez les violations des principes SOLID et proposez une meilleure solution
}
