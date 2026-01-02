// src/modules/comptabilite/services/EmailService.js
// 1CFTXE7KMWLKNNZ5GPAV5P4M
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Configuration SMTP
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SENDGRID_API_KEY 
      }
    };

    this.transporter = nodemailer.createTransport(this.config);
  }

  async envoyerRelance(relanceData) {
    try {
      const { numero_facture, email_client, nom_client, montant, jours_retard, message_personnalise } = relanceData;

      const sujet = this.genererSujetRelance(numero_facture, jours_retard);
      const messageHTML = this.genererMessageRelance({
        numero_facture,
        nom_client,
        montant,
        jours_retard,
        message_personnalise
      });

      console.log('🚀 ENVOI RÉEL VIA SENDGRID:');
      console.log('À:', email_client);
      console.log('Sujet:', sujet);

      // ENVOI RÉEL D'EMAIL
      const resultat = await this.transporter.sendMail({
        from: '"OMNISERVE EXPERTS" <mariotfanantenana@gmail.com>', // ← L'email que vous avez vérifié
        to: email_client,
        subject: sujet,
        html: messageHTML
      });

      console.log('✅ EMAIL ENVOYÉ AVEC SUCCÈS!');
      console.log('Message ID:', resultat.messageId);
      
      return {
        success: true,
        message_id: resultat.messageId,
        destinataire: email_client,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erreur envoi email SendGrid:', error);
      throw new Error(`Échec envoi email: ${error.message}`);
    }
  }

  async envoyerRelancesGroupees(factures) {
    try {
      const resultats = [];
      
      for (const facture of factures) {
        try {
          const resultat = await this.envoyerRelance(facture);
          resultats.push({
            facture: facture.numero_facture,
            client: facture.nom_client,
            success: true,
            ...resultat
          });
        } catch (error) {
          resultats.push({
            facture: facture.numero_facture,
            client: facture.nom_client,
            success: false,
            error: error.message
          });
        }
      }

      return {
        total: factures.length,
        reussis: resultats.filter(r => r.success).length,
        echecs: resultats.filter(r => !r.success).length,
        details: resultats
      };

    } catch (error) {
      console.error('Erreur relances groupées:', error);
      throw new Error(`Échec relances groupées: ${error.message}`);
    }
  }

  genererSujetRelance(numero_facture, jours_retard) {
    if (jours_retard > 180) {
      return `🚨 URGENT - Retard de paiement Facture #${numero_facture} - ${jours_retard} jours`;
    } else if (jours_retard > 90) {
      return `⚠️ IMPORTANT - Retard de paiement Facture #${numero_facture} - ${jours_retard} jours`;
    } else {
      return `Rappel - Retard de paiement Facture #${numero_facture} - ${jours_retard} jours`;
    }
  }

  genererMessageRelance({ numero_facture, nom_client, montant, jours_retard, message_personnalise }) {
    const montantFormate = new Intl.NumberFormat('fr-FR').format(montant);
    
    let message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Aquatiko - Rappel de Paiement</h2>
        
        <p>Cher(e) <strong>${nom_client}</strong>,</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Facture #${numero_facture} - Retard de ${jours_retard} jours</h3>
          <p style="margin: 10px 0;"><strong>Montant :</strong> ${montantFormate} MGA</p>
          <p style="margin: 10px 0;"><strong>Statut :</strong> En retard de paiement</p>
        </div>

        <p>Nous constatons que le règlement de cette facture n'a pas encore été effectué.</p>
        
        ${jours_retard > 180 ? `
        <div style="background: #fef2f2; border: 2px solid #dc2626; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="color: #dc2626; margin: 0;">
            <strong>⚠️ URGENCE :</strong> Ce retard dépasse 6 mois. Merci de régulariser cette situation dans les plus brefs délais.
          </p>
        </div>
        ` : ''}

        ${message_personnalise ? `
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0;"><strong>Message personnalisé :</strong> ${message_personnalise}</p>
        </div>
        ` : ''}

        <p>Pour toute question concernant cette facture, n'hésitez pas à nous contacter.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 5px 0;"><strong>Aquatiko</strong></p>
          <p style="margin: 5px 0; color: #6b7280;">By pass tana 102</p>
          <p style="margin: 5px 0; color: #6b7280;">Tél: 020 22 840 61</p>
          <p style="margin: 5px 0; color: #6b7280;">Email: aquatiko@shop.com</p>
        </div>
      </div>
    `;

    return message;
  }

  async testConfiguration() {
    try {
      // Test de la configuration email
      console.log('🧪 Test configuration email:', this.config);
      
      return {
        success: true,
        message: 'Configuration email valide',
        config: {
          host: this.config.host,
          port: this.config.port,
          secure: this.config.secure,
          user: this.config.auth.user
        }
      };
    } catch (error) {
      throw new Error(`Erreur configuration email: ${error.message}`);
    }
  }
}

// ✅ EXPORT UNIQUE
export default EmailService;