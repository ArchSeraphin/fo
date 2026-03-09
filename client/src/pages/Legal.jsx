import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Legal() {
  return (
    <>
      <Navbar />

      <div className="page-header">
        <div className="container">
          <h1>Mentions légales</h1>
        </div>
      </div>

      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '760px', margin: '0 auto', lineHeight: 1.8, color: 'var(--color-text)' }}>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Identification de l'éditeur</h2>
            <p><strong>Nom :</strong> France Organes</p>
            <p><strong>Forme juridique :</strong> Association loi 1901</p>
            <p><strong>Email :</strong> contact@franceorganes.fr</p>
            <p><strong>Site web :</strong> https://franceorganes.fr</p>

            <h2 style={{ fontSize: '1.5rem', margin: '2.5rem 0 1rem' }}>2. Hébergement</h2>
            <p>Ce site est hébergé par un prestataire d'hébergement situé en France.</p>

            <h2 style={{ fontSize: '1.5rem', margin: '2.5rem 0 1rem' }}>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site (textes, images, logos) sont protégés par le droit d'auteur.
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>

            <h2 style={{ fontSize: '1.5rem', margin: '2.5rem 0 1rem' }}>4. Protection des données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
              vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
              Pour exercer ces droits, contactez-nous à : contact@franceorganes.fr
            </p>
            <p>
              Les données collectées via le formulaire de contact ne sont utilisées qu'à des fins de traitement
              de votre demande et ne sont jamais transmises à des tiers.
            </p>

            <h2 style={{ fontSize: '1.5rem', margin: '2.5rem 0 1rem' }}>5. Cookies</h2>
            <p>
              Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement.
              Aucun cookie publicitaire ou de tracking n'est utilisé.
            </p>

            <h2 style={{ fontSize: '1.5rem', margin: '2.5rem 0 1rem' }}>6. Limitation de responsabilité</h2>
            <p>
              France Organes ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de
              l'utilisateur lors de l'accès au site. Les liens hypertextes présents sur le site ne sauraient engager
              la responsabilité de France Organes quant au contenu des sites vers lesquels ils pointent.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
